from flask import Blueprint
from flask import jsonify
from flask import request

from . import model


blueprint = Blueprint('game', __name__, url_prefix='/game')


@blueprint.get('/query')
def get_games():
    page = request.args.get('page', 0, type=int)
    page_size = request.args.get('page_size', 10, type=int)
    sort = request.args.get('sort', 'recommendations', type=str)
    sort_order = request.args.get('sort_order', 'desc', type=str)
    search = request.args.get('search', None, type=str)
    tags = request.args.get('tags', None, type=str)

    if sort_order not in ['asc', 'desc']:
        sort_order = 'desc'

    if tags:
        tags = tags.split(',')

    if page_size > 100:
        page_size = 100

    if page_size < 1:
        page_size = 1

    games = model.get_games(page, page_size, sort, sort_order, search, tags)
    return jsonify(games=[game for game in games], page=page, page_size=page_size)


@blueprint.get('/random')
def get_random_games():
    games = model.get_random_games()
    return jsonify(games=[game for game in games])
