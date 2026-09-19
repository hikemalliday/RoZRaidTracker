"""
  **Since we run in docker-compose on prod, we need to first copy
  the legacy screenshots into the app service/container.
  These will get cleaned up on the next docker-compose build.**

  docker compose exec app mkdir -p /legacy_screenshots
  docker cp frontend/src/screenshots/. django-app:/legacy_screenshots/
"""
import hashlib
from django.core.management.base import BaseCommand
from app import models
from pathlib import Path
from app.rest.helper import format_image, checksum_exists, upload_image_to_s3


class Command(BaseCommand):
    help = "Upload/insert legacy screenshots to S3/db, respectively."

    def handle(self, *args, **kwargs):
        ss_dir = Path("/legacy_screenshots")

        for path in ss_dir.iterdir():
            if path.is_file():
                image_bytes = path.read_bytes()
                formatted_image = format_image(image_bytes)
                checksum = hashlib.sha256(formatted_image.getvalue()).hexdigest()
                if checksum_exists(checksum):
                    self.stderr.write(f"Checksum already exists in database for image '{path.name}'.")
                resp = upload_image_to_s3(formatted_image)
                file_size_bytes = resp["file_size_bytes"]
                object_key = resp["object_key"]
                content_type = resp["content_type"]
                submitted_by_discord_id = ".grixus"
                discord_message_id = f"legacy-{checksum[:25]}"
                models.Screenshot.objects.create(
                    object_key=object_key,
                    content_type=content_type,
                    file_size_bytes=file_size_bytes,
                    caption="",
                    submitted_by_discord_id=submitted_by_discord_id,
                    discord_message_id=discord_message_id,
                    checksum=checksum,
                )
                self.stdout.write(self.style.SUCCESS(f"Successfully uploaded/inserted image: {path.name}"))
        self.stdout.write(self.style.SUCCESS(f"Successfully uploaded/inserted legacy screenshots."))
