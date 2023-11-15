from db import db
from bson.objectid import ObjectId
import datetime


def get_game_by_id(game_id):
    return db.games.find_one({"_id": game_id})


def get_games(page, page_size, sort, sort_order, search, tags):
    query = {}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    if tags:
        for tag in tags:
            query["tags" + "." + tag] = {"$exists": True}

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


def add_comment(game_id, username, comment):
    return db.games.update_one({"_id": game_id}, {"$push": {"comments": {
        "username": username,
        "comment": comment,
        "likes": [],
        "date": str(datetime.datetime.now(datetime.UTC)),
        "_id": str(ObjectId())
    }}})


def delete_comment(game_id, username, comment_id):
    return db.games.update_one({"_id": game_id}, {"$pull": {"comments": {
        "_id": comment_id,
        "username": username,
    }}})


def like_comment(game_id, username, comment_id):
    return db.games.update_one(
        {"_id": game_id, "comments._id": comment_id},
        {"$addToSet": {"comments.$.likes": username}}
    )


def unlike_comment(game_id, username, comment_id):
    return db.games.update_one(
        {"_id": game_id, "comments._id": comment_id},
        {"$pull": {"comments.$.likes": username}}
    )
