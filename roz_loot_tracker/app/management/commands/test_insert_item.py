from django.core.management.base import BaseCommand
from app import models


class Command(BaseCommand):
    help = 'Test inserting Item(s) into database'

    def handle(self, *args, **kwargs):
        obj = models.Item.objects.create(
            name="Abashi",
            eq_item_id=1,
            item_score=100,
        )
        self.stdout.write(self.style.SUCCESS(f'Successfully inserted: {obj}'))
