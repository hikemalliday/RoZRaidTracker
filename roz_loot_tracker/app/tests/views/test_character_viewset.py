import pytest
from app.models import Character, Player


@pytest.fixture
def player_grixus(create_player):
    yield create_player("Grixus", "grixus.")


@pytest.fixture
def player_tune(create_player):
    yield create_player("Tune", "tune.")


@pytest.fixture
def characters(player_grixus):
    yield [
        Character.objects.create(
            name="Penalty",
            player=player_grixus,
            char_class="MNK",
            type="MAIN",
        ),
        Character.objects.create(
            name="Fullstack",
            player=player_grixus,
            char_class="WIZ",
            type="MAIN_ALT",
        ),
        Character.objects.create(
            name="Lifesaver",
            player=player_grixus,
            char_class="CLR",
            type="ALT",
        ),
    ]


@pytest.fixture
def characters_two_players(player_grixus, player_tune):
    yield [
        Character.objects.create(
            name="Penalty",
            player=player_grixus,
            char_class="MNK",
            type="MAIN",
        ),
        Character.objects.create(
            name="Fullstack",
            player=player_grixus,
            char_class="WIZ",
            type="MAIN_ALT",
        ),
        Character.objects.create(
            name="Lifesaver",
            player=player_grixus,
            char_class="CLR",
            type="ALT",
        ),
        Character.objects.create(
            name="Meatcurtains",
            player=player_tune,
            char_class="WAR",
            type="ALT",
        ),
    ]

# CUSTOM ENDPOINT TESTS
@pytest.mark.django_db
def test_batch_updates_every_character_for_a_player(api_client, characters):
    main, main_alt, alt = characters
    response = api_client.patch(
        "/api/characters/batch/",
        {
            str(main.id): "MAIN_ALT",
            str(main_alt.id): "ALT",
            str(alt.id): "MAIN",
        },
        format="json",
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Success: updated characters batch."
    assert Character.objects.get(id=main.id).type == "MAIN_ALT"
    assert Character.objects.get(id=main_alt.id).type == "ALT"
    assert Character.objects.get(id=alt.id).type == "MAIN"


@pytest.mark.django_db
def test_batch_update_omit_character_fails(api_client, characters):
    main, main_alt, alt = characters
    response = api_client.patch(
        "/api/characters/batch/",
        {
            str(main.id): "MAIN_ALT",
            str(main_alt.id): "ALT",
        },
        format="json",
    )
    assert response.status_code == 400
    assert response.json()["error"] == 'The batch must include every character for this player.'


@pytest.mark.django_db
def test_batch_update_cannot_set_two_mains(api_client, characters):
    main, main_alt, alt = characters
    response = api_client.patch(
        "/api/characters/batch/",
        {
            str(main.id): "MAIN_ALT",
            str(main_alt.id): "MAIN",
            str(alt.id): "MAIN",
        },
        format="json",
    )
    assert response.status_code == 400
    assert response.json()["error"] == 'Player cannot have more than 1 main.'


@pytest.mark.django_db
def test_batch_update_cannot_set_more_than_two_main_alts(api_client, characters):
    main, main_alt, alt = characters
    response = api_client.patch(
        "/api/characters/batch/",
        {
            str(main.id): "MAIN_ALT",
            str(main_alt.id): "MAIN_ALT",
            str(alt.id): "MAIN_ALT",
        },
        format="json",
    )
    assert response.status_code == 400
    assert response.json()["error"] == 'Player cannot have more than 2 main alts.'


@pytest.mark.django_db
def test_batch_update_cannot_have_multiple_players(api_client, characters_two_players):
    main, main_alt, alt, alt_2 = characters_two_players
    response = api_client.patch(
        "/api/characters/batch/",
        {
            str(main.id): "MAIN_ALT",
            str(main_alt.id): "MAIN",
            str(alt.id): "ALT",
            str(alt_2.id): "MAIN_ALT",
        },
        format="json",
    )
    assert response.status_code == 400
    assert response.json()["error"] == "All batch-edited characters must belong to one player."


@pytest.mark.django_db
def test_must_provide_valid_character_type(api_client, characters):
    main, main_alt, alt = characters
    response = api_client.patch(
        "/api/characters/batch/",
        {
            str(main.id): "MAIN_ALT",
            str(main_alt.id): "ALT",
            str(alt.id): "INVALID_CHAR_TYPE",
        },
        format="json",
    )
    assert response.status_code == 400
    assert response.json()["error"] == "Must provide a valid character type."
