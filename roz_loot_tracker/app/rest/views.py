from app import models
from app.serializers.serializers import PlayerSerializer, ItemSerializer, RaidSerializer, \
    ZoneSerializer, CharacterSerializer, ItemAwardedSerializer, PreferredPixelSerializer, RaidAttendanceSerializer, \
    RaidAttendanceApprovalSerializer
from django.db import transaction
from django.db.models import Count, F, FloatField, ExpressionWrapper, Func, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from datetime import timedelta


PERMISSION_CLASS_DEBUG = IsAuthenticated  # TODO: Dev purposes


class AllowNoPagination(PageNumberPagination):
    page_size_query_param = "page_size"
    max_page_size = 9999


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
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['name', 'lifetime_ra']
    pagination_class = AllowNoPagination

    def get_queryset(self):
        total_raids = models.Raid.objects.count() or 1

        date_threshold = timezone.now() - timedelta(days=21)
        total_raids_21_days = models.Raid.objects.filter(
            created_at__gte=date_threshold
        ).count() or 1

        queryset = (
            models.Player.objects
            .annotate(
                total_ra=Count('raidattendance', distinct=True),
                lifetime_ra_raw=ExpressionWrapper(
                    (100.0 * F('total_ra') / total_raids),
                    output_field=FloatField(),
                ),
                total_ra_21_days=Count(
                    'raidattendance',
                    filter=Q(raidattendance__raid__created_at__gte=date_threshold),
                    distinct=True,
                ),
                ra_21_day_raw=ExpressionWrapper(
                    (100.0 * F('total_ra_21_days') / total_raids_21_days),
                    output_field=FloatField(),
                )
            )
            .annotate(
                lifetime_ra=Func(F('lifetime_ra_raw'), 2, function='ROUND', output_field=FloatField()),
                ra_21_day=Func(F('ra_21_day_raw'), 2, function='ROUND', output_field=FloatField())
            )
        )
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
    filter_backends = (OrderingFilter,)
    ordering_fields = ['name', 'zone']


class ItemAwardedViewSet(viewsets.ModelViewSet):
    queryset = models.ItemAwarded.objects.all()
    serializer_class = ItemAwardedSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['player', 'raid']
    ordering_fields = ['player', 'raid']
    pagination_class = AllowNoPagination


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
    pagination_class = AllowNoPagination


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
