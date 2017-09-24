import React from 'react';
// REDUX
import { connect } from 'react-redux';
// MY COMPONENTS
import ProfilePic from './profile-pic';
import PropTypes from 'prop-types';
import ProfileSelfBio from './profile-self-bio';

import Avatar from 'material-ui/Avatar';


const ProfileSelf = ( props ) => {
    console.log( 'ProfileSelf - RENDER - this.props: ', props );

    if (!props.user) {
        return null;
    }
    const {
        uid,
        firstName,
        lastName,
        email,
        bio,
        profilePic
    } = props.user;

    return (
        <div style={{border:'medium dotted blue'}}>

            <h4>ProfileSelf</h4>
            <Avatar src={ profilePic } />


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

// REDUX - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const mapStateToProps = ( state ) => {
    console.log( 'App - fn: ProfileSelf' );
    return { user: state.user };
};


export default connect( mapStateToProps )( ProfileSelf );
