from flask import Blueprint
from flask import jsonify
from flask import request

from . import model


blueprint = Blueprint('game', __name__, url_prefix='/game')


@blueprint.get('/search')
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

    return jsonify(model.get_games(page, page_size, sort, sort_order, search, tags))


@blueprint.get('/random')
def get_random_games():
    games = model.get_random_games()
    return jsonify(games=[game for game in games])


@blueprint.get('/<game_id>')
def get_game(game_id):
    game = model.get_game_by_id(game_id)
    if not game:
        return jsonify({'error': 'Game not found'})
    return jsonify(game=game)


@blueprint.post('/<game_id>')
def add_game(game_id):
    game = model.get_game_by_id(game_id)
    if not game:
        return jsonify({'error': 'Game not found'})
    return jsonify(model.add_game(game))


@blueprint.post('/<game_id>/comment')
@jwt_required
def add_comment(game_id, comment):
    username = get_jwt_identity()
    if not username:
        return jsonify({'error': 'User not found'})
    if not comment:
        return jsonify({'error': 'Comment cannot be empty'})
    if len(comment) > 500:
        return jsonify({'error': 'Comment cannot be longer than 500 characters'})
    return jsonify(comment=model.add_comment(game_id, username, comment))


@blueprint.delete('/<game_id>/comment/<comment_id>')
@jwt_required
def delete_comment(game_id, comment_id):
    username = get_jwt_identity()
    if not username:
        return jsonify({'error': 'User not found'})
    return jsonify(result=model.delete_comment(game_id, username, comment_id))


@blueprint.post('/<game_id>/comment/<comment_id>/like')
@jwt_required
def like_comment(game_id, comment_id):
    username = get_jwt_identity()
    if not username:
        return jsonify({'error': 'User not found'})
    return jsonify(result=model.like_comment(game_id, username, comment_id))


@blueprint.delete('/<game_id>/comment/<comment_id>/like')
@jwt_required
def unlike_comment(game_id, comment_id):
    username = get_jwt_identity()
    if not username:
        return jsonify({'error': 'User not found'})
    return jsonify(result=model.unlike_comment(game_id, username, comment_id))
