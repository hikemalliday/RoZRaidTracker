from django.core.management.base import BaseCommand
from django.db import transaction
from app import models

# TODO: This is a one-off migration script to translate the defunct bool field approach to classifying Character rows. The modern approach is a single field "Character.type"


def _get_char_type(character):
    if character.is_main:
        return "MAIN"
    if character.is_main_alt:
        return "MAIN_ALT"
    return "ALT"


class Command(BaseCommand):
    help = "update character rows with type field"
    with transaction.atomic():
        def handle(self, *args, **options):
            players = Player.objects.all()
            counter = 0
            for player in players:
                characters = player.characters
                for character in characters:
                    char_type = _get_char_type(character)
                    character.type = char_type
                    character.save()
                    counter += 1
            return self.stdout.write(f"Character rows updated: {counter}")
