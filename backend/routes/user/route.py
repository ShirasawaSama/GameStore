from flask import Blueprint

blueprint = Blueprint('user', __name__, url_prefix='/user')


@blueprint.route('/login')
def login():
    return 'Login'


@blueprint.route('/register')
def register():
    return 'Register'
