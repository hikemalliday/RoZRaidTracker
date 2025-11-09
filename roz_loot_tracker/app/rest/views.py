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
from rest_framework.exceptions import ValidationError
from django.db.models import Count, F, FloatField, ExpressionWrapper
from django.db.models.expressions import Value
from django.db.models.functions import Round


PERMISSION_CLASS_DEBUG = IsAuthenticated  # TODO: Dev purposes


class ItemViewSet(viewsets.ModelViewSet):
    queryset = models.Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)


class ZoneViewSet(viewsets.ModelViewSet):
    queryset = models.Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)


# TODO: Abstract filter logic into mixin class
class PlayerViewSet(viewsets.ModelViewSet):
    queryset = models.Player.objects.all()
    serializer_class = PlayerSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)

    def get_queryset(self):
        queryset = super().get_queryset()

        total_raids = models.Raid.objects.count()
        if total_raids > 0:
            queryset = queryset.annotate(
                player_raids=Count('raidattendance__raid'),
                lifetime_ra=Round(ExpressionWrapper(
                    100.0 * F('player_raids') / total_raids,
                    output_field=FloatField()
                ), precision=2)
            )
        else:
            queryset = queryset.annotate(lifetime_ra=Value(0.0, output_field=FloatField()))


        sort_field = self.request.query_params.get('sort_by')
        sort_order = self.request.query_params.get('order', "asc")
        if sort_field and sort_field in ['name', 'lifetime_ra']:
            if sort_order != "asc":
                sort_field = f"-{sort_field}"
            queryset = queryset.order_by(sort_field)
        return queryset


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

    def get_queryset(self):
        queryset = super().get_queryset()
        sort_field = self.request.query_params.get('sort_by')
        sort_order = self.request.query_params.get('order', 'asc')
        if sort_field and sort_field in ["name", "zone", "date"]:
            sort_field = "created_at" if sort_field == "date" else sort_field # TODO: Handle this differently
            if sort_order != "asc":
                sort_field = f"-{sort_field}"
            queryset = queryset.order_by(sort_field)
        return queryset


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
                try:
                    player = models.Player.objects.get(name=player_name.title())
                    models.RaidAttendance.objects.create(
                        player=player,
                        raid=raid,
                    )
                except models.Player.DoesNotExist:
                    raise ValidationError(f"Player {player_name} does not exist. Create player first and try again.")

            raid_attendance_approval = self.get_object()
            raid_attendance_approval.is_approved = True
            raid_attendance_approval.save()

        return Response({"message": f"Success: added raid '{raid_name} + attendees.'"}, status=200)
