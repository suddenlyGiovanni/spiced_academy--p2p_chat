// REACT
import React, { Component } from 'react';
// UTILS
import getSocket from '../utils/socketIo';

// MATERIAL UI
import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import { Toolbar } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';


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



            if ( sender ) {
                // MESSAGE FROM THE USER
                const avatar = <Avatar src={otherUser.profilePic} />
                return (
                    <Card key={mid}
                        style={{
                            marginTop: 15,
                            marginBottom: 15,
                            backgroundColor: '#009688',
                            width: '60%',
                            alignSelf: 'flex-start'
                        }}>
                        <CardHeader
                            title={`${ otherUser.firstName} ${ otherUser.lastName}`}
                            subtitle={timestamp}
                            avatar={avatar}
                        />
                        <CardText>{msg}</CardText>
                    </Card>
                );
            } else {
                // MESSAGE FORM THE OTHE USER
                const avatar = <Avatar src={currentUser.profilePic} />
                return (
                    <Card key={mid}
                        style={{
                            marginTop: 15,
                            marginBottom: 15,
                            backgroundColor: '#2196F3',
                            width: '60%',
                            alignSelf: 'flex-end'
                        }}>
                        <CardHeader
                            title={`${currentUser.firstName} ${currentUser.lastName}`}
                            subtitle={timestamp}
                            avatar={avatar}/>
                        <CardText>{msg}</CardText>
                    </Card>
                );
            }

        } );

        return (
            <div>
                <div id="chat-messages"
                    ref={elem => this.messageArea = elem}
                    style={{
                        overflow: 'scroll',
                        height: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}>

                    {chatMessages}

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
