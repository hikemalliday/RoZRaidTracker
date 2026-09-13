from io import BytesIO

from PIL import Image

from app.rest.helper import SCREENSHOT_MAX_WIDTH, _format_image


def test_format_image_converts_to_webp_and_limits_width():
    source = BytesIO()
    Image.new("RGB", (1600, 400), color="red").save(source, format="PNG")

    output = _format_image(source.getvalue())

    with Image.open(output) as formatted_image:
        assert formatted_image.format == "WEBP"
        assert formatted_image.size == (SCREENSHOT_MAX_WIDTH, 200)


def test_format_image_does_not_upscale_smaller_images():
    source = BytesIO()
    Image.new("RGB", (640, 320), color="blue").save(source, format="PNG")

    output = _format_image(source)

    with Image.open(output) as formatted_image:
        assert formatted_image.size == (640, 320)
