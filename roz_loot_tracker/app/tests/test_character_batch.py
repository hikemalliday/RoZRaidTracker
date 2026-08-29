import pytest
from app.models import Character


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
