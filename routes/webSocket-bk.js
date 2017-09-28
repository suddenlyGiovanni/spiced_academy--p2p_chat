// ROUTE: --> /ws/
const router = require( 'express' ).Router(),
    db = require( '../modules/dbQuery' ),
    io = require( '../index' ).io;


// SOCKET.IO WS:
// define constructor function that gets `io` send to it
// function( io ) {
// };
io.on( 'connection',  socket => {
    console.log( `socket with the id ${socket.id} is now connected` );

    socket.on( 'disconnect', () => {
        console.log( `SocketIo - on: "disconnect" - socket with the id ${socket.id} is now disconnected` );
        // remove here the disconnected socket from the list of online users:
        /*
        it is possible for a single user to appear in the list more than once.
        it is important to only remove the item from the list that has the
        matching socket id when 'disconnect' event occurs
        */
        const disconnectedUserSocket = onlineUsers.find( user => user.socketId == socket.id );
        // console.log( 'disconnectedUserSocket: ', disconnectedUserSocket );

        onlineUsers.splice( onlineUsers.indexOf( disconnectedUserSocket ), 1 );
        // console.log( 'onlineUsers - after removing disconnectedUserSocket: ', onlineUsers );
        /*
        When a user disconnects, after removing the user with the id of the
        socket that disconnected from the list, you should determine if that
        user is no longer in your list at all. If the user is gone, the server
        should send a message to all connected clients with the id of the
        disconnected user in the payload so that they can update their lists of
        online users accordingly. Let's call this event 'userLeft'.
        */
        const disconnectedUserId = onlineUsers.filter( user => {
            // remember that filter return an array
            return user.userId == disconnectedUserSocket.userId;
        } );
        // console.log( 'disconnectedUserId: ', disconnectedUserId );

        if ( disconnectedUserId.length === 0 ) {
            const userId = disconnectedUserSocket.userId;
            console.log(`last user with id ${userId} has gone offline`);
            io.sockets.emit( 'userLeft', userId );
        }

    } );

    socket.on( 'chatMessage', ( messageBody ) => {
        const messengerId = onlineUsers.find( user => user.socketId == socket.id ).userId;
        console.log( `SocketIo - on: "chatMessage" - messengerId: ${messengerId} - payload:`, messageBody );
        /*  When the server receives this event, it should broadcast
        a 'chatMessage' event to all of the connected sockets.
        The payload for this event should include the message the user sent
        as well as the user's id, first name, last name, and profile pic.*/
        return db.createPublicMessage( messengerId, messageBody )
            .then( newPublicMessage => io.sockets.emit( 'chatMessage', newPublicMessage ) )
            .catch( err => console.error( err.stack ) );
    } );


    socket.on( 'chatMessagePrivate', privateMessage => {
        const fromUserId = onlineUsers.find( user => user.socketId == socket.id ).userId;
        const { toUserId, messageBody } = privateMessage;

        const toUserIdOnline = onlineUsers.find( user => user.userId == toUserId );

        const fromUserSocketId = socket.id;
        const toUserSocketId = toUserIdOnline && toUserIdOnline.socketId;

        console.log( `SocketIo - on: "chatMessagePrivate"
        - fromUserId: ${fromUserId} - toUserId: ${toUserId}
        - payload:`, privateMessage );
        return db.createPrivateMessage( fromUserId, toUserId, messageBody )

            .then( newPrivateMessage => {
                console.log( 'emitting private messaging - fromUserSocketId', fromUserSocketId );
                io.sockets.sockets[ fromUserSocketId ].emit( 'privateChatMessage', newPrivateMessage );
                toUserSocketId && io.sockets.sockets[ toUserSocketId ].emit( 'privateChatMessage', newPrivateMessage );
            } )

            .catch( err => console.error( err.stack ) );
    } );

} );
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function makeSureUserIsLoggedIn( req, res, next ) {
    console.log( 'webSocket.js - fn: makeSureUserIsLoggedIn' );
    next();
}


let onlineUsers = [];
let mapUsersIdToPeerId = [];
/* exemple...
onlineUsers = [
    {
        socketId: 'wJdwDQAKhUuXxZ2vAAAA',
        userId: 1
    }
];

mapUsersIdToPeerId = [
    {
        peerId: 'lololololllolloo',
        userId: 1
    }
]
*/

// SOCKET.IO ROUTES
/*  make a route that the client can hit after the socket connects.
    The /ws/connected/:socketId route can then read the user's id from
    the session and the socket id from req.params */
router.post( '/connected/:socketId', makeSureUserIsLoggedIn, ( req, res ) => {
    const uid = req.session.user.uid;
    const socketId = req.params.socketId;

    const socketAlreadyThere = onlineUsers.find( user => user.socketId == socketId );
    const userAlreadyThere = onlineUsers.find( user => user.userId == uid );

    console.log( `API: method: POST /ws/connected/:${socketId} - uid: ${uid} -
        onlineUsers: `, onlineUsers, '\n' );

    if ( !socketAlreadyThere && io.sockets.sockets[ socketId ] ) {
        /*  Every time a logged in user makes a request, push
        an object representing that user to an array after confirming that
        that user is not already in the list */
        onlineUsers.push( { userId: uid, socketId } );

        /*  When a user is added to the list of online users, the server should
        send a message to that user with the list of all online users
        as the payload: event 'onlineUsers' */
        return db.readAllUsersByIds( onlineUsers.map( user => user.userId ) )

            .then( onlineUsers => io.sockets.sockets[ socketId ].emit( 'onlineUsers', onlineUsers ) )

            .then( () => {
                return db.readAllPublicMessages()
                    .then( publicMessageList => io.sockets.sockets[ socketId ].emit( 'publicChatMessages', publicMessageList ) );
            } )

            .then( () => {
                return db.readAllPrivateMessages( uid )
                    .then( privateMessageList => io.sockets.sockets[ socketId ].emit( 'privateChatMessages', privateMessageList ) );
            } )

            .then( () => {
                res.json( { success: true } );
                /*  Also when a user is added to the list of online users,
                the server should send a message to all online users with information
                about the user who just came online as the payload, allowing all clients
                to keep their list of online users updated: event 'userJoined' */
                if ( !userAlreadyThere ) {
                    return db.readUser( uid )
                        .then( userJoined => {
                            // FIXME: this should not be done here!!!!!
                            userJoined.online = true;
                            return io.sockets.emit( 'userJoined', userJoined );
                        } );
                }
            } )

            .catch( err => console.log( err ) );
    }
} );
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// PEER.JS ROUTES
/*  make a route that the client can hit after the socket connects.
    The /ws/storeIdToServer/:peerId route can then read the user's id from
    the session and the socket id from req.params
*/
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.post( '/storeIdToServer/:peerId', makeSureUserIsLoggedIn, ( req, res ) => {
    const uid = req.session.user.uid;
    const peerId = req.params.peerId;

    // FIXME: eventually in the future send the peerId info to just the clients of the the user's friend

    const peerAlreadyThere = mapUsersIdToPeerId.find( user => user.peerId == peerId );
    const userAlreadyThere = mapUsersIdToPeerId.find( user => user.userId == uid );

    console.log( `API: method: POST /ws/storeIdToServer/:${peerId} - uid: ${uid} -
            onlineUsers: `, onlineUsers, '\n' );

    if ( !peerAlreadyThere ) {
        /*  Every time a logged in user makes a request, push
        an object representing that user to an array after confirming that
        that user is not already in the list */
        mapUsersIdToPeerId.push( { userId: uid, peerId } );

        /*  When a user is added to the list of mapUsersIdToPeerId, the server should
        send a message to that user with the list of all online users linked to their peerId
        as the payload: event 'onlineUsers' */
        return db.readAllUsersByIds( mapUsersIdToPeerId.map( user => user.userId ) )

            .then( onlinePeers => {
                // find the socket that belongs to the user
                const socketId = onlineUsers.find( user => user.userId == uid ).socketId;
                // set update the user list with their respecting peerId
                const updatedUsers = onlinePeers.map( user => {
                    const peerIdToAdd = mapUsersIdToPeerId.find( peer => peer.userId === user.uid ).peerId;
                    return { ...user, peerId: peerIdToAdd };
                } );
                return io.sockets.sockets[ socketId ].emit( 'onlinePeers', updatedUsers );
            } )

            .then( () => {
                res.json( { success: true } );
                /*  Also when a user is added to the list of online users,
                the server should send a message to all online users with information
                about the user who just came online as the payload, allowing all clients
                to keep their list of online users updated: event 'userJoined' */
                if ( !userAlreadyThere ) {
                    return db.readUser( uid )
                        .then( userData => {
                            // FIXME: this should not be done here!!!!!
                            // userData.peerId = peerId;
                            return io.sockets.emit( 'peerJoined', { ...userData, peerId: peerId } );
                        } );
                }
            } )

            .catch( err => console.log( err ) );
    }
} );


/* MODULE EXPORTS */
module.exports = router;
// module.exports.io = io;
