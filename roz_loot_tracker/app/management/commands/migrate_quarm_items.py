from django.core.management.base import BaseCommand
from django.db import connections, transaction
from app import models


class Command(BaseCommand):
    help = "Migrate quarm items table to django app's sqlite db"

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

        models.Item.objects.all().delete()

        with connections['quarm_db'].cursor() as source_cursor:
            source_cursor = connections['quarm_db'].cursor()
            source_cursor.execute('SELECT id, Name FROM items;')
        try:
            with transaction.atomic():
                while True:
                    rows = source_cursor.fetchmany(batch_size)

                    if not rows:
                        break

                    items_to_insert = [models.Item(eq_item_id=row[0], name=row[1], item_score=0) for row in rows]
                    models.Item.objects.bulk_create(items_to_insert)
                    self.stdout.write(self.style.SUCCESS(f'Successfully inserted {len(rows)} rows'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error during migration: {str(e)}'))
            raise

        self.stdout.write(self.style.SUCCESS('Transfer complete'))
