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


def _validate_data_integrity(character):
    """We want to detect rows that somehow have both "main" and "main_alt" bools"""
    if character.is_main and character.is_main_alt:
        return False
    return True


def _save_all_as_alt(characters):
    """
    In order to avoid edge case of issues related to DB level 'MAIN' constraint, we need to convert all characters to 'ALT' first.
    Shouldn't normally come up, but I was messing with some things by hand and screw up some data before running this actual script.
    """
    for character in characters:
        character.type = "ALT"
        character.save()


class Command(BaseCommand):
    help = "update character rows with type field"

    def handle(self, *args, **options):
        with transaction.atomic():
            players = models.Player.objects.all()
            counter = 0
            invalid_rows = []
            for player in players:
                characters = player.characters.all()
                _save_all_as_alt(characters)
                for character in characters:
                    is_char_valid = _validate_data_integrity(character)
                    if not is_char_valid:
                        invalid_rows.append(character.id)
                        continue
                    char_type = _get_char_type(character)
                    character.type = char_type
                    character.save()
                    counter += 1
            if invalid_rows:
                self.stdout.write(
                    self.style.WARNING("Some rows have been found to contain both 'main' and 'main_alt' as true. IDs:")
                )
                for row_id in invalid_rows:
                    self.stdout.write(str(row_id))
        return self.stdout.write(f"Character rows updated: {str(counter)}")
