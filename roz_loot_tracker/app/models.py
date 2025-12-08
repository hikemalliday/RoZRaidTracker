from django.db import models
from django.db.models import Q
from django.db.models.functions import Lower


NOT_REQUIRED = {
    "null": True,
    "blank": True
}


class Item(models.Model):
    name = models.CharField(max_length=100)
    eq_item_id = models.IntegerField()
    icon_id = models.IntegerField()
    item_score = models.IntegerField(**NOT_REQUIRED)

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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    constraints = [
        models.UniqueConstraint(
            Lower('name'),
            name='unique_lower_name'
        )
    ]


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

    name = models.CharField(max_length=100, unique=True)
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="characters")
    is_main = models.BooleanField(default=False)
    is_main_alt = models.BooleanField(default=False)
    char_class = models.CharField(max_length=3, choices=CLASS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['player'],
                condition=Q(is_main=True),
                name='unique_main_per_player'
            ),
            models.UniqueConstraint(
                fields=['player'],
                condition=Q(is_main_alt=True),
                name='unique_main_alt_per_player'
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
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    raid = models.ForeignKey(Raid, on_delete=models.CASCADE, **NOT_REQUIRED)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    alt_loot = models.BooleanField(default=False)
    preferred = models.BooleanField(default=False)
    magelo = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.item.name


class PreferredPixel(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    def __str__(self):
        return f"PreferredPixel - Player: {self.player}, Item: {self.item}"


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


# class MageloItem(models.Model):
#
#     SLOT_CHOICES = [
#         ("EAR1", "EAR1"),
#         ("EAR2", "EAR2"),
#         ("FACE", "FACE"),
#         ("HEAD", "HEAD"),
#         ("CHEST", "CHEST"),
#         ("NECK", "NECK"),
#         ("ARMS", "ARMS"),
#         ("BACK", "BACK"),
#         ("WAIST", "WAIST"),
#         ("SHOULDERS", "SHOULDERS"),
#         ("WRIST1", "WRIST1"),
#         ("WRIST2", "WRIST2"),
#         ("LEGS", "LEGS"),
#         ("HANDS", "HANDS"),
#         ("FEET", "FEET"),
#         ("FINGERS1", "FINGERS1"),
#         ("FINGERS2", "FINGERS2"),
#         ("PRIMARY", "PRIMARY"),
#         ("SECONDARY", "SECONDARY"),
#         ("RANGED", "RANGED"),
#         ("AMMO", "AMMO"),
#         ("INVENTORY1", "INVENTORY1"),
#         ("INVENTORY2", "INVENTORY2"),
#         ("INVENTORY3", "INVENTORY3"),
#         ("INVENTORY4", "INVENTORY4"),
#         ("INVENTORY5", "INVENTORY5"),
#         ("INVENTORY6", "INVENTORY6"),
#         ("INVENTORY7", "INVENTORY7"),
#         ("INVENTORY8", "INVENTORY8"),
#     ]
#
#     player = models.ForeignKey(Player, on_delete=models.CASCADE)
#     item = models.ForeignKey(Item, on_delete=models.CASCADE)
#     slot = models.CharField(max_length=30, choices=SLOT_CHOICES)
#     acquired = models.BooleanField(default=False)
#
#     class Meta:
#         constraints = [
#             models.UniqueConstraint(
#                 fields=["player", "slot"], name="unique_player_slot"
#             )
#         ]
