from django.core.management.base import BaseCommand
from app.models import RaidAttendanceApproval




class Command(BaseCommand):
    help = "create a raid attendance row"
    def handle(self, *args, **options):
        ra_app_qs = RaidAttendanceApproval.objects.all()
        for row in ra_app_qs:
            row.is_approved = False
            row.save()
        self.stdout.write(self.style.SUCCESS(f'Successfully unapproved all RaidAttendanceApproval entries.'))
