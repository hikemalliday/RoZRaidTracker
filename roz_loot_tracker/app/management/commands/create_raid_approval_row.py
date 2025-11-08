from django.core.management.base import BaseCommand
from app.models import RaidAttendanceApproval




class Command(BaseCommand):
    help = "create a raid attendance row"
    def handle(self, *args, **options):
        players_list = ['stryne', 'Kugaz', 'Retticus', 'Acarer', 'Rukmok', 'Big G', 'jAH', 'Ksah', 'crip', 'Knife', 'Mendl', 'Visible', 'Gream', 'Noidz', 'Nocsucow', 'Nerfed', 'JeWcY', 'Roger', 'Shakirra', 'Mcoy', 'Blueflower', 'Nuke', 'Mortii', 'Cybercop', 'ogor', 'Sraalok', 'Vaporise', 'Tune', 'Noni', 'Dustmop', 'Revy', 'Machete', 'Titanuk', 'Birdop', 'Kilkur']
        RaidAttendanceApproval.objects.create(
            players_list=players_list,
        )
        self.stdout.write(self.style.SUCCESS(f'Successfully added RaidAttendanceApproval entry.'))
