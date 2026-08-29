from pickletools import dis

import pytest
from rest_framework.test import APIClient
from rest_framework_api_key.models import APIKey
from app.models import Character, Player


@pytest.fixture
def api_key():
    _, key = APIKey.objects.create_key(name="test-client")
    yield key


@pytest.fixture
def api_client(api_key):
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Api-Key {api_key}")
    yield client


@pytest.fixture
def player():
    yield Player.objects.create(name="Grixus", discord_id="123")


@pytest.fixture
def create_player():
    def _create_player(name, discord_id):
        return Player.objects.create(name=name, discord_id=discord_id)
    yield _create_player


@pytest.fixture
def characters(player):
    yield [
        Character.objects.create(
            name="Penalty",
            player=player,
            char_class="MNK",
            type="MAIN",
        ),
        Character.objects.create(
            name="Fullstack",
            player=player,
            char_class="WIZ",
            type="MAIN_ALT",
        ),
        Character.objects.create(
            name="Lifesaver",
            player=player,
            char_class="CLR",
            type="ALT",
        ),
    ]


@pytest.fixture
def create_characters():
    def _create_characters(characters):
        """Param 'characters' expects a list of dicts, with keys: name, player (Player instance), char_class, type"""
        for char in characters:
            yield Character.objects.create(**char)
    yield _create_characters


@pytest.fixture
def player_grixus(create_player):
    yield create_player("Grixus", "grixus.")


@pytest.fixture
def player_tune(create_player):
    yield create_player("Tune", "tune.")


@pytest.fixture
def player_noidz(create_player):
    yield create_player("Noidz", "noidz.")