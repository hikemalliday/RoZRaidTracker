from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from app import models


class Command(BaseCommand):
    help = "Set players with no raid attendance in the last 45 days to inactive"

    def handle(self, *args, **options):
        cutoff = timezone.now() - timedelta(days=45)

        players_to_deactivate = models.Player.objects.filter(active=True).exclude(
            raidattendance__created_at__gte=cutoff
        )

        count = players_to_deactivate.update(active=False)
        self.stdout.write(self.style.SUCCESS(f"Set {count} player(s) to inactive."))
