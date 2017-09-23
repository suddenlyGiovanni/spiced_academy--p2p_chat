import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ProfilePicOther from '../components/profilePicOther';

class ChatListContainer extends Component {
    constructor( props ) {
        super( props );
    }

    render() {
        console.log( 'ChatListContainer - RENDER - this.props: ', this.props );
        /*
        let privateChatList = [
            {
                chatName: otherUserName,
                chatUrl: otherUid
            }
        ]
        */
        let privateChatList = [];

        const { privateMessages, currentUser } = this.props;

        if (privateMessages) {
            privateMessages.map( message => {
                const { uid, fromUserId, toUserId, firstName, lastName, profilePic, } = message;

                if ( message.fromUserId === currentUser.uid ) {
                    // this mean that the mess was sent by the logged in user
                    // no name and imgpic at disposal
                    if ( !privateChatList.some( el => el.privateChatId === toUserId ) ) {
                        privateChatList.push( {
                            privateChatId: toUserId
                        } );
                    }
                } else if ( message.toUserId === currentUser.uid ) {
                    // this mean that the mess was sent by somebody else
                    // we have at disposal then name and pic
                    if ( !privateChatList.some( el => el.privateChatId === fromUserId ) ) {
                        privateChatList.push( {
                            privateChatId: fromUserId,
                            privateChatName: `${firstName} ${lastName}`,
                            privateChatPic: profilePic
                        } );
                    } else {
                        const objIndex = privateChatList.findIndex( ( obj => obj.privateChatId == fromUserId ) );
                        privateChatList[ objIndex ].privateChatName = `${firstName} ${lastName}`;
                        privateChatList[ objIndex ].privateChatPic = profilePic;
                    }
                }

            } );
        }

        console.log('privateChatList', privateChatList);

        const privateChatRooms = privateChatList && privateChatList.map( ( room ) => {
            const { privateChatId, privateChatName, privateChatPic } = room;

            return (
                <li key={privateChatId}>
                    <ProfilePicOther
                        src={privateChatPic}
                        alt={privateChatName}
                        uid={privateChatId}
                        chat={true}/>
                    <Link to={`/chat/private/${privateChatId}`}>
                        <h3>{privateChatName}</h3>
                    </Link>
                </li>
            );
        } );

        return (
            <div>
                ChatListContainer.js
                <ul>
                    <li>
                        <Link to='/chat/public'>PUBLIC CHAT</Link>
                    </li>
                    {privateChatRooms && privateChatRooms}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = ( state ) => {
    console.log( 'ChatListContainer - fn: mapStateToProps' );
    return {
        currentUser: state.user,
        publicMessages: state.publicMessages && state.publicMessages,
        privateMessages: state.privateMessages && state.privateMessages,
    };
};

export default connect( mapStateToProps )( ChatListContainer );
