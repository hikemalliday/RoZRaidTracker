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
def create_player():
    def _create_player(name, discord_id):
        return Player.objects.create(name=name, discord_id=discord_id)
    yield _create_player


@pytest.fixture
def create_characters():
    def _create_characters(characters):
        """Param 'characters' expects a list of dicts, with keys: name, player (Player instance), char_class, type"""
        for char in characters:
            yield Character.objects.create(**char)
    yield _create_characters
