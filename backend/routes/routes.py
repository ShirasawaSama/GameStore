from .user import route as user
from .games import route as games


routes = [
    user.blueprint,
    games.blueprint,
]


def register_routers(app):
    for route in routes:
        app.register_blueprint(route)
