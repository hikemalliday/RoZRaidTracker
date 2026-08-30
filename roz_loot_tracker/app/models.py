from django.db import models
from django.db.models import Q
from django.db.models.functions import Lower

NOT_REQUIRED = {"null": True, "blank": True}


class Item(models.Model):
    name = models.CharField(max_length=100)
    eq_item_id = models.IntegerField()
    icon_id = models.IntegerField()
    item_score = models.IntegerField(**NOT_REQUIRED)
    slots = models.IntegerField(**NOT_REQUIRED)

    def __str__(self):
        return self.name


# Not currently used
class Npc(models.Model):
    name = models.CharField(max_length=100)
    npc_id = models.IntegerField()


class Zone(models.Model):
    name = models.CharField(max_length=100)
    zone_id = models.IntegerField()

    def __str__(self):
        return self.name


class Player(models.Model):
    name = models.CharField(max_length=100)
    discord_id = models.CharField(max_length=100, **NOT_REQUIRED)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    constraints = [models.UniqueConstraint(Lower("name"), name="unique_lower_name")]


class Character(models.Model):
    CLASS_CHOICES = (
        ("BRD", "Bard"),
        ("BST", "Beastlord"),
        ("CLR", "Cleric"),
        ("DRU", "Druid"),
        ("ENC", "Enchanter"),
        ("MAG", "Magician"),
        ("MNK", "Monk"),
        ("NEC", "Necromancer"),
        ("PAL", "Paladin"),
        ("RNG", "Ranger"),
        ("ROG", "Rogue"),
        ("SHD", "Shadow Knight"),
        ("SHM", "Shaman"),
        ("WAR", "Warrior"),
        ("WIZ", "Wizard"),
    )
    TYPES = (
        ("MAIN", "Main"),
        ("MAIN_ALT", "Main Alt"),
        ("ALT", "Alt"),
    )

    name = models.CharField(max_length=100, unique=True)
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="characters")
    is_main = models.BooleanField(default=False)
    is_main_alt = models.BooleanField(default=False)
    char_class = models.CharField(max_length=3, choices=CLASS_CHOICES)
    type = models.CharField(max_length=30, choices=TYPES, default="ALT")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["player"], condition=Q(type="MAIN"), name="unique_main_per_player"
            ),
        ]

    def __str__(self):
        return f"Character - Name: {self.name}"


class Raid(models.Model):
    name = models.CharField(max_length=100)
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, **NOT_REQUIRED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.created_at}"


class RaidAttendance(models.Model):
    raid = models.ForeignKey(Raid, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("raid", "player")

    def __str__(self):
        return f"RaidAttendance - Player: {self.player}, Raid: {self.raid.name}, Date: {self.created_at}"


class ItemAwarded(models.Model):
    class Type(models.TextChoices):
        MAIN = ("main", "Main")
        ALT = ("alt", "Alt")
        PREFERRED = ("preferred", "Preferred")
        MAIN_MAGELO = ("main_magelo", "Main Magelo")
        PREFERRED_MAGELO = ("preferred_magelo", "Preferred Magelo")
        ALT_MAGELO = ("alt_magelo", "Alt Magelo")
        MAIN_ALT = ("main_alt", "Main Alt")

    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    raid = models.ForeignKey(Raid, on_delete=models.CASCADE, **NOT_REQUIRED)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    alt_loot = models.BooleanField(default=False)
    preferred = models.BooleanField(default=False)
    magelo = models.BooleanField(default=False)
    type = models.CharField(
        max_length=30,
        choices=Type.choices,
        default=Type.MAIN,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.item.name


class PreferredPixel(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    def __str__(self):
        return f"PreferredPixel - Player: {self.player}, Item: {self.item}"


# TODO: Interesting that we never linked this to a "Raid" instance but I guess whats done is done
class RaidAttendanceApproval(models.Model):
    players_list = models.JSONField(default=list)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # This field is added so that the user will enter a raid name when entering the discord bot command.
    # The purpose of this is to simply 'pre-populate' the 'raid name' field in the frontend, nothing more.
    # It simply serves as a way to provide more info for the 'approval' row. Because when they start stacking up, you
    # forget which is which.
    raid_name = models.CharField(max_length=100, **NOT_REQUIRED)
