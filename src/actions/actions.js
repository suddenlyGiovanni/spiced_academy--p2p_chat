import axios from '../utils/axios';




export function logOutUser() {
    console.log( 'REDUX - ACTION - fn: logOutUser' );
    return axios.get( '/api/logout' )

        .then( result => {
            console.log( 'REDUX - ACTION - fn: logOutUser - data', result.data );
            if ( result.data.success ) {
                window.location.href = '/';
            }
        } )

        .catch( err => console.log( err ) );
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


export function loadUserData() {
    console.log( 'REDUX - ACTION - fn: loadUserData' );
    return axios.get( '/api/user' )
        .then( result => {
            console.log( 'REDUX - ACTION - fn: loadUserData - data', result.data );
            return {
                type: 'LOAD_USER_DATA',
                user: result.data.userData
            };

        } )

        .catch( err => {
            console.log( err );
            return { type: 'ERROR' };
        } );
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


export function updateProfilePic( formData ) {
    console.log( 'REDUX - ACTION - fn: updateProfilePic' );
    return axios.put( '/api/user/profile_pic', formData )

        .then( result => {
            if ( result.data.success ) {
                return {
                    type: 'UPDATE_USER_DATA',
                    user: result.data.userData
                };
            }
        } )

        .catch( err => console.log( err ) );

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


export function loadLatestUsers() {
    console.log( 'REDUX - ACTION - fn: loadLatestUsers' );
    return axios.get( '/api/users' )

        .then( result => {
            console.log( 'REDUX - ACTION - fn: loadLatestUsers - data', result.data );
            return {
                type: 'LOAD_LATEST_USERS',
                users: result.data.users
            };
        } )

        .catch( err => console.log( err ) );
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function loadSearchedUsers( search ) {
    console.log( 'REDUX - ACTION - fn: loadSearchedUsers', search );
    // TODO: switch to socketio at some point

    return axios.post( '/api/users/search', { search } )
        .then( results => {
            console.log( 'REDUX - ACTION - fn: loadSearchedUsers - data', results.data.users );
            return {
                type: 'LOAD_SEARCHED_USERS',
                users: results.data.users
            };
        } )

        .catch( err => console.log( err ) );
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function clearSearchedUsers() {
    console.log( 'REDUX - ACTION - fn: clearSearchedUsers' );
    return { type: 'CLEAR_SEARCHED_USERS' };
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function loadFriends() {
    console.log( 'REDUX - ACTION - fn: loadFriends' );

    return axios.get( '/api/friends' )

        .then( result => {
            console.log( 'REDUX - ACTION - fn: loadFriends - data', result.data.friends );
            return {
                type: 'LOAD_FRIENDS',
                friends: result.data.friends
            };
        } )

        .catch( err => {
            console.log( err );
            return { type: 'ERROR' };
        } );
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



export function requestFriendship( fromUserId, toUserId, status ) {

    console.log( `REDUX - ACTION - fn: requestFriendship
        fromUserId: ${fromUserId},
        toUserId: ${toUserId},
        status: ${status}` );

    return axios.post( `/api/friends/${fromUserId}/${toUserId}/new`, { status: status } )

        .then( result => {
            console.log( 'REDUX - ACTION - fn: requestFriendship - data', result.data );
            return {
                type: 'REQUEST_FRIENDSHIP',
                newFriendshipStatus: result.data.newFriendshipStatus
            };
        } )

        .catch( err => {
            console.log( err );
            return { type: 'ERROR' };
        } );
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function updateFriendship( fromUserId, toUserId, status ) {

    console.log( `REDUX - ACTION - fn: updateFriendship
        fromUserId: ${fromUserId},
        toUserId: ${toUserId},
        status: ${status}` );

    return axios.put( `/api/friends/${fromUserId}/${toUserId}`, { status: status } )

        .then( result => {
            console.log( 'REDUX - ACTION - fn: updateFriendship - data', result.data );
            return {
                type: 'UPDATE_FRIENDSHIP',
                newFriendshipStatus: result.data.newFriendshipStatus
            };
        } )

        .catch( err => {
            console.log( err );
            return { type: 'ERROR' };
        } );
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function connectUser( socketId ) {
    console.log( 'REDUX - ACTION - fn: connectUser' );
    return axios.post( `/ws/connected/${socketId}` )

        .then( () => { return { type: 'CONNECT_USER' }; } )

        .catch( err => console.log( err ) );
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function sendPeerIdToServer( peerId ) {
    console.log( 'REDUX - ACTION - fn: sendPeerIdToServer' );
    return axios.post( `/ws/storeIdToServer/${peerId}` )
        .then( () => {
            return { type: 'ADD_PEERID_TO_USER_DATA', peerId };
        } )
        .catch( err => console.log( err ) );
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function createOnlineUsers( onlineUsers ) {
    console.log( 'REDUX - ACTION - fn: createOnlineUsers' );
    return {
        type: 'CREATE_ONLINE_USERS',
        onlineUsers
    };
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function createOnlinePeers( onlinePeers ) {
    console.log( 'REDUX - ACTION - fn: createOnlinePeers' );
    return {
        type: 'CREATE_ONLINE_PEERS',
        onlinePeers
    };
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function addOnlineUser( userJoined ) {
    console.log( 'REDUX - ACTION - fn: addOnlineUser' );
    return {
        type: 'ADD_ONLINE_USER',
        userJoined
    };
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function addOnlinePeer( peerJoined ) {
    console.log( 'REDUX - ACTION - fn: addOnlinePeer' );
    return {
        type: 'ADD_ONLINE_PEER',
        peerJoined
    };
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function removeOnlineUser( uid ) {
    console.log( 'REDUX - ACTION - fn: removeOnlineUser - uid:', uid );
    return {
        type: 'REMOVE_ONLINE_USER',
        uid
    };
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function createPublicMessageList( publicMessageList ) {
    console.log( 'REDUX - ACTION - fn: createPublicMessageList' );
    return {
        type: 'CREATE_PUBLIC_MESSAGE_LIST',
        publicMessageList
    };
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function createPrivateMessageList( privateMessageList ) {
    console.log( 'REDUX - ACTION - fn: createPrivateMessageList' );
    return {
        type: 'CREATE_PRIVATE_MESSAGE_LIST',
        privateMessageList
    };
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function addNewPublicMessage( newPublicMessage ) {
    console.log( 'REDUX - ACTION - fn: addNewPublicMessage' );
    return {
        type: 'ADD_NEW_PUBLIC_MESSAGE',
        newPublicMessage
    };
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function addNewPrivateMessage( newPrivateMessage ) {
    console.log( 'REDUX - ACTION - fn: addNewPrivateMessage', newPrivateMessage );
    return {
        type: 'ADD_NEW_PRIVATE_MESSAGE',
        newPrivateMessage
    };
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




export function persistOtherUid( otherUid ) {
    console.log( 'REDUX - ACTION - fn: persistOtherUid' );
    return {
        type: 'PERSIST_OTHER_UID',
        otherUid
    };
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
