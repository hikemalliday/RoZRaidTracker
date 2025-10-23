from django.core.management.base import BaseCommand
from django.db import connections, transaction

class Command(BaseCommand):
    help = "Delete all rows from app_item table indefault db"

    def add_arguments(self, parser):
        parser.add_argument(
            '--noinput', '--no-input',
            action='store_true',
            help='Skip confirmation prompt and delete immediately',
        )

    def handle(self, *args, **options):
        if not options['noinput']:
            confirm = input("WARNING: You are about to delete ALL rows from table 'item' in the DEFAULT db. Are you sure you want to continue? (yes/no): ")
            if confirm.lower() not in ('yes', 'y'):
                self.stdout.write(self.style.WARNING('Operation cancelled.'))
                return

        with connections['default'].cursor() as source_cursor:
            with transaction.atomic(using='default'):
                source_cursor.execute('DELETE FROM app_item;')
                row_count = source_cursor.rowcount
                self.stdout.write(self.style.SUCCESS(f'Successfully deleted {row_count} rows from app_item'))