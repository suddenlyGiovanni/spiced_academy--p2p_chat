import React from 'react';
import PropTypes from 'prop-types';

const ProfilePic = ( props ) => {
    // console.log( 'ProfilePic - RENDER - this.props: ', props );
    const { showProfilePicUpload, src, alt } = props;
    return (
        <div
            style={{ border : 'thin dotted blue'}}
            onClick={showProfilePicUpload}>

            <img
                src={src}
                alt={alt}
                style={{ width: '40px', height: '40px', borderRadius: '50%'}}/>

        </div>
    );
};


ProfilePic.propTypes = {
    showProfilePicUpload: PropTypes.func,
    src: PropTypes.string,
    alt: PropTypes.string
};

export default ProfilePic;
