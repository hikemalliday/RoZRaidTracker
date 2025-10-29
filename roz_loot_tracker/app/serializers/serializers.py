from rest_framework import serializers

from app.models import Player, Item, Zone, Character, Raid, ItemAwarded, PreferredPixel, RaidAttendance


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


class PlayerSerializer(serializers.ModelSerializer):
    characters = CharacterSerializer(many=True, read_only=True)

    class Meta:
        model = Player
        fields = '__all__'





class RaidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Raid
        fields = '__all__'


class ItemAwardedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemAwarded
        fields = '__all__'


class PreferredPixelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreferredPixel
        fields = '__all__'


class RaidAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaidAttendance
        fields = '__all__'
