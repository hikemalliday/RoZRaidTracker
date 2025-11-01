
import csv
from datetime import datetime
from django.utils.timezone import make_aware
from app.models import Raid, RaidAttendance, Player
from django.db import transaction


with open('sheet_raid_players.csv', newline='') as csvfile:
    reader = list(csv.reader(csvfile))

transposed = list(zip(*reader))
player_cols = []
for col in transposed:
    players = [p.strip() for p in col if p and p.strip()]
    player_cols.append(players)

with open('sheet_raid_metadata.csv', newline='') as csvfile:
    reader = list(csv.reader(csvfile))

transposed = list(zip(*reader))
raid_meta_cols = []
for col in transposed:
    raid_meta = [r.strip() for r in col if r and r.strip()]
    raid_meta_cols.append(raid_meta)

prepared_data = []
player_len = len(player_cols)
raid_meta_len = len(raid_meta_cols)

player_in_question = player_cols[0]
raid_in_question = raid_meta_cols[0]

with transaction.atomic():
    Raid._meta.get_field('created_at').auto_now_add = False
    RaidAttendance._meta.get_field('created_at').auto_now_add = False
    for players, raid_meta in zip(player_cols, raid_meta_cols):
        if not players:
            print("no players in list, checking raid list...")
            if raid_meta:
                print("Error: players do not exist but raid meta does. Aborting!")
                raise Exception
            if not raid_meta:
                print("no data in raid_meta, we can successfully 'continue'!")
                continue

        raid_name = raid_meta[0]
        raid_date = raid_meta[1]
        dt_naive = None
        try:
            dt_naive = datetime.strptime(raid_date, "%m/%d/%Y")
        except:
            dt_naive = datetime.now()
        raid = Raid.objects.create(name=raid_name, created_at=dt_naive)

        player_map = {
            "Corn": "Mendl",
            "Wisecrack": "Wisecrak",
            "Deadlift (Euphonious)": "Euphonious",
            "Trikx": "Wisecrack",
            "Blarg2K": "Blarg2k",
        }
        print(f"raid {raid} created.")
        for player_name in players:
            player_name_title = player_name.title()
            mapped_player_name = player_map.get(player_name_title, player_name_title)
            player_obj, _ = Player.objects.get_or_create(name=mapped_player_name)
            raid_attendance = RaidAttendance.objects.create(
                player=player_obj,
                raid=raid,
                created_at=dt_naive,
            )






