from rest_framework import viewsets
from app import models

from roz_loot_tracker.app.serializers.serializers import PlayerSerializer, ItemSerializer, RaidSerializer, \
    ZoneSerializer, CharacterSerializer, ItemAwardedSerializer, PreferredPixelSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = models.Item.objects.all()
    serializer_class = ItemSerializer


class ZoneViewSet(viewsets.ModelViewSet):
    queryset = models.Zone.objects.all()
    serializer_class = ZoneSerializer


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = models.Player.objects.all()
    serializer_class = PlayerSerializer


class CharacterViewSet(viewsets.ModelViewSet):
    queryset = models.Character.objects.all()
    serializer_class = CharacterSerializer


class RaidViewSet(viewsets.ModelViewSet):
    queryset = models.Raid.objects.all()
    serializer_class = RaidSerializer


class ItemAwardedViewSet(viewsets.ModelViewSet):
    queryset = models.ItemAwarded.objects.all()
    serializer_class = ItemAwardedSerializer


class PreferredPixelViewSet(viewsets.ModelViewSet):
    queryset = models.PreferredPixel.objects.all()
    serializer_class = PreferredPixelSerializer
