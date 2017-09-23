import React from 'react';
import ProfilePic from './profilePic';
import PropTypes from 'prop-types';
import ProfileSelfBio from './profileSelfBio';


const ProfileSelf = ( props ) => {
    console.log( 'ProfileSelf - RENDER - this.props: ', props );

    const {
        uid,
        firstName,
        lastName,
        email,
        bio,
        profilePic
    } = props;

    return (
        <div style={{border:'medium dotted blue'}}>

            <h4>ProfileSelf</h4>

            <ProfilePic
                src={ profilePic }
                alt={ firstName + ' ' + lastName } />


            <label forHtml='uid'>Uid </label>
            <input id='uid'
                type="text"
                name='uid'
                value={uid} disabled />

            <label forHtml='name'>Name </label>
            <input id='name'
                type="text"
                name='name'
                value={`${ firstName } ${ lastName }`} disabled />

            <label forHtml='mail'>Mail </label>
            <input id='mail'
                type="email"
                name='mail'
                value={ email } disabled />


            <ProfileSelfBio bio={ bio } uid={ uid }/>

        </div>
    );
};

ProfileSelf.propTypes = {
    uid: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    bio: PropTypes.string,
    profilePic: PropTypes.string
};

export default ProfileSelf;
