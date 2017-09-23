import React from 'react';
import ProfilePicOther from './profilePicOther';


const PendingFriendships = ( props ) => {
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
