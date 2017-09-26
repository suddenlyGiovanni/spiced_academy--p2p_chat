// REACT
import React from 'react';
import ProfilePicOther from './profilePicOther';
import { browserHistory } from 'react-router';

// MATERIAL-UI
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// ICONS
import ContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle';



const handleTouchCurrentFriend = ( uid ) => {
    console.log( 'App - fn: handleTouchCurrentFriend' );
    browserHistory.push( `/chat/private/${uid}` );
};


const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip='edit friendship status'
        tooltipPosition='bottom-left'
    >
        <MoreVertIcon color={grey400} />
    </IconButton>
);


const CurrentFriendship = ( props ) => {
    console.log( 'CurrentFriendship - RENDER - this.props: ', props );
    const { handleFriendshipChange, uidSelf } = props;


    const listCurrentFriendships = props.currentFriendships.map( ( currentFriend ) => {
        const { uid, firstName, lastName, profilePic } = currentFriend;
        const rightIconMenu = (
            <IconMenu
                iconButtonElement={iconButtonElement}
                onItemTouchTap={ () => handleFriendshipChange( uid, 'TERMINATED' ) }>
                <MenuItem
                    value='END'
                    primaryText='END FRIENDSHIP'
                    leftIcon={<ContentRemoveCircle />}/>
            </IconMenu>
        );

        return (
            <div>
                <ListItem
                    primaryText={`${firstName} ${lastName}`}
                    leftAvatar={<Avatar src={profilePic} />}
                    rightIconButton={rightIconMenu}
                    onClick={ () => handleTouchCurrentFriend( uid ) }
                />
                <Divider inset={true} />
            </div>

        );
    } );

    return (
        <List>
            <Subheader>These people are currently your friend</Subheader>
            {listCurrentFriendships}
        </List>
    );

};

export default CurrentFriendship;
