import React, { Component } from 'react';
import getSocket from '../utils/socketIo';
import ProfilePicOther from './profilePicOther';

export default class ChatPrivate extends Component {
    constructor( props ) {
        super( props );
    }


    handleSubmit( e ) {
        if ( e.keyCode === 13 ) {
            e.preventDefault();
            console.log( e.target.value );
            getSocket().emit( 'chatMessagePrivate', {
                toUserId: this.props.otherUser.uid,
                messageBody: e.target.value
            } );
            e.target.value = '';
        }
    }


    componentDidUpdate() {
        this.messageArea.scrollTop = this.messageArea.scrollHeight;
    }

    render() {
        console.log( 'ChatPrivate - RENDER - this.props: ', this.props );
        const { currentUser, otherUser, messages } = this.props;

        const chatMessages = messages && messages.map( message => {
            const { mid, sender, msg, timestamp } = message;

            let uid,
                firstName,
                lastName,
                profilePic;


            if ( sender ) {
                uid = otherUser.uid;
                firstName = otherUser.firstName;
                lastName = otherUser.lastName;
                profilePic = otherUser.profilePic;
            } else {
                uid = currentUser.uid;
                firstName = currentUser.firstName;
                lastName = currentUser.lastName;
                profilePic = currentUser.profilePic;
            }

            return (
                <li key={mid}>
                    <ProfilePicOther
                        src={profilePic}
                        alt={`${firstName} ${lastName}`}
                        uid={uid}/>
                    <h3>{firstName} {lastName}</h3>
                    <p>{timestamp}</p>
                    <p>{msg}</p>
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
                    onKeyDown={e=>this.handleSubmit(e)}>
                </textarea>
            </div>
        );
    }
}
