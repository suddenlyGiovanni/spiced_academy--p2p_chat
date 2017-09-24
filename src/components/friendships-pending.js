import React from 'react';
import ProfilePicOther from './profilePicOther';

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

const PendingFriendships =  props => {
    console.log( 'PendingFriendships - RENDER - this.props: ', props );
    const { handleFriendshipChange } = props;
    // loop over the friends array and create an element for each
    const listPendingFriendships = props.pendingFriendships.map( ( pendingFriend ) => {
        const { uid, firstName, lastName, profilePic } = pendingFriend;
        return (
            <li key={uid}>
                <ProfilePicOther
                    src={profilePic}
                    alt={`${firstName} ${lastName}`}
                    uid={uid}/>
                <h3>{firstName} {lastName}</h3>
                <button onClick={() => handleFriendshipChange( uid, 'ACCEPTED' ) }>ACCEPT FRIEND REQUEST</button>
            </li>
        );
    } );

    return (
        <div style={{border: 'thin dashed green'}}>
            PendingFriendshipsContainer
            <ul>
                {listPendingFriendships}
            </ul>
        </div>
    );
};


export default PendingFriendships;
