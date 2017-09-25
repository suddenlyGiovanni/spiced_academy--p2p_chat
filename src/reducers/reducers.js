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

    case 'LOAD_USER_DATA':
        state = Object.assign( {}, state, { user: action.user } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'UPDATE_USER_DATA':
        state = Object.assign( {}, state, { user: action.user } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'LOAD_LATEST_USERS':
        // FIXME: this should not override current users.
        if ( !state.users ) {
            state = Object.assign( {}, state, { users: action.users } );
        }
        action.users.map( latestUser => {
            const matchUser = state.users.find( user => user.uid == latestUser.uid );
            // matchUser return either UNDEFINED || copy of the OBJ
            if ( !matchUser ) {
                // then insert the new latestUser into the array of users
                const newUsers = state.users.slice();
                newUsers.splice( ( newUsers.length ), 0, latestUser );
                state = Object.assign( {}, state, { users: newUsers } );
            } else {
                // update the user and it's data in the array
                const newUsers = state.users.map( user => {
                    if ( user.uid !== latestUser.uid ) {
                        // this isn't the user i care about
                        return user;
                    }
                    if ( !user.online ) {
                        return { ...user, ...latestUser };
                    } else {
                        let onlineUser = { ...user, ...latestUser }
                        onlineUser.online = true;
                        return onlineUser;
                    }
                } );
                state = Object.assign( {}, state, { users: newUsers } );
            }
        } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'LOAD_SEARCHED_USERS':
        // state = Object.assign( {}, state, { users: action.users } );
        // create new prop in the state of redux having just the results from the search
        state = Object.assign( {}, state, { searchedUsersList: action.users } );
        // save the up to date data to the array of users
        action.users.map( searchedUser => {
            let matchUser = state.users.find( user => user.uid === searchedUser.uid );
            // matchUser return either UNDEFINED || copy of the OBJ
            if ( !matchUser ) {
                // then insert the new searchedUser into the array of users
                let newUsers = state.users.slice();
                newUsers.splice( ( newUsers.length ), 0, searchedUser );
                state = Object.assign( {}, state, { users: newUsers } );
            } else {
                // update the user and it's data in the array
                let newUsers = state.users.map( user => {
                    if ( user.uid !== searchedUser.uid ) {
                        // this isn't the user i care about
                        return user;
                    }
                    return searchedUser;
                } )
                state = Object.assign( {}, state, { users: newUsers } );
            }
        } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'CLEAR_SEARCHED_USERS':
        state = Object.assign( {}, state, { searchedUsersList: null } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'LOAD_FRIENDS':
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




    case 'CREATE_ONLINE_USERS':
        // state = Object.assign( {}, state, { onlineUsers: action.onlineUsers } );
        //...
        if ( !state.users ) {
            state = Object.assign( {}, state, { users: action.onlineUsers } );
        } else {
            action.onlineUsers.map( onlineUser => {
                let matchUser = state.users.find( user => user.uid === onlineUser );
                // matchUser return either UNDEFINED || copy of the OBJ
                if ( !matchUser ) {
                    // then insert the new onlineUser into the array of users
                    let newUsers = state.users.slice();
                    newUsers.splice( ( newUsers.length ), 0, onlineUser );
                    state = Object.assign( {}, state, { users: newUsers } );
                } else {
                    // update the user and it's data in the array
                    let newUsers = state.users.map( user => {
                        if ( user.uid !== onlineUser.uid ) {
                            // this isn't the user i care about
                            return user;
                        }
                        return Object.assign( {}, user, {
                            profilePic: onlineUser.profilePic,
                            online: onlineUser.online
                        } );
                    } )
                    state = Object.assign( {}, state, { users: newUsers } );
                }
            } )
        }
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    case 'ADD_ONLINE_USER':
        const { userJoined } = action;
        let matchUser = state.users.find( user => user.uid === userJoined.uid );
        if ( !matchUser ) {
            // then insert the new action.userJoined into the array of onlineUsers
            let newUsers = state.users.slice();
            newUsers.splice( ( newUsers.length ), 0, userJoined );
            state = Object.assign( {}, state, { users: newUsers } );
        } else {
            // update the user and it's data in the array
            let newUsers = state.users.map( user => {
                if ( user.uid !== userJoined.uid ) {
                    // then this isn't the user i care about
                    return user;
                }

                return { ...user, ...userJoined };
            } )
            state = Object.assign( {}, state, { users: newUsers } );
        }
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'REMOVE_ONLINE_USER':
        const newUsers = state.users.map( user => {
            if ( user.uid != action.offlineUserId.uid ) {
                // then this isn't the user i care about
                console.log(`REMOVE_ONLINE_USER - ${action.offlineUserId}`);
                return user;
            } else {
                console.log('REMOVE_ONLINE_USER - user.uid === action.offlineUserId');

                const newUserState = { ...user };
                delete newUserState.online;
                console.log( 'newUserState', newUserState );
                return newUserState;
            }
        } );
        state = Object.assign( {}, state, { users: newUsers } );
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
