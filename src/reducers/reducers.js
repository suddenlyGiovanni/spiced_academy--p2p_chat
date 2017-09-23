export default ( state = {}, action ) => {
    console.log( 'REDUX - REDUCER - Action: ', action );
    /*
            state = {
                loggedInUser: {
                    uid: '1',
                    firstName: 'bat',
                    lastName: 'man',
                    mail: 'bat@man.com',
                    profilePic: 's3.lalala.jpg',
                    bio: 'bruce wayne bio'
                },
                onlineUsers: [
                    {
                        uid: '1',
                        firstName: 'bat',
                        lastName: 'man',
                    },
                    {
                        uid: '2',
                        firstName: 'super',
                        lastName: 'man',
                    },
                ],
                globalMessages: [
                    {
                        mid: '',
                        fromUserId: '',
                        firstName: '',
                        lastName: '',
                        profilePic: '',
                        toAll: '1',
                        messageBody: '',
                        timestamp: ''
                    }
                ],
                privateMessages: [
                    {
                        mid: '',
                        fromUserId: '',
                        toUserId: '',
                        firstName: '',
                        lastName: '',
                        profilePic: '',
                        toAll: '0',
                        messageBody: '',
                        timestamp: '',
                        read: false
                    }
                ]
            };
        */
    switch ( action.type ) {

    case 'STORE_LOGGEDIN_USER_DATA':
        state = Object.assign( {}, state, { user: action.user } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    case 'FETCH_FRIENDS':
        state = Object.assign( {}, state, { friends: action.friends } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    case 'UPDATE_FRIENDSHIP':
        state = Object.assign( {}, state, {
            friends: state.friends.map( friend => {
                if ( friend.uid == action.toUserId ) {
                    return Object.assign( {}, friend, {
                        status: action.status
                    } );
                } else {
                    return friend;
                }
            } )
        } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    case 'CONNECT_LOGGEDIN_USER':
        // state = Object.assign( {}, state);
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    case 'CREATE_ONLINE_USERS':
        state = Object.assign( {}, state, { onlineUsers: action.onlineUsers } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    case 'ADD_ONLINE_USER':
        // console.log( 'CASE: ADD_ONLINE_USER: ', '\n state:', state, '\n action: ', action );
        var onlineUser = state.onlineUsers.find( user => user.uid === action.userJoined.uid );
        // onlineUser return either UNDEFINED || copy of the OBJ
        if ( !onlineUser ) {
            // then insert the new action.userJoined into the array of onlineUsers
            let newOnlineUsers = state.onlineUsers.slice();
            newOnlineUsers.splice( ( newOnlineUsers.length ), 0, action.userJoined );
            state = Object.assign( {}, state, { onlineUsers: newOnlineUsers } );
        } else {
            // update the user and it's data in the array
            let newOnlineUsers = state.onlineUsers.map( user => {
                if ( user.uid !== action.userJoined.uid ) {
                    // this isn't the user i care about
                    return user;
                }
                return action.userJoined;
            } );
            state = Object.assign( {}, state, { onlineUsers: newOnlineUsers } );
        }
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    case 'REMOVE_ONLINE_USER':
        var actionIndex = state.onlineUsers.findIndex( user => user.uid === action.uid );
        var newOnlineUsers = state.onlineUsers.slice();
        newOnlineUsers.splice( actionIndex, 1 );
        state = Object.assign( {}, state, { onlineUsers: newOnlineUsers } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    case 'CREATE_PUBLIC_MESSAGE_LIST':
        state = Object.assign( {}, state, { publicMessages: action.publicMessageList } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    case 'CREATE_PRIVATE_MESSAGE_LIST':
        state = Object.assign( {}, state, { privateMessages: action.privateMessageList } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    case 'ADD_NEW_PUBLIC_MESSAGE':
        var newPublicMessagesList = state.publicMessages.slice();
        newPublicMessagesList.splice( ( newPublicMessagesList.length ), 0, action.newPublicMessage );
        state = Object.assign( {}, state, { publicMessages: newPublicMessagesList } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    case 'ADD_NEW_PRIVATE_MESSAGE':
        var newPrivateMessagesList = state.privateMessages.slice();
        newPrivateMessagesList.splice( ( newPrivateMessagesList.length ), 0, action.newPrivateMessage );
        state = Object.assign( {}, state, { privateMessages: newPrivateMessagesList } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    case 'PERSIST_OTHER_UID':
        state = Object.assign( {}, state, { otherUid: action.otherUid } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    }
    //--------------------------------------------------------------------------
    console.log( 'REDUX - REDUCER - State: ', state );
    return state;
};
