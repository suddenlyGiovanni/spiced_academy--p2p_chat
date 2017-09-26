// REACT
import React from 'react';

// MATERIAL-UI
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

// ICONS
import SocialPersonAdd from 'material-ui/svg-icons/social/person-add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip='edit friendship status'
        tooltipPosition='bottom-left'
    >
        <MoreVertIcon color={ grey400 } />
    </IconButton>
);

const BlockedFriendships = ( props ) => {
    console.log( 'BlockedFriendships - RENDER - this.props: ', props );
    const { handleFriendshipChange } = props;

    const listBlockedFriendships = props.blockedFriendships.map( ( blockedFriend ) => {
        const { uid, firstName, lastName, profilePic } = blockedFriend;

        const rightIconMenu = (
            <IconMenu
                iconButtonElement={iconButtonElement}
                onItemTouchTap={ () => handleFriendshipChange( uid, 'PENDING' ) }>
                <MenuItem
                    value='PENDING'
                    primaryText='REKINDLE YOUR FRIENDSHIP'
                    leftIcon={<SocialPersonAdd />}/>
            </IconMenu>
        );

        return (
            <div>
                <ListItem
                    primaryText={`${firstName} ${lastName}`}
                    leftAvatar={<Avatar src={profilePic} />}
                    rightIconButton={rightIconMenu}
                />
                <Divider inset={true} />
            </div>
        );
    } );

    return (
        <List>
            <Subheader>These people have been blocked</Subheader>
            {listBlockedFriendships}
        </List>
    );

};

export default BlockedFriendships;
