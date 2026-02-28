from django.core.management.base import BaseCommand
from django.db import transaction

from app import models

players_list = ["Strikerr", "Taeter", "Reef", "Vaporise", "Skeeter", "Big G", "Vanco", "Jokong/Jessie", "Tune", "Nerfed", "Dustmop", "Gream", "Rickjames", "Bannin", "Acarer", "Mandelgar", "Birdop", "Azzar", "Roger", "Ranjore", "jAH", "Cybercop", "Kilbur", "QuiexVZ", "Lesly", "Amberr", "Sharknado", "Mortii", "Titanuk", "Greyn", "Herban", "Ohhso", "Kajoo", "Partymike"]

class Command(BaseCommand):
    help = "create a raid attendance row"
    with transaction.atomic():
        def handle(self, *args, **options):
            ra_approval = models.RaidAttendanceApproval.objects.get(id=357)
            raid = models.Raid.objects.create(
                name="blue vt 5",
            )

            for player_name in players_list:
                try:
                    player_to_title = player_name.title()
                    player = models.Player.objects.get(name=player_to_title)
                    models.RaidAttendance.objects.create(
                        player=player,
                        raid=raid,
                    )
                except models.Player.DoesNotExist:
                    return self.stdout.write(self.style.ERROR(f"Player with name {player_name} does not exist."))
            ra_approval.is_approved = True
            ra_approval.save()
            return self.stdout.write(self.style.SUCCESS(f"Successfully added missed raid"))
