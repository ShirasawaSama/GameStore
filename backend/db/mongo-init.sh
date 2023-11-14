#!/bin/sh

mongoimport --db GameStore --collection games --file /docker-entrypoint-initdb.d/games.json --jsonArray
