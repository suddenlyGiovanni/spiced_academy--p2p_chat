// SOCKETio.js
import * as io from 'socket.io-client';
import { store } from '../shell';
import {
    connectLoggedInUser,
    createOnlineUsers,
    addOnlineUser,
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
            store.dispatch( connectLoggedInUser( socket.id ) );
        } );


        socket.on( 'onlineUsers', ( onlineUsers ) => {
            console.log( 'Socket.io Event: onlineUsers', onlineUsers );
            store.dispatch( createOnlineUsers( onlineUsers ) );
        } );


        socket.on( 'userJoined', ( userJoined ) => {
            console.log( 'Socket.io Event: userJoined', userJoined );
            store.dispatch( addOnlineUser( userJoined ) );
        } );


        socket.on( 'userLeft', ( uid ) => {
            console.log( 'Socket.io Event: userLeft', uid );
            store.dispatch( removeOnlineUser( uid ) );
        } );


        socket.on( 'publicChatMessages', ( publicMessageList ) => {
            console.log( 'Socket.io Event: publicChatMessages', publicMessageList );
            store.dispatch( createPublicMessageList( publicMessageList ) );
        } );


        socket.on( 'privateChatMessages', ( privateMessageList ) => {
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
