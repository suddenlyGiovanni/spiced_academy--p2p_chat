import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatPrivate from '../components/chat-private';
import { store } from '../shell';
import { persistOtherUid } from '../actions/actions';

class ChatPrivateContainer extends Component {
    constructor( props ) {
        super( props );
    }

    componentDidMount() {
        const otherUid = this.props.routeParams.otherUid;
        store.dispatch( persistOtherUid( otherUid ) );
    }

    render() {
        console.log( 'ChatPrivateContainer - RENDER - this.props: ', this.props );
        const { currentUser, otherUser, messages } = this.props;
        return (
            <div>
                ChatPrivateContainer.js

                <ChatPrivate
                    style={{height:'100%'}}
                    currentUser={currentUser}
                    otherUser={otherUser}
                    messages={messages}/>

            </div>
        );
    }
}

const mapStateToProps = ( state ) => {
    console.log( 'ChatPrivateContainer - fn: mapStateToProps' );
    const otherUser = state.users && state.users.find( user => user.uid == state.otherUid );
    const messages = otherUser && otherUser.privateMessages;
    return {
        otherUid: state.otherUid,
        currentUser: state.user,
        otherUser: otherUser,
        messages: messages
    };
};

export default connect( mapStateToProps )( ChatPrivateContainer );
