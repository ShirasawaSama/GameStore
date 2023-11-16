import json
import pytest
from Crypto.Cipher import PKCS1_v1_5 as PKCS1_cipher
import base64
from app import create_app
from routes.user.route import public_key
from routes.user.model import delete_user
from hashlib import sha1


cipher = PKCS1_cipher.new(public_key)


# Tests for users


def encrypt_password(password: str):
    return base64.b64encode(cipher.encrypt(password.encode())).decode('ASCII')


def login(test_client):
    data = {
        'username': 'testuser',
        'password': encrypt_password('testpassword'),
    }

    response = test_client.post('/api/user/login', json=data)
    data = json.loads(response.data)

    # check that the user was logged in successfully
    assert response.status_code == 200
    return {'Authorization': 'Bearer ' + data['access_token']}


@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app(True)
    testing_client = flask_app.test_client()

    # Establish an application context before running the tests.
    ctx = flask_app.app_context()
    ctx.push()

    yield testing_client  # this is where the testing happens!

    ctx.pop()


def test_register(test_client):
    delete_user('testuser')
    user_data = {
        'username': 'testuser',
        'password': encrypt_password('testpassword'),
    }

    response = test_client.post('/api/user/register', json=user_data)
    data = json.loads(response.data)

    # check that the user was created successfully
    assert response.status_code == 200
    assert data['access_token'] is not None


def test_like_game(test_client):
    response = test_client.put('/api/user/likes/1', headers=login(test_client))
    data = json.loads(response.data)

    # check that the game was liked successfully
    assert response.status_code == 200
    assert data['result'] is True


def test_get_likes(test_client):
    response = test_client.get('/api/user/likes', headers=login(test_client))
    data = json.loads(response.data)

    # check that the game was liked successfully
    assert response.status_code == 200
    assert '1' in data['likes']


def test_unlike_game(test_client):
    response = test_client.delete('/api/user/likes/1', headers=login(test_client))
    data = json.loads(response.data)

    # check that the game was unliked successfully
    assert response.status_code == 200
    assert data['result'] is True


# Tests for games

def test_search_games(test_client):
    response = test_client.get('/api/game/search?search=the', headers=login(test_client))
    data = json.loads(response.data)

    # check that the game was liked successfully
    assert response.status_code == 200
    assert data['total'] > 0
    assert data['games'] is not None


def test_get_game(test_client):
    response = test_client.get('/api/game/271590', headers=login(test_client))
    data = json.loads(response.data)

    # check that the game was liked successfully
    assert response.status_code == 200
    assert data['game']['name'] == 'Grand Theft Auto V'


def test_get_random_games(test_client):
    response = test_client.get('/api/game/random', headers=login(test_client))
    data = json.loads(response.data)

    # check that the game was liked successfully
    assert response.status_code == 200
    assert len(data['games']) == 5


def test_add_comment(test_client):
    response = test_client.put('/api/game/271590/comment', headers=login(test_client), json={'comment': 'test'})
    data = json.loads(response.data)

    # check that the game was liked successfully
    assert response.status_code == 200
    assert data['result'] is True


def test_like_comment(test_client):
    response = test_client.post('/api/game/271590/comment/1/like', headers=login(test_client))
    data = json.loads(response.data)

    # check that the game was liked successfully
    assert response.status_code == 200
    assert data['result'] is True


def test_delete_comment(test_client):
    response = test_client.delete('/api/game/271590/comment/1', headers=login(test_client))
    data = json.loads(response.data)

    # check that the game was liked successfully
    assert response.status_code == 200
    assert data['result'] is True
