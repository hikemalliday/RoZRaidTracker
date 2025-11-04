from django.contrib import admin
from .models import Player, Raid, RaidAttendance, Character, ItemAwarded, Item, PreferredPixel, Zone, RaidAttendanceApproval


admin.site.site_header = "RoZ Raid Tracker Admin Terminal"
admin.site.register(RaidAttendance)
admin.site.register(Character)
admin.site.register(RaidAttendanceApproval)

class ItemAwardedInline(admin.TabularInline):
    model = ItemAwarded
    fields = ['player', 'item']
    autocomplete_fields = ['player', 'item']

    def get_queryset(self, request):
        return self.model.objects.none()

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        formset.max_num = 50
        formset.extra = 1
        return formset


@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(PreferredPixel)
class PreferredPixelAdmin(admin.ModelAdmin):
    autocomplete_fields = ('item',)


@admin.register(Raid)
class RaidAdmin(admin.ModelAdmin):
    inlines = [ItemAwardedInline]
    list_display = ['name', 'zone', 'created_at']
    search_fields = ['name']
    autocomplete_fields = ('zone',)


@admin.register(ItemAwarded)
class ItemAwardedAdmin(admin.ModelAdmin):
    list_display = ['item', 'player', 'raid', 'created_at']
    list_filter = ['created_at', 'raid__name']
    search_fields = ['item__name', 'player__name', 'raid__name']
    autocomplete_fields = ['item', 'player', 'raid']
