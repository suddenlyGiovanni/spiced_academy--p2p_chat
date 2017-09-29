import React, { Component } from 'react';
import getSocket from '../utils/socketIo';
import ProfilePicOther from './profilePicOther';

// MATERIAL UI
import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import { Toolbar } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';



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
        const { currentUser } = this.props;

        const chatMessages = this.props.publicMessagesList && this.props.publicMessagesList.map( message => {
            const {
                mid,
                fromUserId,
                firstName,
                lastName,
                profilePic,
                messageBody,
                timestamp
            } = message;

            const sender = ( currentUser.uid == message.uid ) ? true : false

            const avatar = <Avatar src={profilePic} />

            if ( sender ) {
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
                            title={`${firstName} ${lastName}`}
                            subtitle={timestamp}
                            avatar={avatar}
                        />
                        <CardText>{messageBody}</CardText>
                        </Card>
                );
            } else {
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
                            title={`${firstName} ${lastName}`}
                            subtitle={timestamp}
                            avatar={avatar}/>
                        <CardText>{messageBody}</CardText>
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
