import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import OnlineFriendsContainer from './online-friends-container';
import ProfilePicOther from '../components/profilePicOther';

// MATERIAL-UI
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';


class ChatListContainer extends Component {
    constructor( props ) {
        super( props );
    }

    handleTouchConversation( uid ) {
        console.log( 'ChatListContainer - fn: handleTouchConversation' );
        browserHistory.push( `/chat/private/${uid}` );
    }

    handleTouchConversationGlobal() {
        console.log( 'ChatListContainer - fn: handleTouchConversationGlobal' );
        browserHistory.push( '/chat/public' );
    }

    render() {
        console.log( 'ChatListContainer - RENDER - this.props: ', this.props );
        const { privateConversation, user } = this.props;

        const privateConversations = privateConversation && privateConversation.map( conversation => {
            const { uid, firstName, lastName, profilePic } = conversation;
            const avatar = (
                <Link to={`/user/${uid}`}>
                    <Avatar src={profilePic} />
                </Link>
            );
            return (
                <div>
                    <ListItem
                        primaryText={`${firstName} ${lastName}`}
                        leftAvatar={avatar}
                        onClick={ () => this.handleTouchConversation(uid) }
                    />
                    <Divider inset={true} />
                </div>
            );
        } )

        return (
            <div>
                <OnlineFriendsContainer />
                ChatListContainer.js
                <List>
                    <Subheader>Global chat</Subheader>
                    <ListItem
                        primaryText='Public Chat Room'
                        onClick={ () => this.handleTouchConversationGlobal() }
                    />
                    <Divider inset={true} />
                    <Subheader>Private</Subheader>
                    {privateConversations}
                </List>
            </div>
        );
    }
}

const mapStateToProps = ( state ) => {
    console.log( 'ChatListContainer - fn: mapStateToProps' );
    return {
        user: state.user,
        privateConversation: state.users && state.users.filter( user => {
            return user.privateMessages;
        } )
    };
};

export default connect( mapStateToProps )( ChatListContainer );
