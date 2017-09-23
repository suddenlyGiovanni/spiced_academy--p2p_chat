import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import axios from '../utils/axios';
// import PropTypes from 'prop-types';
import ProfilePic from '../components/profile-pic';
import FriendshipButtonContainer from './friendshipButtonContainer';

export default class ProfileOther extends Component {

    constructor( props ) {
        super( props );
        this.state = {};
    }

    componentDidMount() {
        // if the uid (this.props.params.uid) passed to this comp is the same as
        // the logged in user's (this.props.uid).
        if ( this.props.uid == this.props.params.uid ) {
            browserHistory.push( '/' );
        }

        // console.log( 'ProfileOther - fn: componentDidMount', `/api/user/${this.props.params.uid}` );

        axios.get( `/api/user/${this.props.params.uid}` )

            .then( resp => {
                if ( resp.data.success ) {
                    this.setState( resp.data.otherUserData );
                    console.log( 'ProfileOther - fn: componentDidMount - this.state', this.state );
                }
                this.setState( { error: 'Something went wrong. Please try again!' } );
            } )

            .catch( err => {
                this.setState( { error: 'Something went wrong. Please try again!' } );
                console.err( err );
            } );
    }

    render() {
        console.log( 'ProfileOther - RENDER - this.state: ', this.state );

        const {
            uid,
            firstName,
            lastName,
            email,
            bio,
            profilePic
        } = this.state;

        return (
            <div style={{border:'medium dotted blue'}}>
                <p>ProfileOther</p>

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
                {
                    bio && (
                        <div>

                            <label forHtml='bio'>Bio </label>
                            <textarea id='bio'
                                name="bio"
                                value={bio} disabled/>
                        </div>)
                }
                {
                    this.props.uid && this.state.uid &&
                    <FriendshipButtonContainer
                        currentUserId={this.props.uid}
                        otherUserId={this.state.uid}/>
                }
            </div>
        );
    }

}
