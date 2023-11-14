from .user import route as user


routes = [
    user.blueprint
]


def register_routers(app):
    for route in routes:
        app.register_blueprint(route)
