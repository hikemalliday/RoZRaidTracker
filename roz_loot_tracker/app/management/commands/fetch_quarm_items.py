from django.core.management.base import BaseCommand
from django.db import connections


class Command(BaseCommand):
    help = 'Test getting 100 rows from table quarm.items'

    def handle(self, *args, **options):
        with connections["quarm_db"].cursor() as cursor:
            cursor.execute('SELECT id, Name FROM items LIMIT 100;')
            rows = cursor.fetchall()

            if not rows:
                self.stdout.write('No items found in quarm_db.')
                return

            for row in rows:
                self.stdout.write(f'{row}')

