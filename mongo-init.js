db.createUser(
    {
        user: "myUser",
        pwd: "pass",
        roles: [
            {
                role: "readWrite",
                db: "parking-lot"
            }
        ]
    });