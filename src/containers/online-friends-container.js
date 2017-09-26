import React, { Component } from 'react';
import { connect } from 'react-redux';
import OnlineFriends from '../components/online-friends';

class OnlineFriendsContainer extends Component {
    constructor( props ) {
        super( props );
    }
    render() {
        const { onlineFriends } = this.props;
        console.log( 'OnlineUsersContainer - RENDER - this.props: ', this.props );

        if ( !onlineFriends ) {
            return <div>Loading online friends</div>;
        }
        return <OnlineFriends onlineFriends={ onlineFriends }/>;
    }
}

const mapStateToProps = ( state ) => {
    console.log( 'OnlineFriendsContainer - fn: mapStateToProps' );
    return {
        user: state.user,
        onlineFriends: state.users && state.users.filter( user => {
            return (user.online == true && user.status == 'ACCEPTED' && user.uid != state.user.uid);
        } )
    };
};


export default connect( mapStateToProps )( OnlineFriendsContainer );
