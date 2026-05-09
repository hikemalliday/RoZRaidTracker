# RoZ Loot Tracker
- Website with active user base to track guild raid and item data 
- https://roz.yeetorskeet.com/
- user: member (case sensitive)
- pass: zeknumberone1234!
- Discord bot app is used to track raid attendance by making a `POST` request to take raid logs
- `Compare`page is used by officers to provide data when awarding raid loot

# Local setup to emulate prod architecture

- There are un-commited files: `emulate-prod.yml` and `local.conf`.
- These allow a local setup that uses NGINX to serve assets, similar to app architecture in prod
- The `local.conf` file is a stripped down version with no HTTPS cert handling. This is simply a means to test nginx serving built assets, by accessing the assets in the vite app dir via volume mapping

# Env vars
- App depends on the following env var files, for both local development and prod:
  - `./frontend/.env.local`
  - `./frontend/.env.production`
  - `./roz_loot_tracker/.env` (for AWS boto3 cronjob that bucks up database, handled by .py script)

# Misc
- `./roz_loot_tracker/backup_db.py` is a script that backs up the sqlite db by uploading it to an S3 bucket. This script depends on a `.venv` in the same folder, so that it can use boto3 lib. Currently, this chron is running once a day on the digital ocean VM.