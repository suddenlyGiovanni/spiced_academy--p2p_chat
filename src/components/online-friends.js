import React from 'react';
import ProfilePicOther from './profilePicOther';
import { Link } from 'react-router';


// MATERIAL-UI
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// ICONS
import ContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle';

const handleTouchOnlineFriend = ( uid ) => {
    console.log( 'OnlineUsers - fn: handleTouchOnlineFriend' );
    browserHistory.push( `/chat/private/${uid}` );
}

const OnlineUsers = props => {
    console.log( 'OnlineUsers - RENDER - this.props: ', props );

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
            <Subheader>OnlineUsers</Subheader>
            {listOnlineFriends}
        </List>
    );
};

export default OnlineUsers;
