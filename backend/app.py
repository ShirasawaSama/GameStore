from flask import Flask
import configparser
import os
from routes import routes

config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join(".ini")))

app = Flask(__name__)
routes.register_routers(app)


@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.config['MONGO_URI'] = config['PROD']['DB_URI']
    app.run()
