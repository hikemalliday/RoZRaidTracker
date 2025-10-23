from django.contrib import admin
from .models import Player, Raid, RaidAttendance, Character, ItemAwarded, Item, PreferredPixel

admin.site.site_header = "RoZ Raid Tracker Admin Terminal"


admin.site.register(Player)
admin.site.register(Raid)
admin.site.register(RaidAttendance)
admin.site.register(Character)


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(ItemAwarded)
class ItemAwardedAdmin(admin.ModelAdmin):
    autocomplete_fields = ('item',)


@admin.register(PreferredPixel)
class PreferredPixelAdmin(admin.ModelAdmin):
    autocomplete_fields = ('item',)
