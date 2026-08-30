import pytest

from app.models import Player, Raid, RaidAttendance, RaidAttendanceApproval


@pytest.fixture
def player_grixus(create_player):
    yield create_player("Grixus", "grixus.")


@pytest.fixture
def player_tune(create_player):
    yield create_player("Tune", "tune.")


@pytest.fixture
def player_noidz(create_player):
    yield create_player("Noidz", "noidz.")


@pytest.fixture
def players_list(
    player_grixus,
    player_tune,
    player_noidz,
):
    yield [
        [player_grixus.name, player_grixus.discord_id],
        [player_tune.name, player_tune.discord_id],
        [player_noidz.name, player_noidz.discord_id],
    ]


@pytest.fixture
def payload(players_list):
    yield {"players_list": players_list, "raid_name": "VT"}


# APPROVAL ENDPOINT TESTS
@pytest.mark.django_db
def test_raid_attendance_approval_happy_path(
    players_list,
    payload,
    superuser_client,
):
    approval_instance = RaidAttendanceApproval.objects.create(
        players_list=players_list,
    )
    assert Raid.objects.all().count() == 0
    assert RaidAttendance.objects.all().count() == 0
    assert not approval_instance.is_approved

    response = superuser_client.post(
        f"/api/raid_attendance_approval/{approval_instance.id}/approve/",
        payload,
        format="json",
    )

    assert response.status_code == 200
    assert RaidAttendance.objects.all().count() == len(payload["players_list"])
    assert Raid.objects.all().first().name == "VT"
    # Reload is needed because instance saved in endpoint is a different object in memory than fixture,
    # even though they both represent the same database row
    approval_instance.refresh_from_db()
    assert approval_instance.is_approved
    assert response.json()["message"] == f"Success: added raid '{payload['raid_name']} + attendees.'"


@pytest.mark.django_db
def test_raid_already_approved(
    players_list,
    payload,
    superuser_client,
):
    approval_instance = RaidAttendanceApproval.objects.create(
        players_list=players_list,
        is_approved=True,
    )
    response = superuser_client.post(
        f"/api/raid_attendance_approval/{approval_instance.id}/approve/",
        payload,
        format="json",
    )
    assert response.status_code == 400
    assert response.json()["error"] == "Raid has already been approved. If you think this is a mistake, contact Grixus."
    # Assert that transaction rollback succeeded
    raid_attendance = RaidAttendance.objects.all()
    assert raid_attendance.count() == 0


@pytest.mark.django_db
def test_no_raid_name(
    players_list,
    superuser_client,
):
    payload_no_name = {
        "players_list": players_list,
    }
    approval_instance = RaidAttendanceApproval.objects.create(
        players_list=players_list,
    )
    response = superuser_client.post(
        f"/api/raid_attendance_approval/{approval_instance.id}/approve/",
        payload_no_name,
        format="json",
    )
    assert response.status_code == 400
    assert response.json()["error"] == "Please provide a name for the Raid."
    # Assert that transaction rollback succeeded
    approval_instance.refresh_from_db()
    assert not approval_instance.is_approved
    raid_attendance = RaidAttendance.objects.all()
    assert raid_attendance.count() == 0


@pytest.mark.django_db
def test_player_does_not_exist(
    players_list,
    payload,
    superuser_client,
):
    extra_player = ["Warmbody", ".warmbody"]
    payload["players_list"].append(extra_player)
    approval_instance = RaidAttendanceApproval.objects.create(
        players_list=[*players_list, extra_player],
    )
    response = superuser_client.post(
        f"/api/raid_attendance_approval/{approval_instance.id}/approve/",
        payload,
        format="json",
    )
    assert response.status_code == 400
    assert response.json()["error"] == f"Player '{extra_player[0]}' does not exist. Create player first and try again."
    # Assert that transaction rollback succeeded
    approval_instance.refresh_from_db()
    assert not approval_instance.is_approved
    raid_attendance = RaidAttendance.objects.all()
    assert raid_attendance.count() == 0


@pytest.mark.django_db
def test_no_players_in_payload(superuser_client):
    payload = {"raid_name": "VT"}
    approval_instance = RaidAttendanceApproval.objects.create()
    response = superuser_client.post(
        f"/api/raid_attendance_approval/{approval_instance.id}/approve/",
        payload,
        format="json",
    )
    assert response.status_code == 400
    assert response.json()["error"] == "No players assigned to raid."
    # Assert that transaction rollback succeeded
    approval_instance.refresh_from_db()
    assert not approval_instance.is_approved
    raid_attendance = RaidAttendance.objects.all()
    assert raid_attendance.count() == 0


# REGULAR VIEWSET METHOD TESTS
@pytest.mark.django_db
def test_serializer_creates_new_player(
    payload,
    api_key_client,
):
    # When a player in the payload does not exist as a Player row yet, assert that we create that Player
    new_player = ["Warmbody", ".warmbody"]
    payload["players_list"].append(new_player)
    response = api_key_client.post(
        "/api/raid_attendance_approval/",
        payload,
        format="json",
    )
    assert response.status_code == 201
    new_player_instance = Player.objects.get(name="Warmbody")
    assert new_player_instance.name == new_player[0]
