import hashlib
from io import BytesIO

import pytest
from PIL import Image

from app.models import Screenshot
from app.rest.helper import SCREENSHOT_MAX_WIDTH, checksum_exists, format_image


def test_format_image_converts_to_webp_and_limits_width():
    source = BytesIO()
    Image.new("RGB", (1600, 400), color="red").save(source, format="PNG")

    output = format_image(source.getvalue())

    with Image.open(output) as formatted_image:
        assert formatted_image.format == "WEBP"
        assert formatted_image.size == (SCREENSHOT_MAX_WIDTH, 200)


def test_format_image_does_not_upscale_smaller_images():
    source = BytesIO()
    Image.new("RGB", (640, 320), color="blue").save(source, format="PNG")

    output = format_image(source)

    with Image.open(output) as formatted_image:
        assert formatted_image.size == (640, 320)


@pytest.mark.django_db
def test_check_exists():
    image_data = b"this is a dummy image"
    checksum = hashlib.sha256(image_data).hexdigest()
    assert not checksum_exists(checksum)
    Screenshot.objects.create(
        object_key="test_key",
        content_type="png",
        file_size_bytes=123,
        submitted_by_discord_id=".grixus",
        discord_message_id="test message",
        checksum=checksum,
    )
    assert checksum_exists(checksum)
