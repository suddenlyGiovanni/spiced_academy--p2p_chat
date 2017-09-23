import React from 'react';

const FriendshipButton = (props) => {
    return(
        <button onClick={props.onClick}>{props.btnAction}</button>
    );
};

export default FriendshipButton;
