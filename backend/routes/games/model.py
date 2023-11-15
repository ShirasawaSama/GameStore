from db import db


def get_game_by_id(game_id):
    return db.users.find_one({"_id": game_id})


def get_games(page, page_size, sort, sort_order, search, tags):
    query = {}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    if tags:
        tags_search = {}
        for tag in tags:
            tags_search[tag] = {"$exists": True}
        query["tags"] = tags_search

    ret = db.games.find(query)
    if sort:
        ret = ret.sort(sort, 1 if sort_order == 'asc' else -1)
    return {
        "games": [game for game in ret.skip(page * page_size).limit(page_size)],
        "total": db.games.count_documents(query),
        "page": page,
        "pageSize": page_size
    }


def get_random_games():
    return db.games.aggregate([
        {"$match": {"metacritic_score": {"$gt": 60}, "movies": {"$elemMatch": {"$exists": True}}}},
        {"$sample": {"size": 5}}
    ])
