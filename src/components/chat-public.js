import React, { Component } from 'react';
import getSocket from '../utils/socketIo';
import ProfilePicOther from './profilePicOther';

export default class ChatPublic extends Component {
    constructor( props ) {
        super( props );
    }

    handleSubmit( e ) {
        if ( e.keyCode === 13 ) {
            e.preventDefault();
            console.log( e.target.value );
            getSocket().emit( 'chatMessage', e.target.value );
            e.target.value = '';
        }
    }

    componentDidUpdate() {
        this.messageArea.scrollTop = this.messageArea.scrollHeight;
    }

    render() {
        console.log( 'ChatPublic - RENDER - this.props: ', this.props );

        const chatMessages = this.props.publicMessagesList && this.props.publicMessagesList.map( message => {
            const { mid, fromUserId, firstName, lastName, profilePic, messageBody, timestamp } = message;
            return (
                <li key={mid}>
                    <ProfilePicOther
                        src={profilePic}
                        alt={`${firstName} ${lastName}`}
                        uid={fromUserId}/>
                    <h3>{firstName} {lastName}</h3>
                    <p>{timestamp}</p>
                    <p>{messageBody}</p>
                </li>
            );
        } );

        return (
            <div>
                <div id="chat-messages"
                    ref={elem => this.messageArea = elem}
                    style={{
                        overflow: 'scroll',
                        height: 400
                    }}>
                    messages go here
                    <ul>
                        {chatMessages}
                    </ul>
                </div>
                <textarea
                    name='newMessage'
                    maxLength='300'
                    placeholder='Please somebody answer me..'
                    ref={newMessage => this.newMessage = newMessage}
                    onKeyDown={ e => this.handleSubmit(e) }>
                </textarea>
            </div>
        );
    }
}
