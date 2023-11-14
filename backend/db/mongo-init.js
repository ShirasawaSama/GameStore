db.createUser(
    {
        user: 'admin',
        pwd: 'admin',
        roles: [
            {
                role: 'readWrite',
                db: 'GameStore'
            }
        ]
    }
)

db.createCollection('games')
db.createCollection('users')
