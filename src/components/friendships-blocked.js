import React from 'react';
import ProfilePicOther from './profilePicOther';

const BlockedFriendships = ( props ) => {
    console.log( 'BlockedFriendships - RENDER - this.props: ', props );
    const { handleFriendshipChange } = props;
    const listBlockedFriendships = props.blockedFriendships.map( ( blockedFriend ) => {
        const { uid, firstName, lastName, profilePic } = blockedFriend;
        return (
            <li key={uid}>
                <ProfilePicOther
                    src={profilePic}
                    alt={`${firstName} ${lastName}`}
                    uid={uid}/>
                <h3>{firstName} {lastName}</h3>
                <button onClick={() => handleFriendshipChange( uid, 'PENDING' ) }>REKINDLE YOUR FRIENDSHIP</button>
            </li>
        );
    } );

    return (
        <div style={{border: 'thin dashed darkgreen'}}>
            BlockedFriendshipsContainer
            <ul>
                {listBlockedFriendships}
            </ul>
        </div>
    );

};

export default BlockedFriendships;
