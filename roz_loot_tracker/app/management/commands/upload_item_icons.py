"""
One-off script to migrate item icons to S3.
"""
from io import BytesIO

from django.core.management.base import BaseCommand
from pathlib import Path
from app.rest.helper import upload_image_to_s3


class Command(BaseCommand):
    help = "Upload item icons to S3."

    def handle(self, *args, **kwargs):
        ss_dir = Path("/item_icons")

        for path in ss_dir.iterdir():
            if path.is_file():
                image_bytes = path.read_bytes()
                upload_image_to_s3(
                    BytesIO(image_bytes),
                    file_name=path.stem,
                    parent_dir="icons",
                    file_type="png",
                )
                self.stdout.write(self.style.SUCCESS(f"Successfully uploaded icon: {path.name}"))
        self.stdout.write(self.style.SUCCESS(f"Successfully uploaded item icons."))
