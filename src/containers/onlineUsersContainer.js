import React, { Component } from 'react';
import { connect } from 'react-redux';
import OnlineUsers from '../components/onlineUsers';

class OnlineUsersContainer extends Component {
    constructor( props ) {
        super( props );
    }
    render() {
        const { onlineUsers } = this.props;
        console.log( 'OnlineUsersContainer - RENDER - this.props: ', this.props );

        if (!onlineUsers) {
            return <div>Loading online users</div>;
        }

        return (
            <div>
                <h1>OnlineUsersContainer</h1>
                <OnlineUsers onlineUsers={ onlineUsers }/>
            </div>
        );
    }
}

const mapStateToProps = ( state ) => {
    console.log( 'OnlineUsersContainer - fn: mapStateToProps' );
    return {
        onlineUsers: state.onlineUsers && state.onlineUsers
    };
};


export default connect( mapStateToProps )( OnlineUsersContainer );
