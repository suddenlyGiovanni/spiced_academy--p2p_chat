// REACT
import React, { Component } from 'react';
// UTILS
import getSocket from '../utils/socketIo';
import getPeers from '../utils/peer';

// MATERIAL UI
import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import { Toolbar } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';

let conn;

export default class ChatSecure extends Component {
    constructor( props ) {
        super( props );
    }

    componentDidMount() {
        conn = getPeers().connect( this.props.otherUser.peerId );
        console.log( 'ChatSecure - componentDidMount - conn: ', conn );
    }

    handleSubmit( e ) {
        if ( e.keyCode === 13 ) {
            e.preventDefault();
            console.log( e.target.value );
            conn.send( {
                fromUserId: this.props.currentUser.uid,
                toUserId: this.props.otherUser.uid,
                messageBody: e.target.value
            } );
            // getSocket().emit( 'chatMessagePrivate', {
            //     toUserId: this.props.otherUser.uid,
            //     messageBody: e.target.value
            // } );
            e.target.value = '';
        }
    }

    componentDidUpdate() {
        this.messageArea.scrollTop = this.messageArea.scrollHeight;
    }

    render() {
        console.log( 'ChatSecure - RENDER - this.props: ', this.props );
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

            const avatar = <Avatar src={profilePic} />


            if ( sender ) {
                <Card>
                    <CardHeader
                        title={`${firstName} ${lastName}`}
                        subtitle={timestamp}
                        avatar={avatar}
                    />
                    <CardTitle title="Card title" subtitle="Card subtitle" />
                    <CardText>{msg}</CardText>
                </Card>
            }

            return (
                <li key={mid}>
                    <Card style={{marginTop: 10, marginBottom: 10}}>
                        <CardHeader
                            title={`${firstName} ${lastName}`}
                            subtitle={timestamp}
                            avatar={avatar}/>
                        <CardText>{msg}</CardText>
                    </Card>
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
                <Toolbar>
                    <TextField
                        name='newMessage'
                        maxLength='300'
                        hintText='say hello'
                        fullWidth={true}
                        ref={newMessage => this.newMessage = newMessage}
                        onKeyDown={ e => this.handleSubmit(e) }
                    />
                </Toolbar>
            </div>
        );
    }
}
