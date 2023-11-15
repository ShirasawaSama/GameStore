import base64
import re

from flask import Blueprint
from flask import jsonify
from flask import request

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

from Crypto import Random
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5 as PKCS1_cipher
from hashlib import sha1

from . import model

blueprint = Blueprint('user', __name__, url_prefix='/user')

random_generator = Random.new().read
rsa = RSA.generate(1024, random_generator)

private_key = rsa.exportKey()
cipher = PKCS1_cipher.new(rsa)

public_key = rsa.publickey().exportKey()
public_key_str = public_key.decode('utf-8')

username_regex = r'^[a-zA-Z0-9_]{3,16}$'


def encrypt_password(password, salt):
    return sha1(
        (sha1(
            cipher.decrypt(base64.b64decode(password), None).decode('utf-8').encode()
        ).hexdigest() + salt).encode()
    ).hexdigest()


@blueprint.get('/public-key')
def get_public_key():
    return public_key_str


@blueprint.post('/login')
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password or not re.match(username_regex, username):
        return jsonify({'error': 'Bad username or password'})

    user = model.get_user_by_username(username)
    if not user or encrypt_password(password, user['salt']) != user['password']:
        return jsonify({'error': 'Bad username or password'})

    return jsonify(access_token=create_access_token(identity=username, expires_delta=False))


@blueprint.post('/register')
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password or not re.match(username_regex, username):
        return jsonify({'error': 'Bad username or password'})

    user = model.get_user_by_username(username)
    if user:
        return jsonify({'error': 'User already exists'})

    salt = base64.b64encode(Random.new().read(32)).decode('utf-8')
    password = encrypt_password(password, salt)

    model.create_user(username, password, salt)

    return jsonify(access_token=create_access_token(identity=username))


@blueprint.patch('/change-password')
@jwt_required()
def change_password():
    username = get_jwt_identity()
    password = request.json.get('password', None)

    if not username or not password:
        return jsonify({'error': 'Bad username or password'})

    salt = base64.b64encode(Random.new().read(32)).decode('utf-8')
    password = encrypt_password(password, salt)

    model.update_user(username, password)

    return jsonify(access_token=create_access_token(identity=username))
