import React from 'react';
import ProfilePicOther from './profilePicOther';

const OnlineUsers = ( props ) => {
    console.log( 'OnlineUsers - RENDER - this.props: ', props );
    const listOnlineUsers = props.onlineUsers.map( onlineUser => {
        const { uid, firstName, lastName, profilePic } = onlineUser;
        return (
            <li key={uid}>
                <ProfilePicOther
                    src={profilePic}
                    alt={`${firstName} ${lastName}`}
                    uid={uid}/>
                <h3>{firstName} {lastName}</h3>
            </li>
        );
    } );

    return (
        <div style={{border: 'thin dashed purple'}}>
            OnlineUsers
            <ul>
                {listOnlineUsers}
            </ul>
        </div>
    );
};

export default OnlineUsers;
