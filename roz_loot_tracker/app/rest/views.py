from datetime import timedelta

from app import models
from app.models import RaidAttendance
from app.serializers.serializers import PlayerSerializer, ItemSerializer, RaidSerializer, \
    ZoneSerializer, CharacterSerializer, ItemAwardedSerializer, PreferredPixelSerializer, RaidAttendanceSerializer, \
    RaidAttendanceApprovalSerializer, TokenObtainPairSerializer
from django.db import transaction
from django.db.models import Count, F, FloatField, ExpressionWrapper, Func, Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters import rest_framework as filters
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework_simplejwt.views import TokenObtainPairView


PERMISSION_CLASS_DEBUG = IsAuthenticated


class ItemFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model = models.Item
        fields = ["name"]

class PlayerFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model = models.Player
        fields = ["name", "active"]


class AllowNoPagination(PageNumberPagination):
    page_size_query_param = "page_size"
    max_page_size = 9999


class ItemViewSet(viewsets.ModelViewSet):
    queryset = models.Item.objects.all()
    serializer_class = ItemSerializer
    # permission_classes = (PERMISSION_CLASS_DEBUG,)
    pagination_class = AllowNoPagination
    filterset_class = ItemFilter

    @action(detail=False, methods=['get'])
    def get_options(self, request, pk=None):
        qs = models.Item.objects.filter(itemawarded__isnull=False).distinct().order_by('name')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ZoneViewSet(viewsets.ModelViewSet):
    queryset = models.Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = models.Player.objects.all()
    serializer_class = PlayerSerializer
    # permission_classes = (PERMISSION_CLASS_DEBUG,)
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['name', 'lifetime_ra', 'ra_21_day']
    pagination_class = AllowNoPagination
    filterset_class = PlayerFilter
    # TODO: The whole "21 day" thing should probably be named something different in the annotated field, but the frontend is so dependent on it that I don't wanna refactor all that at the moment
    def get_queryset(self):
        num_of_days = int(self.request.query_params.get('num_of_days', 21))
        ra_percentage = self.request.query_params.get('ra_percentage', None)

        total_raids = models.Raid.objects.count() or 1

        date_threshold = timezone.now() - timedelta(days=num_of_days)
        total_raids_window = models.Raid.objects.filter(
            created_at__gte=date_threshold
        ).count() or 1

        queryset = (
            models.Player.objects
            # TODO: 'annotate()' basically adds a new field to the model instance
            .annotate(
                total_ra=Count('raidattendance', distinct=True),
                # TODO: 'ExpressionWrapper' is used to do SQL math operations.
                lifetime_ra_raw=ExpressionWrapper(
                    # TODO: F() is used to reference other calculated fields
                    (100.0 * F('total_ra') / total_raids),
                    output_field=FloatField(),
                ),
                total_ra_21_days=Count(
                    'raidattendance',
                    filter=Q(raidattendance__raid__created_at__gte=date_threshold),
                    distinct=True,
                ),
                ra_21_day_raw=ExpressionWrapper(
                    (100.0 * F('total_ra_21_days') / total_raids_window),
                    output_field=FloatField(),
                )
            )
            .annotate(
                lifetime_ra=Func(F('lifetime_ra_raw'), 2, function='ROUND', output_field=FloatField()),
                ra_21_day=Func(F('ra_21_day_raw'), 2, function='ROUND', output_field=FloatField())
            )
        )

        if ra_percentage is not None:
            queryset = queryset.filter(ra_21_day_raw__gte=float(ra_percentage))

        return queryset

class CharacterViewSet(viewsets.ModelViewSet):
    queryset = models.Character.objects.all()
    serializer_class = CharacterSerializer
    # permission_classes = (PERMISSION_CLASS_DEBUG,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['player', "player__active"]
    pagination_class = AllowNoPagination


class RaidViewSet(viewsets.ModelViewSet):
    queryset = models.Raid.objects.all()
    serializer_class = RaidSerializer
    # permission_classes = (PERMISSION_CLASS_DEBUG,)
    filter_backends = (OrderingFilter,)
    ordering_fields = ['name', 'zone', 'created_at']

    def get_queryset(self):
        qs = models.Raid.objects.all().order_by('-id')
        limit = self.request.query_params.get("limit", None)
        if limit:
            limit = int(limit)
            qs = qs[:limit]
        return qs



class ItemAwardedViewSet(viewsets.ModelViewSet):
    queryset = models.ItemAwarded.objects.all()
    serializer_class = ItemAwardedSerializer
    # permission_classes = (PERMISSION_CLASS_DEBUG,)
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['player', 'raid', 'item__id']
    ordering_fields = ['player__name', 'raid__name', 'created_at', 'item__name', 'raid__created_at']
    pagination_class = AllowNoPagination


class PreferredPixelViewSet(viewsets.ModelViewSet):
    queryset = models.PreferredPixel.objects.all()
    serializer_class = PreferredPixelSerializer
    permission_classes = (PERMISSION_CLASS_DEBUG,)


class RaidAttendanceViewSet(viewsets.ModelViewSet):
    queryset = models.RaidAttendance.objects.all()
    serializer_class = RaidAttendanceSerializer
    # permission_classes = (PERMISSION_CLASS_DEBUG,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['player', 'raid']
    pagination_class = AllowNoPagination

# TODO: 12/7: Undergoing a refactor to how raids + item approval are handled. Commented out related code in custom endpoint
# TODO: Leave the commented out code in "just in case"
class RaidAttendanceApprovalViewSet(viewsets.ModelViewSet):
    queryset = models.RaidAttendanceApproval.objects.all()
    serializer_class = RaidAttendanceApprovalSerializer
    permission_classes = [PERMISSION_CLASS_DEBUG | HasAPIKey]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_approved']
    pagination_class = AllowNoPagination

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        raid_attendance_approval = self.get_object()
        if raid_attendance_approval.is_approved == True:
            raise ValidationError(f"Raid has already been approved. If you think this is a mistake, contact admin.")

        players = request.data.get("players_list")
        if isinstance(players, str):
            import json
            players = json.loads(players)
        if not players:
            raise ValidationError({"error": f"No players assigned to raid."})

        raid_name = request.data.get("raid_name")
        if not raid_name:
            raise ValidationError({"error": f"Please provide a name for the Raid."})

        with transaction.atomic():
            field = models.Raid._meta.get_field('created_at')
            old_auto_now_add = field.auto_now_add
            field.auto_now_add = False
            try:
                raid = models.Raid.objects.create(
                    name=raid_name,
                    created_at=raid_attendance_approval.created_at,
                )
                for player_name, discord_id in players:
                    try:
                        player = models.Player.objects.get(discord_id=discord_id)
                        models.RaidAttendance.objects.create(
                            player=player,
                            raid=raid,
                        )
                    except models.Player.DoesNotExist:
                        raise ValidationError({"error": f"Player '{player_name}' does not exist. Create player first and try again."})
            finally:
                field.auto_now_add = old_auto_now_add


            raid_attendance_approval.is_approved = True
            raid_attendance_approval.save()

        return Response({"message": f"Success: added raid '{raid_name} + attendees.'"}, status=200)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer
