DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
    uid SERIAL PRIMARY KEY,
    email VARCHAR(300) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    "firstName" VARCHAR(200) NOT NULL,
    "lastName" VARCHAR (200) NOT NULL,
    "profilePic" VARCHAR(300),
    bio VARCHAR(300),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships(
    fid SERIAL PRIMARY KEY,
    "fromUserId" INTEGER NOT NULL REFERENCES users(uid),
    status VARCHAR (200) NOT NULL,
    "toUserId" INTEGER NOT NULL REFERENCES users(uid)
);

CREATE TABLE messages(
    mid SERIAL PRIMARY KEY,
    "fromUserId" INTEGER NOT NULL REFERENCES users(uid),
    "toUserId" INTEGER REFERENCES users(uid),
    "toAll" BIT DEFAULT B'0'::"bit",
    "messageBody" VARCHAR (300) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read BIT DEFAULT B'0'::"bit"
);
