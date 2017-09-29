// dbQuery.js

// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const spicedPg = require( 'spiced-pg' );
const db = spicedPg( process.env.DATABASE_URL || require( '../config/secrets.json' )
    .psqlConfig );
const {
    hashPassword,
    checkPassword
} = require( './hasher' );

const s3Url = require( '../config/secrets.json' ).s3Url;




// CREATE NEW USER _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.createUser = ( firstName, lastName, email, password ) => {
    console.log( 'dbQuery.js - fn: "postUser"\n' );
    // hash user password with bcrypt ( hashPassword ) before saving
    return hashPassword( password )

        .then( ( hashedPass ) => {

            const query = ` INSERT INTO users ( "firstName", "lastName", email, password)
                            VALUES ($1, $2, $3, $4)
                            RETURNING uid, "firstName", "lastName"`;

            return db.query( query, [
                firstName,
                lastName,
                email,
                hashedPass
            ] );
        } )

        .then( ( userData ) => {
            return userData.rows[ 0 ];
        } )

        .catch( ( err ) => {
            console.error( err.stack );
        } );
};
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// AUTHENTICATE USER_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.checkUser = ( email, password ) => {

    console.log( 'dbQuery.js - fn: "checkUser"\n' );

    // step 1 - search on db for matching email.
    return db.query( 'SELECT EXISTS ( SELECT email FROM users WHERE email = $1 )', [ email ] )


        .then( ( checkOut ) => {
            if ( checkOut.rows[ 0 ].exists ) {
                // step 1.5 - retrieve the data but do not send anything back yet.
                const query = `SELECT uid, "firstName", "lastName", email, password
                        FROM users
                        WHERE email = $1;`;
                return db.query( query, [ email ] )

                    .then( ( dbUser ) => {
                        return {
                            uid: dbUser.rows[ 0 ].uid,
                            firstName: dbUser.rows[ 0 ].firstName,
                            lastName: dbUser.rows[ 0 ].lastName,
                            email: dbUser.rows[ 0 ].email,
                            hashedPass: dbUser.rows[ 0 ].password
                        };
                    } )

                    .then( ( dbUser ) => {
                        // step 2 - convert provided password and checkPassword
                        // step 3 - checkPassword returns either true or false.
                        return checkPassword( password, dbUser.hashedPass )
                            .then( ( doesMatch ) => {
                                if ( !doesMatch ) {
                                    throw 'wrong email and password';
                                }
                                return {
                                    uid: dbUser.uid,
                                    firstName: dbUser.firstName,
                                    lastName: dbUser.lastName,
                                };
                            } );
                    } );
            } else {
                // step 1.2 - if there's no matching mail in db then inform the route
                return;
            }
        } )

        .catch( ( err ) => {
            console.error( err.stack );
        } );
};
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// GET LOGGED IN USER DATA_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.readUser = ( uid ) => {
    console.log( 'dbQuery.js - fn: "readUser"\n' );

    const query = `SELECT   uid,
                            "firstName",
                            "lastName",
                            email,
                            bio,
                            "profilePic"
                    FROM users
                    WHERE uid = $1;`;

    return db.query( query, [ uid ] )

        .then( ( results ) => {

            if ( !results.rows[ 0 ].profilePic ) {
                const defProfilePic =
                    `def_profilePic_${(Math.floor(Math.random()*(12-1+1)+1))}.svg`;
                results.rows[ 0 ].profilePic = s3Url + 'def_profilePic/' + defProfilePic;
            } else {
                results.rows[ 0 ].profilePic = s3Url + results.rows[ 0 ].profilePic;
            }
            return results.rows[ 0 ];
        } )

        .catch( err => console.error( err.stack ) );
};
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// GET OTHER USER'S DATA_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.getOtherUserInfo = ( uid ) => {
    console.log( 'dbQuery.js - fn: "getOtherUserInfo"\n' );
    const query = `SELECT   uid,
                            "firstName",
                            "lastName",
                            email,
                            bio,
                            "profilePic"
                    FROM users
                    WHERE uid = $1;`;
    return db.query( query, [ uid ] )

        .then( ( results ) => {

            if ( !results.rows[ 0 ].profilePic ) {
                const defProfilePic =
                    `def_profilePic_${(Math.floor(Math.random()*(12-1+1)+1))}.svg`;
                results.rows[ 0 ].profilePic = s3Url + 'def_profilePic/' + defProfilePic;
            }
            //
            else {
                results.rows[ 0 ].profilePic = s3Url + results.rows[ 0 ].profilePic;
            }
            //
            return results.rows[ 0 ];
        } )


        .catch( ( err ) => {
            console.error( err.stack );
        } );
};
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// SET USER PROFILE PICTURE PROFILE_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.saveUserProfilePic = ( uid, profilePic ) => {
    console.log( 'dbQuery.js - fn: "saveUserProfilePic"\n' );

    const query = `UPDATE users SET "profilePic" = $2
                    WHERE uid = $1
                    RETURNING   uid,
                                "firstName",
                                "lastName",
                                email,
                                bio,
                                "profilePic"`;

    return db.query( query, [ uid, profilePic ] )

        .then( results => {
            // console.log( results.rows[ 0 ] );
            results.rows[ 0 ].profilePic = s3Url + results.rows[ 0 ].profilePic;
            return results.rows[ 0 ];
        } )

        .catch( err => console.error( err.stack ) );
};
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




//  SET USER BIO_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.saveUserBio = ( uid, bio ) => {
    console.log( 'dbQuery.js - fn: "saveUserBio"\n' );

    const query = `UPDATE users SET bio = $2
                    WHERE uid = $1
                    RETURNING   uid,
                                "firstName",
                                "lastName",
                                email,
                                bio,
                                "profilePic";`;
    return db.query( query, [ uid, bio ] )
        .then( ( resp ) => {
            // console.log( resp.rows[ 0 ] );
            resp.rows[ 0 ].profilePic = s3Url + resp.rows[ 0 ].profilePic;
            return resp.rows[ 0 ];
        } )

        .catch( ( err ) => {
            console.error( err.stack );
        } );
};
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




//  READ DATA FROM LATEST 20 USERS TO REGISTER_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.readLatestUsers = () => {
    console.log( 'dbQuery.js - fn: "readLatestUsers"\n' );
    const query = `SELECT   uid,
                            "firstName",
                            "lastName",
                            email,
                            bio,
                            "profilePic"
                    FROM users
                    ORDER BY timestamp desc
                    LIMIT 10;`;
    return db.query( query )
        .then( latestUsers => {
            // console.log( results.rows );
            const s3mappedlatestUsers = latestUsers.rows.map( user => {
                if ( !user.profilePic ) {
                    const defProfilePic =
                        `def_profilePic_${(Math.floor(Math.random()*(12-1+1)+1))}.svg`;
                    user.profilePic = s3Url + 'def_profilePic/' + defProfilePic;
                } else {
                    user.profilePic = s3Url + user.profilePic;
                }
                return user;
            } );
            return s3mappedlatestUsers;
        } )
        .catch( err => console.log( err.stack ) );
};
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _



//  READ SEARCHED DATA FOR USERS_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.readSearchedUsers = ( search ) => {
    // console.log( 'dbQuery.js - fn: "readSearchedUsers"\n' );
    const query = `SELECT   uid,
                            "firstName",
                            "lastName",
                            email,
                            bio,
                            "profilePic"
                    FROM users
                    WHERE (email LIKE LOWER($1))
                    OR ("firstName" LIKE LOWER($1))
                    OR (LOWER("lastName") LIKE LOWER($1));`;
    return db.query( query, [ search + '%' ] )
        .then( results => {

            const s3mappedSearchedUsers = results.rows.map( user => {
                if ( !user.profilePic ) {
                    const defProfilePic =
                        `def_profilePic_${(Math.floor(Math.random()*(12-1+1)+1))}.svg`;
                    user.profilePic = s3Url + 'def_profilePic/' + defProfilePic;
                } else {
                    user.profilePic = s3Url + user.profilePic;
                }
                return user;
            } );
            console.log( 'dbQuery.js - fn: "readSearchedUsers"\n', s3mappedSearchedUsers );
            return s3mappedSearchedUsers;
        } )
        .catch( err => console.error( err.stack ) );
};



// READ ALL USERS FROM THIS ARRYS OF IDS _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.readAllUsersByIds = ( arrayOfIds ) => {
    console.log( `dbQuery.js - fn: "readAllUsersByIds" -  arrayOfIds: ${arrayOfIds} \n` );
    const query = `SELECT   uid,
                            "firstName",
                            "lastName",
                            email,
                            bio,
                            "profilePic"
                    FROM users
                    WHERE uid = ANY($1)`;
    return db.query( query, [ arrayOfIds ] )

        .then( onlineUsers => {

            const s3mappedOnlineUsers = onlineUsers.rows.map( user => {
                if ( !user.profilePic ) {
                    const defProfilePic =
                        `def_profilePic_${(Math.floor(Math.random()*(12-1+1)+1))}.svg`;
                    user.profilePic = s3Url + 'def_profilePic/' + defProfilePic;
                    user.online = true;
                } else {
                    user.profilePic = s3Url + user.profilePic;
                    user.online = true;
                }
                return user;
            } );
            return s3mappedOnlineUsers;

        } )

        .catch( err => console.log( err ) );
};
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// READ ALL fromUserId FRIENDS_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.readAllFriends = ( fromUserId ) => {
    // console.log( 'dbQuery.js - fn: "readAllFriends"' );
    const query = `SELECT   users.uid,
                            users."firstName",
                            users."lastName",
                            users."profilePic",
                            users.bio,
                            friendships.status
                    FROM friendships
                    INNER JOIN users
                    ON (friendships.status = 'PENDING' AND "toUserId" = $1 AND "fromUserId" = users.uid)
                    OR (friendships.status = 'ACCEPTED' AND "fromUserId" = $1 AND "toUserId" = users.uid)
                    OR (friendships.status = 'ACCEPTED' AND "toUserId" = $1 AND "fromUserId" = users.uid)
                    OR (friendships.status = 'TERMINATED' AND "fromUserId" = $1 AND "toUserId" = users.uid)
                    OR (friendships.status = 'TERMINATED' AND "toUserId" = $1 AND "fromUserId" = users.uid);`;

    return db.query( query, [ fromUserId ] )

        .then( friends => {
            console.log( 'dbQuery.js - fn: "readAllFriends"' );

            var s3mappedFriends = friends.rows.map( friend => {
                if ( !friend.profilePic ) {
                    const defProfilePic =
                        `def_profilePic_${(Math.floor(Math.random()*(12-1+1)+1))}.svg`;
                    friend.profilePic = s3Url + 'def_profilePic/' + defProfilePic;
                } else {
                    friend.profilePic = s3Url + friend.profilePic;
                }
                return friend;
            } );
            return s3mappedFriends;
        } )

        .catch( err => console.error( err.stack ) );
};
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// READ FRIENDSHIP STATUS OF fromUserId AND toUserId_ _ _ _ _ _ _ _ _ _ _ _ _ _
const readFriendshipStatus = ( fromUserId, toUserId ) => {
    console.log( 'dbQuery.js - fn: "readFriendshipStatus"' );

    const query = `SELECT  "fId",
                            "fromUserId",
                            status,
                            "toUserId"
                    FROM friendships
                    WHERE ("fromUserId" = $1 AND "toUserId" = $2)
                    OR	("fromUserId" = $2 AND "toUserId" = $1);`;

    return db.query( query, [ fromUserId, toUserId ] )

        .then( ( result ) => {
            console.log( 'dbQuery.js - fn: "readFriendshipStatus" - result', result.rows );

            if ( result.rows.length == 0 ) {
                return;
            } else if ( result.rows.length > 1 ) {
                const fId = result.rows[ ( result.rows.length - 1 ) ].fId;
                const query = `DELETE FROM friendships
                                WHERE "fId" = $1`;
                return db.query( query, [ fId ] )

                    .then( () => readFriendshipStatus( fromUserId, toUserId ) )

                    .catch( err => console.error( err.stack ) );
            } else {
                return result.rows[ 0 ];
            }
        } )

        .catch( err => console.error( err.stack ) );
};
module.exports.readFriendshipStatus = readFriendshipStatus;
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// CREATE FRIENDSHIP between fromUserId AND toUserId_ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.createFriendshipReq = ( fromUserId, toUserId, status ) => {
    console.log( 'dbQuery.js - fn: "createFriendship"' );

    const query = `INSERT INTO friendships
                    ("fromUserId", "toUserId", status)
                    VALUES ($1, $2, $3)
                    RETURNING fid, "fromUserId", status, "toUserId";`;

    return db.query( query, [ fromUserId, toUserId, status ] )

        .then( result => {
            const toReturn = Object.assign( result.rows[ 0 ], { success: true } );
            console.log(toReturn);
            return toReturn;
        } )

        .catch( err => console.error( err.stack ) );
};
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// UPDATE FREINDSHIP STATUS between fromUserId AND toUserId_ _ _ _ _ _ _ _ _ _ _
module.exports.updateFriendshipStatus = ( fromUserId, toUserId, status ) => {
    console.log( 'dbQuery.js - fn: "updateFriendshipStatus" fromUserId:', fromUserId, toUserId, status  );

    const query = ` UPDATE friendships
                    SET "fromUserId" = $1,
                        "toUserId" = $2,
                        status = $3
                    WHERE ("fromUserId" = $1 AND "toUserId" = $2)
                    OR ("fromUserId" = $2 and "toUserId" = $1)
                    RETURNING fid, "fromUserId", status, "toUserId";`;


    return db.query( query, [ fromUserId, toUserId, status ] )

        .then( result => {
            console.log('result.rows: ', result.rows);
            const wtf = Object.assign( result.rows[ 0 ], { success: true } );
            console.log('wtf: ',wtf);
            return wtf
        })

        .catch( err => console.error( "wtf is goin on", err.stack ) );
};
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// DELETE FREINDSHIP between fromUserId AND toUserId_ _ _ _ _ _ _ _ _ _ _ _ _ _
module.exports.deleteFriendship = ( fromUserId, toUserId ) => {
    console.log( 'dbQuery.js - fn: "deleteFriendship"' );

    const query = '';

    return db.query( query, [ fromUserId, toUserId ] )

        .then( result => Object.assign( result.rows[ 0 ], { success: true } ) )

        .catch( err => console.error( err.stack ) );
};
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// CHAT RELATED METHODS:________________________________________________________
module.exports.readAllPublicMessages = () => {
    console.log( 'dbQuery.js - fn: "readAllPublicMessages"\n' );
    const query = `SELECT   users.uid,
                            users."firstName",
                            users."lastName",
                            users."profilePic",
                            messages.mid,
                            messages."fromUserId",
                            messages."toAll",
                            messages."messageBody",
                            messages.timestamp
                    FROM messages
                    INNER JOIN users
                    ON users.uid = messages."fromUserId"
                    WHERE messages."toAll" = '1'
                    ORDER BY timestamp asc
                    LIMIT 10;`;

    return db.query( query )
        .then( results => {
            const s3mappedPublicMessages = results.rows.map( messageData => {
                if ( !messageData.profilePic ) {
                    const defProfilePic =
                        `def_profilePic_${(Math.floor(Math.random()*(12-1+1)+1))}.svg`;
                    messageData.profilePic = s3Url + 'def_profilePic/' + defProfilePic;
                } else {
                    messageData.profilePic = s3Url + messageData.profilePic;
                }
                return messageData;
            } );
            // console.log( 'dbQuery.js - fn: "readAllPublicMessage"\n - results:', s3mappedPublicMessages );
            return s3mappedPublicMessages;
        } )
        .catch( err => console.error( err.stack ) );
};
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




module.exports.readAllPrivateMessages = ( uid ) => {
    console.log( 'dbQuery.js - fn: "readAllPrivateMessages"\n' );
    const query = `SELECT   messages.mid,
                            users.uid,
                            users."firstName",
                            users."lastName",
                            users."profilePic",
                            messages."fromUserId",
                            messages."toUserId",
                            messages."toAll",
                            messages."messageBody",
                            messages.timestamp,
                            messages.read
                    FROM messages
                    JOIN users
                    ON (users.uid = messages."fromUserId")
                    WHERE messages."toAll" = '0' AND messages."fromUserId" = $1 OR messages."toUserId" = $1
                    ORDER BY timestamp asc;`;

    return db.query( query, [ uid ] )
        .then( results => {
            const s3mappedPrivateMessages = results.rows.map( messageData => {
                if ( !messageData.profilePic ) {
                    const defProfilePic =
                        `def_profilePic_${(Math.floor(Math.random()*(12-1+1)+1))}.svg`;
                    messageData.profilePic = s3Url + 'def_profilePic/' + defProfilePic;
                } else {
                    messageData.profilePic = s3Url + messageData.profilePic;
                }
                return messageData;
            } );
            // console.log( 'dbQuery.js - fn: "readAllPrivateMessages"\n - results:', s3mappedPrivateMessages );
            return s3mappedPrivateMessages;
        } )
        .catch( err => console.error( err.stack ) );
};
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




module.exports.createPublicMessage = ( uid, messageBody ) => {
    console.log( 'dbQuery.js - fn: "createPublicMessage"\n' );
    const query = `INSERT INTO messages
                    ("fromUserId", "messageBody", "toAll")
                    VALUES ($1, $2, '1')
                    RETURNING   mid;`;

    return db.query( query, [ uid, messageBody ] )
        .then( results => {
            const mid = results.rows[ 0 ].mid;
            const query = ` SELECT  users.uid,
                                    users."firstName",
                                    users."lastName",
                                    users."profilePic",
                                    messages.mId,
                                    messages."fromUserId",
                                    messages."toAll",
                                    messages."messageBody",
                                    messages.timestamp
                            FROM messages
                            INNER JOIN users
                            ON users.uid = messages."fromUserId"
                            WHERE messages."toAll" = '1' AND messages.mid = $1
                            LIMIT 1;`;
            return db.query( query, [ mid ] )
                .then( results => {
                    if ( !results.rows[ 0 ].profilePic ) {
                        const defProfilePic =
                            `def_profilePic_${(Math.floor(Math.random()*(12-1+1)+1))}.svg`;
                        results.rows[ 0 ].profilePic = s3Url + 'def_profilePic/' + defProfilePic;
                    } else {
                        results.rows[ 0 ].profilePic = s3Url + results.rows[ 0 ].profilePic;
                    }
                    // console.log( 'dbQuery.js - fn: "createPublicMessage"\n - result:',results.rows[ 0 ] );
                    return results.rows[ 0 ];
                } );
        } )
        .catch( err => console.error( err.stack ) );
};
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




module.exports.createPrivateMessage = ( fromUserId, toUserId, messageBody ) => {
    console.log( 'dbQuery.js - fn: "createPrivateMessage"\n' );
    const query = `INSERT INTO messages
                    ("fromUserId", "toUserId", "messageBody", "toAll")
                    VALUES ($1, $2, $3, '0')
                    RETURNING   mid;`;

    return db.query( query, [ fromUserId, toUserId, messageBody ] )

        .then( results => {
            const mid = results.rows[ 0 ].mid;
            const query = `SELECT   users.uid,
                                    users."firstName",
                                    users."lastName",
                                    users."profilePic",
                                    messages.mid,
                                    messages."fromUserId",
                                    messages."toUserId",
                                    messages."toAll",
                                    messages."messageBody",
                                    messages.timestamp,
                                    messages.read
                            FROM messages
                            JOIN users
                            ON (users.uid = messages."fromUserId")
                            WHERE messages."toAll" = '0' AND messages.mid = $1;`;
            return db.query( query, [ mid ] )

                .then( results => {
                    if ( !results.rows[ 0 ].profilePic ) {
                        const defProfilePic =
                            `def_profilePic_${(Math.floor(Math.random()*(12-1+1)+1))}.svg`;
                        results.rows[ 0 ].profilePic = s3Url + 'def_profilePic/' + defProfilePic;
                    } else {
                        results.rows[ 0 ].profilePic = s3Url + results.rows[ 0 ].profilePic;
                    }
                    console.log( 'dbQuery.js - fn: "createPrivateMessage"\n - result:', results.rows[ 0 ] );
                    return results.rows[ 0 ];
                } );
        } )

        .catch( err => console.error( err.stack ) );
};
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
