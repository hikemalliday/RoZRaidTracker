from app import models
from app.serializers.serializers import PlayerSerializer, ItemSerializer, RaidSerializer, \
    ZoneSerializer, CharacterSerializer, ItemAwardedSerializer, PreferredPixelSerializer, RaidAttendanceSerializer, \
    RaidAttendanceApprovalSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction


PERMISSION_CLASS_DEBUG = IsAuthenticated  # TODO: Dev purposes


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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['player']


class RaidViewSet(viewsets.ModelViewSet):
    queryset = models.Raid.objects.all()
    serializer_class = RaidSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)


class ItemAwardedViewSet(viewsets.ModelViewSet):
    queryset = models.ItemAwarded.objects.all()
    serializer_class = ItemAwardedSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['player', 'raid']


class PreferredPixelViewSet(viewsets.ModelViewSet):
    queryset = models.PreferredPixel.objects.all()
    serializer_class = PreferredPixelSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)


class RaidAttendanceViewSet(viewsets.ModelViewSet):
    queryset = models.RaidAttendance.objects.all()
    serializer_class = RaidAttendanceSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['player', 'raid']


class RaidAttendanceApprovalViewSet(viewsets.ModelViewSet):
    queryset = models.RaidAttendanceApproval.objects.all()
    serializer_class = RaidAttendanceApprovalSerializer
    permission_classes = [HasAPIKey | PERMISSION_CLASS_DEBUG]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_approved']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        players = request.data.get("players")
        raid_name = request.data.get("raid_name")
        with transaction.atomic():
            raid = models.Raid.objects.create(
                name=raid_name,
            )
            for player_name in players:
                player = models.Player.objects.get(name=player_name)
                if not player:
                    return Response({"error": f"Player ${player_name} does not exist. Create player first and try again."}, status=400)
                models.RaidAttendance.objects.create(
                    player=player,
                    raid=raid,
                )
            raid_attendance_approval = self.get_object()
            raid_attendance_approval.is_approved = True
            raid_attendance_approval.save()

        return Response({"message": f"Success: added raid '{raid_name} + attendees.'"}, status=200)
