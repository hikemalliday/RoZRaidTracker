from django.core.management.base import BaseCommand
from django.db import connections, transaction
from app import models


class Command(BaseCommand):
    help = "Migrate quarm 'items' slots col to sqlite 'item' table"

    def add_arguments(self, parser):
        parser.add_argument(
            '--noinput', '--no-input',
            action='store_true',
            help='Skip confirmation and migrate immediately',
        )

    def handle(self, *args, **options):
        if not options['noinput'] or not options['no-input']:
            confirm = input("WARNING: You are about to perform a migration from quarm items to default items. This will first clear ALL default items, and then perform migration. Are you sure you want to continue? (yes/no): ")
            if confirm.lower() not in ('yes', 'y'):
                self.stdout.write(self.style.WARNING('Operation cancelled.'))
                return


        batch_size = 500

        with connections['quarm_db'].cursor() as source_cursor:
            source_cursor = connections['quarm_db'].cursor()
            source_cursor.execute('SELECT id, slots FROM items;')
        try:
            with transaction.atomic():
                while True:
                    rows = source_cursor.fetchmany(batch_size)

                    if not rows:
                        break

                    for row in rows:
                        item_to_edit = models.Item.objects.get(eq_item_id=row[0])
                        item_to_edit.slots = row[1]
                        item_to_edit.save()

                    self.stdout.write(self.style.SUCCESS(f'Successfully updated {len(rows)} Item rows.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error during migration: {str(e)}'))
            raise

        self.stdout.write(self.style.SUCCESS('Migration complete.'))
