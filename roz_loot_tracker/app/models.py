from django.db import models
from django.db.models import Q


NOT_REQUIRED = {
    "null": True,
    "blank": True
}


class Item(models.Model):
    name = models.CharField(max_length=100)
    eq_item_id = models.IntegerField()
    item_score = models.IntegerField(**NOT_REQUIRED)

    def __str__(self):
        return self.name


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

    name = models.CharField(max_length=100)
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
    raid = models.ForeignKey(Raid, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.item.name


class PreferredPixel(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    def __str__(self):
        return f"PreferredPixel - Player: {self.player}, Item: {self.item}"
