import React from 'react';
import { Link, browserHistory } from 'react-router';


// MATERIAL-UI
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

const handleTouchOnlineFriend = ( uid ) => {
    console.log( 'OnlineFriend - fn: handleTouchOnlineFriend' );
    browserHistory.push( `/chat/secure/${uid}` );
};

const OnlineFriend = props => {
    console.log( 'OnlineFriend - RENDER - this.props: ', props );

    const listOnlineFriends = props.onlineFriends.map( onlineFriend => {
        const { uid, firstName, lastName, profilePic } = onlineFriend;

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
                    onClick={ () => handleTouchOnlineFriend( uid ) }
                />
                <Divider inset={true} />
            </div>
        );
    } );

    return (
        <List>
            <Subheader>Online Friends you can secure chat with:</Subheader>
            {listOnlineFriends}
        </List>
    );
};

export default OnlineFriend;
