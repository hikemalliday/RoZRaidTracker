from rest_framework import serializers

from app import models
from app.models import Player, Item, Zone, Character, Raid, ItemAwarded, PreferredPixel, RaidAttendance, RaidAttendanceApproval
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = '__all__'


class CharacterSerializer(serializers.ModelSerializer):
    player_id = serializers.PrimaryKeyRelatedField(
        queryset=Player.objects.all(),
        source="player",
        write_only=True
    )
    class Meta:
        model = Character
        fields = '__all__'
        depth = 1

    def validate(self, attrs):
        player = attrs.get('player')
        is_main = attrs.get('is_main', False)
        is_main_alt = attrs.get('is_main_alt', False)

        if is_main and Character.objects.filter(
            player=player,
            is_main=True,
        ).exists():
            raise serializers.ValidationError({
                'error': 'This player already has a main character.'
            })

        if is_main_alt and Character.objects.filter(
            player=player,
            is_main_alt=True,
        ).exists():
            raise serializers.ValidationError({
                'error': 'This player already has a main alt character.'
            })

        return attrs


class PlayerSerializer(serializers.ModelSerializer):
    characters = CharacterSerializer(many=True, read_only=True)
    lifetime_ra = serializers.FloatField(read_only=True)
    ra_21_day = serializers.FloatField(read_only=True)

    class Meta:
        model = Player
        fields = '__all__'



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

    player_id = serializers.PrimaryKeyRelatedField(
        queryset=Player.objects.all(),
        source="player",
        write_only=True
    )
    raid_id = serializers.PrimaryKeyRelatedField(
        queryset=Raid.objects.all(),
        source="raid",
        write_only=True
    )
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(),
        source="item",
        write_only=True
    )

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

    # Simple IDs for writing (WRITE-ONLY)
    player_id = serializers.PrimaryKeyRelatedField(
        queryset=Player.objects.all(),
        source="player",
        write_only=True
    )
    raid_id = serializers.PrimaryKeyRelatedField(
        queryset=Raid.objects.all(),
        source="raid",
        write_only=True
    )


    class Meta:
        model = RaidAttendance
        fields = '__all__'


class RaidAttendanceApprovalSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%m-%d-%y', read_only=True)

    class Meta:
        model = RaidAttendanceApproval
        fields = '__all__'

    def create(self, validated_data):
        players_list = validated_data["players_list"]
        players_list_new = []

        for discord_name, discord_id in players_list:
            player, created = models.Player.objects.get_or_create(
                discord_id=discord_id,
            )
            if created:
                player.name = discord_name
                player.save()
            players_list_new.append([player.name, discord_id])

        validated_data["players_list"] = players_list_new
        return RaidAttendanceApproval.objects.create(**validated_data)


class TokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["roles"] = [group.name for group in user.groups.all()]
        token["is_superuser"] = user.is_superuser
        return token
