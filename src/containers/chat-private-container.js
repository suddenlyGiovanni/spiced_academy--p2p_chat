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
        const { privateMessages, otherUid } = this.props;
        return (
            <div>
                ChatPrivateContainer.js
                {
                    privateMessages &&
                    <ChatPrivate
                        privateMessagesList={privateMessages}
                        otherUid={otherUid}/>
                }
            </div>
        );
    }
}

const mapStateToProps = ( state ) => {
    console.log( 'ChatPrivateContainer - fn: mapStateToProps' );
    return {
        currentUser: state.user,
        otherUid: state.otherUid,
        privateMessages: state.privateMessages && state.privateMessages.filter( message => {
            return ( message.fromUserId == state.otherUid || message.toUserId == state.otherUid);
        } )
    };
};

export default connect( mapStateToProps )( ChatPrivateContainer );
