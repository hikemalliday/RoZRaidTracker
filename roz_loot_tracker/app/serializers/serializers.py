from rest_framework import serializers

from app.models import Player, Item, Zone, Character, Raid, ItemAwarded, PreferredPixel, RaidAttendance, RaidAttendanceApproval


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = '__all__'


class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = '__all__'
        depth = 1


class PlayerSerializer(serializers.ModelSerializer):
    characters = CharacterSerializer(many=True, read_only=True)
    lifetime_ra = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = '__all__'

    def get_lifetime_ra(self, obj):
        player = obj
        total_raids = RaidAttendance.objects.all().count()
        player_raids = RaidAttendance.objects.filter(player=player).count()

        if total_raids == 0 or player_raids == 0:
            return 0.0

        player_raids = Raid.objects.filter(raidattendance__player=player).count()
        total_raids = Raid.objects.all().count()

        lifetime_ra_percentage = (player_raids / total_raids) * 100
        return round(lifetime_ra_percentage)


class RaidSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%m-%d-%y', read_only=True)
    updated_at = serializers.DateTimeField(format='%m-%d-%y', read_only=True)
    zone = ZoneSerializer(read_only=True)
    class Meta:
        model = Raid
        fields = '__all__'


class ItemAwardedSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%m-%d-%y', read_only=True)
    updated_at = serializers.DateTimeField(format='%m-%d-%y', read_only=True)
    item = ItemSerializer(read_only=True)
    raid = RaidSerializer(read_only=True)
    player = PlayerSerializer(read_only=True)

    class Meta:
        model = ItemAwarded
        fields = '__all__'


class PreferredPixelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreferredPixel
        fields = '__all__'


class RaidAttendanceSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%m-%d-%y', read_only=True)
    updated_at = serializers.DateTimeField(format='%m-%d-%y', read_only=True)
    player = PlayerSerializer(read_only=True)
    raid = RaidSerializer(read_only=True)

    class Meta:
        model = RaidAttendance
        fields = '__all__'


class RaidAttendanceApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaidAttendanceApproval
        fields = '__all__'
