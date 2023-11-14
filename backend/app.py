from flask import Flask
from flask_jwt_extended import JWTManager
import configparser
import os
from routes import routes


class PrefixMiddleware(object):
    def __init__(self, app2, prefix=''):
        self.app = app2
        self.prefix = prefix

    def __call__(self, environ, start_response):
        if environ['PATH_INFO'].startswith(self.prefix):
            environ['PATH_INFO'] = environ['PATH_INFO'][len(self.prefix):]
            environ['SCRIPT_NAME'] = self.prefix
            return self.app(environ, start_response)
        else:
            start_response('404', [('Content-Type', 'text/plain')])
            return ["This url does not belong to the app.".encode()]


config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join('config.ini')))


app = Flask(__name__)
app.config["APPLICATION_ROOT"] = "/api"
app.config['JWT_SECRET_KEY'] = config['PROD']['JWT_SECRET_KEY']
app.config['MONGO_URI'] = config['PROD']['DB_URI']
app.wsgi_app = PrefixMiddleware(app.wsgi_app, prefix='/api')
jwt = JWTManager(app)
routes.register_routers(app)


@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
