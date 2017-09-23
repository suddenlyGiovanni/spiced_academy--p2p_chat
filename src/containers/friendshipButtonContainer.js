import React from 'react';
import axios from '../utils/axios';
import FriendshipButton from '../components/friendshipButton';

export default class FriendshipButtonContainer extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            currentUserId: props.currentUserId,
            otherUserId: props.otherUserId,
            fromUserId: '',
            toUserId: '',
            status: '',
            btnAction: ''
        };
    }

    componentDidMount() {
        console.log( 'FriendshipButtonContainer - fn: componentDidMount - this.props: ', this.props );
        // this.setState( {
        //     fromUserId: this.props.fromUserId,
        //     toUserId: this.props.toUserId
        // } );
        // R:   READ    -   GET     -   /api/friends/:fromUserId/:toUserI   SEE FRIENDSHIP STATUS OF TWO USERS
        axios.get( `/api/friends/${this.state.currentUserId}/${this.props.otherUserId}` )
            .then( resp => {
                if ( resp.data.success ) {
                    this.setState( resp.data );
                    return this.setBtnAction();
                } else {
                    throw 'ERR: FriendshipButtonContainer - fn: componentDidMount - unable to retrieve data';
                }
            } )
            .catch( err => console.error( err ) );
    }

    setBtnAction() {
        const { status, currentUserId, fromUserId, toUserId } = this.state;
        if ( !status ) {
            return this.setState( { btnAction: 'MAKE FRIEND REQ' } );
        } else if ( status == 'CANCELED' ) {
            return this.setState( { btnAction: 'MAKE FRIEND REQ' } );
        } else if ( status == 'PENDING' && currentUserId == fromUserId ) {
            return this.setState( { btnAction: 'CANCEL' } );
        } else if ( status == 'PENDING' && currentUserId == toUserId ) {
            return this.setState( { btnAction: 'ACCEPT' } );
        } else if ( status == 'ACCEPTED' ) {
            return this.setState( { btnAction: 'TERMINATE' } );
        } else if ( status == 'TERMINATED' ) {
            return this.setState( { btnAction: 'DISABLED' } );
        }
    }

    // axios.put( `/api/friends/${currentUserId}/${otherUserId}/delete`, { status: 'CANCEL' } )
    // .then( resp => console.log( resp.data ) )
    // .catch( err => console.error( err.stack ) );

    handleClick() {
        const { currentUserId, otherUserId, btnAction } = this.state;
        console.log( 'FriendshipButtonContainer - fn: handleClick' );

        // status == '' && btnAction === 'MAKE FRIEND' && newStatus === 'PENDING'
        if ( !status && btnAction === 'MAKE FRIEND REQ' ) {
            axios.post( `/api/friends/${currentUserId}/${otherUserId}`, { status: 'PENDING' } )

                .then( resp => {
                    if ( resp.data.success ) {
                        this.setState( resp.data );
                        return this.setBtnAction();
                    } else {
                        throw 'ERR: FriendshipButtonContainer - fn: handleClick - unable MAKE friendship';
                    }
                } )

                .catch( err => console.error( err ) );

        }

        // status == 'CANCELED' && btnAction === 'MAKE FRIEND' && newStatus === 'PENDING'
        if ( btnAction === 'MAKE FRIEND REQ' ) {
            axios.put( `/api/friends/${currentUserId}/${otherUserId}`, { status: 'PENDING' } )

                .then( resp => {
                    if ( resp.data.success ) {
                        this.setState( resp.data );
                        return this.setBtnAction();
                    } else {
                        throw 'ERR: FriendshipButtonContainer - fn: handleClick - unable MAKE friendship';
                    }
                } )

                .catch( err => console.error( err ) );

        }

        // status == 'PENDING' && btnAction === 'CANCEL' && newStatus === 'CANCELED'
        else if ( btnAction === 'CANCEL' ) {
            axios.put( `/api/friends/${currentUserId}/${otherUserId}`, { status: 'CANCELED' } )

                .then( resp => {
                    if ( resp.data.success ) {
                        this.setState( resp.data );
                        return this.setBtnAction();
                    } else {
                        throw 'ERR: FriendshipButtonContainer - fn: handleClick - unable CANCEL friendship';
                    }
                } )

                .catch( err => console.error( err ) );
        }

        // status == 'PENDING' && btnAction === 'ACCEPT' && newStatus === 'ACCEPTED'
        else if ( btnAction === 'ACCEPT' ) {
            axios.put( `/api/friends/${currentUserId}/${otherUserId}`, { status: 'ACCEPTED' } )

                .then( resp => {
                    if ( resp.data.success ) {
                        this.setState( resp.data );
                        return this.setBtnAction();
                    } else {
                        throw 'ERR: FriendshipButtonContainer - fn: handleClick - unable ACCEPT friendship';
                    }
                } )

                .catch( err => console.error( err ) );
        }

        // status == 'ACCEPTED' && btnAction === 'TERMINATE' && newStatus === 'TERMINATED'
        else if ( btnAction === 'TERMINATE' ) {
            axios.put( `/api/friends/${currentUserId}/${otherUserId}`, { status: 'TERMINATED' } )

                .then( resp => {
                    if ( resp.data.success ) {
                        this.setState( resp.data );
                        return this.setBtnAction();
                    } else {
                        throw 'ERR: FriendshipButtonContainer - fn: handleClick - unable TERMINATE friendship';
                    }
                } )

                .catch( err => console.error( err ) );
        }

        // status == 'TERMINATED' && btnAction === 'DISABLED'
        else if ( btnAction === 'DISABLED' ) {
            throw 'ERR: FriendshipButtonContainer - fn: handleClick - btn is DISABLED: deal with it!';
        }
    }

    render() {
        console.log( 'FriendshipButtonContainer - RENDER - this.state: ', this.state );
        return <FriendshipButton
            onClick={ e => this.handleClick(e) }
            btnAction={this.state.btnAction} />;
    }
}
