import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatPublic from '../components/chat-public';

class ChatPublicContainer extends Component {
    constructor( props ) {
        super( props );
    }

    render() {
        console.log( 'ChatPublicContainer - RENDER - this.props: ', this.props );
        return (
            <div>
                ChatPublicContainer.js
                {
                    this.props.publicMessages &&
                    <ChatPublic
                        publicMessagesList={this.props.publicMessages}
                        currentUser={this.props.currentUser}
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = ( state ) => {
    console.log( 'ChatPublicContainer - fn: mapStateToProps' );
    return {
        publicMessages: state.publicMessages && state.publicMessages,
        currentUser: state.user
    };
};

export default connect( mapStateToProps )( ChatPublicContainer );
