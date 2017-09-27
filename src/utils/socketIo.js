// SOCKETio.js
import * as io from 'socket.io-client';
import { store } from '../shell';
import {
    connectUser,
    createOnlineUsers,
    createOnlinePeers,
    addOnlineUser,
    addOnlinePeer,
    removeOnlineUser,
    createPublicMessageList,
    createPrivateMessageList,
    addNewPublicMessage,
    addNewPrivateMessage
} from '../actions/actions';

let socket;

const getSocket = () => {
    if ( !socket ) {
        socket = io.connect();


        socket.on( 'connect', () => {
            console.log( `Socket.io Event: connect - socketId: ${socket.id}` );
            store.dispatch( connectUser( socket.id ) );
        } );


        socket.on( 'onlineUsers', ( onlineUsers ) => {
            console.log( 'Socket.io Event: onlineUsers', onlineUsers );
            store.dispatch( createOnlineUsers( onlineUsers ) );
        } );


        socket.on( 'onlinePeers', ( onlinePeers ) => {
            console.log( 'Socket.io Event: onlinePeers', onlinePeers );
            store.dispatch( createOnlinePeers( onlinePeers ) );
        } );


        socket.on( 'userJoined', ( userJoined ) => {
            console.log( 'Socket.io Event: userJoined', userJoined );
            store.dispatch( addOnlineUser( userJoined ) );
        } );


        socket.on( 'peerJoined', ( peerJoined ) => {
            console.log( 'Socket.io Event: peerJoined', peerJoined );
            store.dispatch( addOnlinePeer( peerJoined ) );
        } );


        socket.on( 'userLeft', ( uid ) => {
            console.log( 'Socket.io Event: userLeft', uid );
            store.dispatch( removeOnlineUser( uid ) );
        } );


        socket.on( 'publicChatMessages', ( publicMessageList ) => {
            console.log( 'Socket.io Event: publicChatMessages', publicMessageList );
            store.dispatch( createPublicMessageList( publicMessageList ) );
        } );


        socket.on( 'privateChatMessages', privateMessageList => {
            console.log( 'Socket.io Event: privateChatMessages', privateMessageList );
            store.dispatch( createPrivateMessageList( privateMessageList ) );
        } );


        socket.on( 'chatMessage', ( newPublicMessage ) => {
            console.log( 'Socket.io Event: chatMessage' );
            store.dispatch( addNewPublicMessage( newPublicMessage ) );
        } );

        socket.on( 'privateChatMessage', ( newPrivateMessage ) => {
            console.log( 'Socket.io Event: privateChatMessage' );
            store.dispatch( addNewPrivateMessage( newPrivateMessage ) );
        } );

    }
    return socket;
};

export default getSocket;
