import csv
from django.core.management.base import BaseCommand
from django.db import transaction
from app import models

# Schema of rows:
# item_id, item_name, zone_id, zone_name, drop_type, tier

TIER_MAP = {
    "quarm": "QUARM",
    "time": "TIME",
    "elemental": "ELEMENTAL",
    "pre-elemental": "PRE-ELEMENTAL",
}

class Command(BaseCommand):
    help = "update item rows with tier field"
    def handle(self, *args, **options):
        with transaction.atomic():
            couldnt_find = []
            counter = 0
            with open("./pop_item_zone_results.tsv", "r", encoding="utf-8") as file:
                reader = csv.reader(file, delimiter="\t")
                for row in reader:
                    # skip first row
                    if row[0] == "item_id":
                        continue
                    item_id = int(row[0])
                    item_name = str(row[1])
                    # zone_id = int(row[2])
                    # zone_name = str(row[3])
                    # drop_type = str(row[4])
                    tier = TIER_MAP[str(row[5])]
                    try:
                        item_instance = models.Item.objects.get(eq_item_id=item_id)
                        item_instance.tier = tier
                        item_instance.save()
                        counter += 1
                    except models.Item.DoesNotExist:
                        self.stdout.write(self.style.ERROR(f"ERROR: Could not find item by id: {item_name}"))
                        item_instances = models.Item.objects.filter(name=item_name)
                        if not item_instances.exists():
                            self.stdout.write(self.style.ERROR(f"ERROR: Could not find item by name: {item_name}"))
                            couldnt_find.append(row)
                            continue
                        for item_instance in item_instances:
                            item_instance.tier = tier
                            item_instance.save()
                            counter += 1

            if len(couldnt_find) > 0:
                self.stdout.write(f"Could not find the following items by id:")
                for item in couldnt_find:
                    self.stdout.write(f"{item}")
            return self.stdout.write(f"Item rows updated: {counter}")
