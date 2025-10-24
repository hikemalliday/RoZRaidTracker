from rest_framework import viewsets
from app import models

from rest_framework.permissions import AllowAny, IsAuthenticated

from app.serializers.serializers import PlayerSerializer, ItemSerializer, RaidSerializer, \
    ZoneSerializer, CharacterSerializer, ItemAwardedSerializer, PreferredPixelSerializer


PERMISSION_CLASS_DEBUG = AllowAny # TODO: Dev purposes


class ItemViewSet(viewsets.ModelViewSet):
    queryset = models.Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)



class ZoneViewSet(viewsets.ModelViewSet):
    queryset = models.Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = models.Player.objects.all()
    serializer_class = PlayerSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)


class CharacterViewSet(viewsets.ModelViewSet):
    queryset = models.Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)


class RaidViewSet(viewsets.ModelViewSet):
    queryset = models.Raid.objects.all()
    serializer_class = RaidSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)


class ItemAwardedViewSet(viewsets.ModelViewSet):
    queryset = models.ItemAwarded.objects.all()
    serializer_class = ItemAwardedSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)


class PreferredPixelViewSet(viewsets.ModelViewSet):
    queryset = models.PreferredPixel.objects.all()
    serializer_class = PreferredPixelSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)
