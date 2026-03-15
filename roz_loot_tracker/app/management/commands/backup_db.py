import os
from datetime import datetime

from django.core.management.base import BaseCommand
import boto3


class Command(BaseCommand):
    help = "Upload sqlite file to s3 bucket"

    def handle(self, *args, **options):
        bucket_name = os.getenv('S3_BUCKET_NAME')
        s3 = boto3.resource('s3')
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        s3_key = f"db_{timestamp}.sqlite3"

        with open('db.sqlite3', 'rb') as data:
            s3.Bucket(bucket_name).put_object(Key=s3_key, Body=data)

        self.stdout.write(self.style.SUCCESS(f"Successfully uploaded sqlite file to s3 bucket."))
