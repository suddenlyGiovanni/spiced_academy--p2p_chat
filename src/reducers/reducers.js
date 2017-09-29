export default ( state = {}, action ) => {
    console.log( 'REDUX - REDUCER - Action: ', action );

    switch ( action.type ) {

    case 'LOAD_USER_DATA':
        state = Object.assign( {}, state, { user: action.user } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'UPDATE_USER_DATA':
        {
            const updateUser = { ...state.user, ...action.user };
            state = Object.assign( {}, state, { user: updateUser } );
            break;
        }
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'ADD_PEERID_TO_USER_DATA':
        {
            const updateUser = { ...state.user, peerId: action.peerId };
            state = Object.assign( {}, state, { user: updateUser } );
            break;
        }
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




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
                        let onlineUser = { ...user, ...latestUser };
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
                } );
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
        // save the up to date data to the array of users

        if ( !state.users ) {
            // add the friends to the users directly
            state = Object.assign( {}, state, { users: action.friends } );
        } else {
            action.friends.map( friend => {
                const matchUser = state.users.find( user => user.uid === friend.uid );
                // matchUser return either UNDEFINED || copy of the OBJ
                if ( !matchUser ) {
                    // then insert the new friend into the array of users
                    const newUsers = state.users.slice();
                    newUsers.splice( ( newUsers.length ), 0, friend );
                    state = Object.assign( {}, state, { users: newUsers } );
                } else {
                    const newUsers = state.users.map( user => {
                        if ( user.uid !== friend.uid ) {
                            // this isn't the user i care about
                            return user;
                        }
                        return { ...user, ...friend };
                    } );
                    state = Object.assign( {}, state, { users: newUsers } );
                }
            } );
        }
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    case 'REQUEST_FRIENDSHIP':
    {
        const { newFriendshipStatus } = action;
        const matchUser = state.users.find( user => user.uid === newFriendshipStatus.toUserId );
        if ( matchUser ) {
            // update the user and it's data in the array
            const newUsers = state.users.map( user => {
                if ( user.uid !== newFriendshipStatus.toUserId ) {
                    // then this isn't the user i care about
                    return user;
                }
                return { ...user, status: newFriendshipStatus.status };
            } );
            state = Object.assign( {}, state, { users: newUsers } );
        }
        break;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



    case 'UPDATE_FRIENDSHIP':
        {
            const { newFriendshipStatus } = action;
            const matchUser = state.users.find( user => user.uid === newFriendshipStatus.toUserId );
            if ( matchUser ) {
                // update the user and it's data in the array
                const newUsers = state.users.map( user => {
                    if ( user.uid !== newFriendshipStatus.toUserId ) {
                        // then this isn't the user i care about
                        return user;
                    }
                    return { ...user, status: newFriendshipStatus.status };
                } );
                state = Object.assign( {}, state, { users: newUsers } );
            }
            break;
        }
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'CREATE_ONLINE_USERS':
        {
            // state = Object.assign( {}, state, { onlineUsers: action.onlineUsers } );
            //...
            const newOnlineUsers = action.onlineUsers.map( user => {
                return { ...user, online: true };
            } );
            if ( !state.users ) {
                state = Object.assign( {}, state, { users: newOnlineUsers } );
            } else {
                newOnlineUsers.map( onlineUser => {
                    const matchUser = state.users.find( user => user.uid === onlineUser.uid );
                    // matchUser return either UNDEFINED || copy of the OBJ
                    if ( !matchUser ) {
                        // then insert the new onlineUser into the array of users
                        const newUsers = state.users.slice();
                        newUsers.splice( ( newUsers.length ), 0, onlineUser );
                        state = Object.assign( {}, state, { users: newUsers } );
                    } else {
                        // update the user and it's data in the array
                        const newUsers = state.users.map( user => {
                            if ( user.uid !== onlineUser.uid ) {
                                // this isn't the user i care about
                                return user;
                            }
                            return Object.assign( {}, user, {
                                profilePic: onlineUser.profilePic,
                                online: onlineUser.online
                            } );
                        } );
                        state = Object.assign( {}, state, { users: newUsers } );
                    }
                } );
            }
            break;
        }
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'CREATE_ONLINE_PEERS':
        if ( !state.users ) {
            state = Object.assign( {}, state, { users: action.onlinePeers } );
        } else {
            action.onlinePeers.map( onlinePeer => {
                const matchUser = state.users.find( user => user.uid === onlinePeer.uid );
                if ( !matchUser ) {
                    // then insert the new onlinePeer into the array of users
                    const newUsers = state.users.slice();
                    newUsers.splice( ( newUsers.length ), 0, onlinePeer );
                    state = Object.assign( {}, state, { users: newUsers } );
                } else {
                    // update the user and it's data in the array
                    const newUsers = state.users.map( user => {
                        if ( user.uid !== onlinePeer.uid ) {
                            // this isn't the user i care about
                            return user;
                        }
                        return { ...user, ...onlinePeer };
                    } );
                    state = Object.assign( {}, state, { users: newUsers } );
                }
            } );
        }
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'ADD_ONLINE_USER':
        {
            const { userJoined } = action;
            const matchingUser = state.users.find( user => user.uid === userJoined.uid );
            if ( !matchingUser ) {
                // then insert the new action.userJoined into the array of onlineUsers
                const newUsers = state.users.slice();
                newUsers.splice( ( newUsers.length ), 0, userJoined );
                state = Object.assign( {}, state, { users: newUsers } );
            } else {
                // update the user and it's data in the array
                const newUsers = state.users.map( user => {
                    if ( user.uid !== userJoined.uid ) {
                        // then this isn't the user i care about
                        return user;
                    }
                    return { ...user, ...userJoined };
                } );
                state = Object.assign( {}, state, { users: newUsers } );
            }
            break;
        }
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'ADD_ONLINE_PEER':
        {
            const { peerJoined } = action;
            const matchUser = state.users.find( user => user.uid === peerJoined.uid );
            if ( !matchUser ) {
                // then insert the new action.peerJoined into the array of users
                const newUsers = state.users.slice();
                newUsers.splice( ( newUsers.length ), 0, peerJoined );
                state = Object.assign( {}, state, { users: newUsers } );
            } else {
                // update the user and it's data in the array
                const newUsers = state.users.map( user => {
                    if ( user.uid !== peerJoined.uid ) {
                        // then this isn't the user i care about
                        return user;
                    }
                    return { ...user, ...peerJoined };
                } );
                state = Object.assign( {}, state, { users: newUsers } );
            }
            break;
        }





    case 'REMOVE_ONLINE_USER':
        {
            console.log( 'inside:  REMOVE_ONLINE_USER, action :', action );
            const newUsers = state.users.map( user => {
                if ( user.uid == action.uid ) {
                    return { ...user, online: false, peerId: null };
                } else {
                    return user;
                }
            } );
            state = Object.assign( {}, state, { users: newUsers } );
            break;
        }
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'CREATE_PUBLIC_MESSAGE_LIST':
        state = Object.assign( {}, state, { publicMessages: action.publicMessageList } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'CREATE_PRIVATE_MESSAGE_LIST':
        action.privateMessageList.map( privateMessage => {
            let otherUserId;
            if ( state.user.uid === privateMessage.fromUserId ) {
                otherUserId = privateMessage.toUserId;
            } else {
                otherUserId = privateMessage.fromUserId;
            }
            const matchUser = state.users.find( user => user.uid == otherUserId );
            // matchUser return either UNDEFINED || copy of the OBJ

            // create the privateMessage OBJ:
            const newPrivateMessage = {
                mid: privateMessage.mid,
                sender: ( otherUserId === privateMessage.fromUserId ) ? true : false,
                msg: privateMessage.messageBody,
                timestamp: privateMessage.timestamp
            };

            if ( !matchUser ) {
                // then create the newUser
                const newUser = {
                    uid: otherUserId,
                    privateMessages: [ newPrivateMessage ]
                };
                // then insert the new newUser into the array of users
                const newUsers = state.users.slice();
                newUsers.splice( ( newUsers.length ), 0, newUser );
                state = Object.assign( {}, state, { users: newUsers } );
            } else {
                // update the user and it's data in the array
                const newUsers = state.users.map( user => {
                    if ( user.uid !== otherUserId ) {
                        // this isn't the user i care about
                        return user;
                    } else {
                        // this is the user i care...
                        // time to check if it has any privateMessages
                        if ( !user.hasOwnProperty( 'privateMessages' ) ) {
                            // then just add the first privateMessage...
                            let updatedUser = { ...user };
                            updatedUser.privateMessages = [ newPrivateMessage ];
                            return updatedUser;
                        } else {
                            // now the logic for IF the user has already privateMessages;
                            const arrToInsert = [ newPrivateMessage ];
                            const newPrivateMessages = [ ...user.privateMessages, ...arrToInsert ];
                            return { ...user, privateMessages: newPrivateMessages };
                        }
                    }
                } );
                state = Object.assign( {}, state, { users: newUsers } );
            }
        } );

        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'ADD_NEW_PUBLIC_MESSAGE':
        var newPublicMessagesList = state.publicMessages.slice();
        newPublicMessagesList.splice( ( newPublicMessagesList.length ), 0, action.newPublicMessage );
        state = Object.assign( {}, state, { publicMessages: newPublicMessagesList } );
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




    case 'ADD_NEW_PRIVATE_MESSAGE':
        {
            const message = action.newPrivateMessage;
            let otherUserId;
            if ( state.user.uid === message.fromUserId ) {
                otherUserId = message.toUserId;
            } else {
                otherUserId = message.fromUserId;
            }

            const matchUser = state.users.find( user => user.uid == otherUserId );
            // matchUser return either UNDEFINED || copy of the OBJ

            // create the privateMessage OBJ:
            const newPrivateMessage = {
                mid: message.mid,
                sender: ( otherUserId === message.fromUserId ) ? true : false,
                msg: message.messageBody,
                timestamp: message.timestamp
            };

            if ( !matchUser ) {
                // then create the newUser
                const newUser = {
                    uid: otherUserId,
                    privateMessages: [ newPrivateMessage ]
                };
                // then insert the new newUser into the array of users
                const newUsers = state.users.slice();
                newUsers.splice( ( newUsers.length ), 0, newUser );
                state = Object.assign( {}, state, { users: newUsers } );
            } else {
                // update the user and it's data in the array
                const newUsers = state.users.map( user => {
                    if ( user.uid !== otherUserId ) {
                        // this isn't the user i care about
                        return user;
                    } else {
                        // this is the user i care...
                        // time to check if it has any privateMessages
                        if ( !user.hasOwnProperty( 'privateMessages' ) ) {
                            // then just add the first privateMessage...
                            let updatedUser = { ...user };
                            updatedUser.privateMessages = [ newPrivateMessage ];
                            return updatedUser;
                        } else {
                            // now the logic for IF the user has already privateMessages;
                            const arrToInsert = [ newPrivateMessage ];
                            const newPrivateMessages = [ ...user.privateMessages, ...arrToInsert ];
                            return { ...user, privateMessages: newPrivateMessages };
                        }
                    }
                } );
                state = Object.assign( {}, state, { users: newUsers } );
            }
            break;
        }
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
