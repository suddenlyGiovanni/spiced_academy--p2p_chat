import React from 'react';
import { Link } from 'react-router';

const ProfilePicOther = ( props ) => {
    const { src, alt, uid, chat } = props;
    const url = chat == true ? `/chat/private/${uid}` : `/user/${uid}`
    return (
        <div >
            <Link to={url}>
                <img src={src} alt={alt}
                    style={{ width: '100px', height: '100px', borderRadius: '50%'}}/>
            </Link>
        </div>
    );
};

export default ProfilePicOther;
