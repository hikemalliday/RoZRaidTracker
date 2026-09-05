import sqlite3
from datetime import timedelta
from pathlib import Path

from django.conf import settings
from django.db import IntegrityError, transaction
from django.db.models import Count, ExpressionWrapper, F, FloatField, Func, Q
from django.utils import timezone
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.response import Response
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework_simplejwt.views import TokenObtainPairView

from app import models
from app.serializers.serializers import (
    CharacterSerializer,
    ItemAwardedSerializer,
    ItemSerializer,
    PlayerSerializer,
    PreferredPixelSerializer,
    RaidAttendanceApprovalSerializer,
    RaidAttendanceSerializer,
    RaidSerializer,
    TokenObtainPairSerializer,
    ZoneSerializer,
)


class InvalidCharEdit(ValidationError):
    """Exception for when a batch Character edit violates type rules."""


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


class OptionalPagination(PageNumberPagination):
    """Use the standard page response unless a caller explicitly requests all rows."""

    def paginate_queryset(self, queryset, request, view=None):
        if request.query_params.get("pagination") == "none":
            return None
        return super().paginate_queryset(queryset, request, view)


class ItemViewSet(viewsets.ModelViewSet):
    queryset = models.Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (DjangoModelPermissions,)
    pagination_class = OptionalPagination
    filterset_class = ItemFilter

    @action(detail=False, methods=["get"])
    def get_options(self, request, pk=None):
        qs = models.Item.objects.filter(itemawarded__isnull=False).distinct().order_by("name")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ZoneViewSet(viewsets.ModelViewSet):
    queryset = models.Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = (DjangoModelPermissions,)


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = models.Player.objects.all()
    serializer_class = PlayerSerializer
    permission_classes = (DjangoModelPermissions,)
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ["name", "lifetime_ra", "ra_21_day"]
    pagination_class = OptionalPagination
    filterset_class = PlayerFilter

    # TODO: The whole "21 day" thing should probably be named something different in the annotated field,
    # TODO: but the frontend is so dependent on it that I don't wanna refactor all that at the moment
    def get_queryset(self):
        num_of_days = int(self.request.query_params.get("num_of_days", 21))
        ra_percentage = self.request.query_params.get("ra_percentage", None)

        total_raids = models.Raid.objects.count() or 1

        date_threshold = timezone.now() - timedelta(days=num_of_days)
        total_raids_window = models.Raid.objects.filter(created_at__gte=date_threshold).count() or 1

        queryset = (
            models.Player.objects
            # 'annotate()' basically adds a new field to the model instance
            .annotate(
                total_ra=Count("raidattendance", distinct=True),
                # 'ExpressionWrapper' is used to do SQL math operations.
                lifetime_ra_raw=ExpressionWrapper(
                    # F() is used to reference other calculated fields
                    (100.0 * F("total_ra") / total_raids),
                    output_field=FloatField(),
                ),
                total_ra_21_days=Count(
                    "raidattendance",
                    filter=Q(raidattendance__raid__created_at__gte=date_threshold),
                    distinct=True,
                ),
                ra_21_day_raw=ExpressionWrapper(
                    (100.0 * F("total_ra_21_days") / total_raids_window),
                    output_field=FloatField(),
                ),
            ).annotate(
                lifetime_ra=Func(F("lifetime_ra_raw"), 2, function="ROUND", output_field=FloatField()),
                ra_21_day=Func(F("ra_21_day_raw"), 2, function="ROUND", output_field=FloatField()),
            )
        )

        if ra_percentage is not None:
            queryset = queryset.filter(ra_21_day_raw__gte=float(ra_percentage))

        return queryset


class CharacterViewSet(viewsets.ModelViewSet):
    queryset = models.Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = (DjangoModelPermissions,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["player", "player__active"]
    pagination_class = OptionalPagination

    # Used by PlayerEditView. We will ALWAYS batch edit ALL characters for a given Player.
    # _validate_batch helper ensures this. If frontend payload / approach ever changes, it will be gated here.
    @action(detail=False, methods=["patch"])
    def batch(self, request):
        def _validate_batch(payload):
            submitted_ids = {int(char_id) for char_id in payload}
            submitted_characters = self.get_queryset().filter(id__in=submitted_ids)
            if submitted_characters.count() != len(submitted_ids):
                raise InvalidCharEdit({"error": "One or more characters do not exist."})
            player_ids = set(submitted_characters.values_list("player_id", flat=True))
            if len(player_ids) != 1:
                raise InvalidCharEdit({"error": "All batch-edited characters must belong to one player."})
            player_id = player_ids.pop()
            all_player_ids = set(models.Character.objects.filter(player_id=player_id).values_list("id", flat=True))
            if submitted_ids != all_player_ids:
                raise InvalidCharEdit({"error": "The batch must include every character for this player."})
            # Validate the types are valid
            num_main = 0
            num_main_alt = 0
            for char_type in payload.values():
                if char_type not in ("MAIN", "MAIN_ALT", "ALT"):
                    raise InvalidCharEdit({"error": "Must provide a valid character type."})
                if char_type == "MAIN":
                    num_main += 1
                elif char_type == "MAIN_ALT":
                    num_main_alt += 1
            if num_main > 1:
                raise InvalidCharEdit({"error": "Player cannot have more than 1 main."})
            if num_main_alt > 2:
                raise InvalidCharEdit({"error": "Player cannot have more than 2 main alts."})

        # Safeguard to avoid database level 'Can only have one MAIN' constraint. Set all chars to ALT first.
        def _set_alt_all(payload):
            for char_id in payload.keys():
                char = self.queryset.get(id=char_id)
                char.type = "ALT"
                char.save()

        with transaction.atomic():
            try:
                _validate_batch(request.data)
                _set_alt_all(request.data)
                for char_id, char_type in request.data.items():
                    char = self.queryset.get(id=char_id)
                    char.type = char_type
                    char.save()
                return Response({"message": "Success: updated characters batch."}, status=200)
            except models.Character.DoesNotExist as exc:
                raise ValidationError({"error": f"Character ID'{char_id}' does not exist."}) from exc
            except IntegrityError as integrity_exc:
                raise ValidationError({"error": integrity_exc}) from integrity_exc


class RaidViewSet(viewsets.ModelViewSet):
    queryset = models.Raid.objects.all()
    serializer_class = RaidSerializer
    permission_classes = (DjangoModelPermissions,)
    filter_backends = (OrderingFilter,)
    ordering_fields = ["name", "zone", "created_at"]

    def get_queryset(self):
        qs = models.Raid.objects.all().order_by("-id")
        limit = self.request.query_params.get("limit", None)
        if limit:
            limit = int(limit)
            qs = qs[:limit]
        return qs


class ItemAwardedViewSet(viewsets.ModelViewSet):
    queryset = models.ItemAwarded.objects.all()
    serializer_class = ItemAwardedSerializer
    permission_classes = (DjangoModelPermissions,)
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["player", "raid", "item__id"]
    ordering_fields = ["player__name", "raid__name", "created_at", "item__name", "raid__created_at"]
    pagination_class = OptionalPagination


class PreferredPixelViewSet(viewsets.ModelViewSet):
    queryset = models.PreferredPixel.objects.all()
    serializer_class = PreferredPixelSerializer
    permission_classes = (DjangoModelPermissions,)


class RaidAttendanceViewSet(viewsets.ModelViewSet):
    queryset = models.RaidAttendance.objects.all()
    serializer_class = RaidAttendanceSerializer
    permission_classes = (DjangoModelPermissions,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["player", "raid"]
    pagination_class = OptionalPagination


class RaidAttendanceApprovalViewSet(viewsets.ModelViewSet):
    queryset = models.RaidAttendanceApproval.objects.all()
    serializer_class = RaidAttendanceApprovalSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["is_approved"]
    pagination_class = OptionalPagination

    def get_permissions(self):
        if self.action == "create":
            # Discord bot: POST
            return [HasAPIKey()]
        return [DjangoModelPermissions()]

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        raid_attendance_approval = self.get_object()
        if raid_attendance_approval.is_approved:
            raise ValidationError(
                {"error": "Raid has already been approved. If you think this is a mistake, contact Grixus."}
            )

        players = request.data.get("players_list")
        if isinstance(players, str):
            import json

            players = json.loads(players)
        if not players:
            raise ValidationError({"error": "No players assigned to raid."})

        raid_name = request.data.get("raid_name")
        if not raid_name:
            raise ValidationError({"error": "Please provide a name for the Raid."})

        with transaction.atomic():
            field = models.Raid._meta.get_field("created_at")
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
                    except models.Player.DoesNotExist as exc:
                        raise ValidationError(
                            {"error": f"Player '{player_name}' does not exist. Create player first and try again."}
                        ) from exc
            finally:
                field.auto_now_add = old_auto_now_add

            raid_attendance_approval.is_approved = True
            raid_attendance_approval.save()

        return Response({"message": f"Success: added raid '{raid_name} + attendees.'"}, status=200)


# Don't really care to add perms here, its read only by default
class SQLQueryViewSet(viewsets.GenericViewSet):
    DB_PATH = Path(settings.BASE_DIR) / "db.sqlite3"

    @action(detail=False, methods=["post"])
    def query(self, request):
        sql = request.data.get("query", "").strip()
        if not sql:
            return Response(
                {"error": "Query is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            # SQLite read-only connection
            conn = sqlite3.connect(
                f"file:{self.DB_PATH}?mode=ro",
                uri=True,
            )
            conn.row_factory = sqlite3.Row

            with conn:
                cursor = conn.execute(sql)
                columns = [col[0] for col in cursor.description]
                rows = [dict(zip(columns, row)) for row in cursor.fetchall()]  # noqa: B905
            return Response({"results": rows})

        except sqlite3.Error as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer
