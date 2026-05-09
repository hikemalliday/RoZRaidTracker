# RoZ Loot Tracker
- Website with active user base to track guild raid and item data 
- Lovingly built (mostly) by hand. AI assisted with CSS.
- https://roz.yeetorskeet.com/
- user: member (case sensitive)
- pass: zeknumberone1234!
- Discord bot app is used to track raid attendance by making a `POST` request to take raid logs
- `Compare`page is used by officers to provide data when awarding raid loot

# Local setup to emulate prod architecture
- `local.conf`: Allows a local setup that uses NGINX to serve assets, similar to app architecture in prod. Used in `emulate-prod.yml`
- The `local.conf` file is a stripped down version with no HTTPS cert handling. This is simply a means to test nginx serving built assets, by accessing the assets in the vite app dir via volume mapping
- Note that, running the app locally with `emulate-prod.yml`does not enable frontend hot reloading, as this setup is serving built assets with NGINX
- To develop locally with hot reloading, run launch with `dev.yml` (docker compose) and `./frontend npm run dev`

# Env vars
- App depends on the following env var files, for both local development and prod:
  - `./frontend/.env.local`
  - `./frontend/.env.production`
  - `./roz_loot_tracker/.env` (for AWS boto3 cronjob that bucks up database, handled by .py script)

# Misc
- `./roz_loot_tracker/backup_db.py` is a script that backs up the sqlite db by uploading it to an S3 bucket. This script depends on a `.venv` in the same folder, so that it can use boto3 lib. Currently, this chron is running once a day on the digital ocean VM.
- (5/9/26): Currently undergoing a refactor to prepare to migrate from digital ocean to AWS. In prod, django is currently serving the built react html file from a view, as well as the rest of the assets via `./staticfiles`. After the refactor, all assets will be served by NGINX