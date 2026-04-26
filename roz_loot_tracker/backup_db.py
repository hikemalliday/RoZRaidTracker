import os
from datetime import datetime
import boto3

def load_env_file():
    with open(".env", "r") as f:
        for line in f:
            line = line.strip()
            # split key=value
            if "=" in line:
                key, value = line.split("=", 1)
                # remove optional quotes
                value = value.strip().strip('"').strip("'")
                os.environ.setdefault(key, value)

def backup_db():
    try:
        with open("db.sqlite3", 'rb') as data:
            s3.Bucket(bucket_name).put_object(Key=s3_key, Body=data)
            print("Successfully backed up the DB to S3!")
    except Exception as e:
        print(f"Could not backup the database:")
        print(e)

load_env_file()
bucket_name = os.getenv('S3_BUCKET_NAME')
s3 = boto3.resource('s3')
timestamp = datetime.now().strftime("%Y-%a-%d_%H-%M-%S")
s3_key = f"sb_{timestamp}.sqlite3"
backup_db()
