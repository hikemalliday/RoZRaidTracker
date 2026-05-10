# RoZ Loot Tracker
- Website with active user base to track guild raid and item data 
- Lovingly built (mostly) by hand. AI assisted with CSS.
- https://roz.yeetorskeet.com/
- user: member (case sensitive)
- pass: zeknumberone1234!
- Discord bot app is used to track raid attendance by making a `POST` request to take raid logs
- New `Players`are added to the system automatically when the `/take_ra` discord bot slash command is ran, if they do not already exist, with the `discord_id` being the source of truth / unique identifier
- `Compare`page is used by officers to provide data when awarding raid loot
- There is also an admin level login that has custom forms and such to assign items to players and raids

# Note about vite and env files
- Vite will use `.env` files based on what `mode` its built or ran in, see: https://vite.dev/guide/env-and-mode.html
- As such, you need to be mindful of this when either building for prod, or running locally

# Building for prod
- When running `npm run build`, vite will automatically build in `production` mode, and will automatically use env var `.env.production

# How to launch via `emulate-prod.yml`
- This yml is for testing out the serving assets via NGINX locally
- You must first build locally with command `./frontend/npx vite build --mode emulate-prod`
- Building with this `mode`option will tell vite to use env file `.env.emulate-prod`
- Then, run `docker compose -f emulate-prod.yml build && docker compose -f emulate-prod.yml up -d`
- Note that hot reloading will not work with this setup, as NGINX will be serving built assets.

# How to develop locally with hot reloading
- Run `docker compose -f dev.yml build && docker compose -f dev.yml up -d`, then `./frontend npm run dev`
- The vite dev server does not serve the built assets, so you do not necessarily need to perform a vite rebuild here
- Also, running `npm run dev` will tell vite to load env file `.env.developement`

# Env var locations
- App depends on the following env var files, for both local development and prod:
  - `./frontend/.env.development`
  - `./frontend/.env.production`
  - `./frontend/.env.emulate-prod`
  - `./roz_loot_tracker/.env` (for .py script that uses boto3 to back up database, currently ran once a day on digital ocean vm)

# Misc
- (5/9/26): Currently undergoing a refactor to prepare to migrate from digital ocean to AWS. In prod, django is currently serving the built react html file from a view, as well as the rest of the assets via `./staticfiles`. After the refactor, all assets will be served by NGINX