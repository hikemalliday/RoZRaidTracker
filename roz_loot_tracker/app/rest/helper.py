import os
from io import BytesIO
from uuid import uuid4

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from django.utils import timezone
from PIL import Image, ImageOps, UnidentifiedImageError

SCREENSHOT_MAX_PIXELS = 40_000_000
SCREENSHOT_MAX_WIDTH = 800
WEBP_QUALITY = 80


class S3UploadError(Exception):
    """Raised when a screenshot cannot be uploaded to S3."""


class InvalidImageError(ValueError):
    """Raised when an uploaded file cannot be converted into a screenshot."""


def _format_image(image) -> BytesIO:
    """Convert an uploaded image to a WebP screenshot no wider than 800 pixels.

    ``image`` may be raw bytes or a binary file-like object, including Django's
    ``UploadedFile``. Images narrower than the maximum are not enlarged.
    """
    source = BytesIO(image) if isinstance(image, bytes) else image

    try:
        with Image.open(source) as opened_image:
            if opened_image.width * opened_image.height > SCREENSHOT_MAX_PIXELS:
                raise InvalidImageError("_format_image: image dimensions are too large")
            opened_image.load()
            formatted_image = ImageOps.exif_transpose(opened_image)

            if formatted_image.width > SCREENSHOT_MAX_WIDTH:
                new_height = round(formatted_image.height * SCREENSHOT_MAX_WIDTH / formatted_image.width)
                formatted_image = formatted_image.resize((SCREENSHOT_MAX_WIDTH, new_height), Image.Resampling.LANCZOS)

            # WebP supports transparency, but palette images need conversion before saving.
            if formatted_image.mode in {"RGBA", "LA"} or "transparency" in formatted_image.info:
                formatted_image = formatted_image.convert("RGBA")
            else:
                formatted_image = formatted_image.convert("RGB")

            output = BytesIO()
            formatted_image.save(output, format="WEBP", quality=WEBP_QUALITY, method=6)
    except (
        UnidentifiedImageError,
        OSError,
        Image.DecompressionBombError,
    ) as exc:
        raise InvalidImageError("_format_image: invalid image data") from exc

    output.seek(0)
    return output


def _create_s3_key() -> str:
    uploaded_at = timezone.now()
    return f"screenshots/{uploaded_at:%Y/%m}/{uuid4()}.webp"


def upload_image_to_s3(image_data) -> dict:
    if not image_data:
        raise InvalidImageError("upload_image_to_s3: invalid 'image_data'")
    formatted_image = _format_image(image_data)
    bucket_name = os.getenv("S3_ASSETS_BUCKET_NAME")
    if not bucket_name:
        raise S3UploadError("S3_ASSETS_BUCKET_NAME is not configured")
    s3 = boto3.resource("s3")
    s3_key = _create_s3_key()
    try:
        s3.Bucket(bucket_name).put_object(
            Key=s3_key,
            Body=formatted_image,
            ContentType="image/webp",
            CacheControl="public, max-age=31536000, immutable",
        )
        return {
            "object_key": s3_key,
            "content_type": "image/webp",
            "file_size_bytes": len(formatted_image.getvalue()),
        }
    except (ClientError, BotoCoreError) as exc:
        raise S3UploadError("Unable to upload image to S3.") from exc
