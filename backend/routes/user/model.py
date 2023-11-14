from db import db


def get_user_by_id(user_id):
    return db.users.find_one({"_id": user_id})


def get_user_by_username(name):
    return db.users.find_one({"name": name})


def create_user(name, password, salt):
    return db.users.insert_one({"name": name, "password": password, "salt": salt})


def update_user(name, password):
    return db.users.update_one({"name": name}, {"$set": {"password": password}})
