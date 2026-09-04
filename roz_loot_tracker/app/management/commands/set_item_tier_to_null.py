from django.core.management.base import BaseCommand
from django.db import transaction

from app import models


# I think we added this as a means to 'redo' a failed item tier migration
class Command(BaseCommand):
    help = "update item rows with tier as null"
    with transaction.atomic():

        def handle(self, *args, **options):
            counter = 0
            tierd = models.Item.objects.exclude(tier=None)
            for item in tierd:
                item.tier = None
                item.save()
                counter += 1
            return self.stdout.write(f"Item rows updated: {counter}")
