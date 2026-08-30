from django.core.management.base import BaseCommand
from django.db import transaction

from app import models

# TODO: This is a one-off migration script to translate the defunct bool field approach to classifying ItemAwarded rows. The modern approach is a single field "ItemAwarded.type"


def _get_type(item_awarded):
    if not item_awarded.alt_loot and item_awarded.preferred and not item_awarded.magelo:
        return "preferred"
    elif not item_awarded.alt_loot and item_awarded.preferred and item_awarded.magelo:
        return "preferred_magelo"
    elif not item_awarded.alt_loot and not item_awarded.preferred and item_awarded.magelo:
        return "main_magelo"
    elif not item_awarded.alt_loot and not item_awarded.preferred and not item_awarded.magelo:
        return "main"
    elif item_awarded.alt_loot and not item_awarded.preferred and item_awarded.magelo:
        return "alt_magelo"
    elif item_awarded.alt_loot and not item_awarded.preferred and not item_awarded.magelo:
        return "alt"
    else:
        return item_awarded


class Command(BaseCommand):
    help = "update itemawarded rows with type field"
    with transaction.atomic():

        def handle(self, *args, **options):
            could_not_update = []
            counter = 0
            items = models.ItemAwarded.objects.all()
            for item in items:
                result = _get_type(item)
                if isinstance(result, str):
                    item.type = result
                    item.save()
                    counter += 1
                else:
                    could_not_update.append(item)

            self.stdout.write(f"Rows updated: {counter}")
            if len(could_not_update) == 0:
                return self.stdout.write(
                    self.style.SUCCESS("Successfully added type field to ItemAwarded ALL Rows.")
                )
            else:
                self.stdout.write(
                    self.styles.ERROR(
                        "ERROR: Could not add type field to all rows. Please handle the following manually:"
                    )
                )
                for item in could_not_update:
                    self.stdout.write(
                        f"pk: {item.pk}, "
                        f"alt_loot: {item.alt_loot}, "
                        f"preferred: {item.preferred}, "
                        f"magelo: {item.magelo}"
                    )
                return None
