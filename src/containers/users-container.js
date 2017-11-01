// REACT
import React, { Component } from 'react';
// REDUX
import { connect } from 'react-redux';
import {
    loadLatestUsers,
    loadSearchedUsers,
    clearSearchedUsers,
    updateFriendship,
    requestFriendship
} from '../actions/actions';

// MY COMPONENTS
import Users from '../components/users';

// MATERIAL-UI
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';

// ICONS
import ActionSearch from 'material-ui/svg-icons/action/search';

class UsersContainer extends Component {
    constructor( props ) {
        super( props );
        this.state = { showSearchedUsersList: false }
    }

    componentDidMount() {
        this.props.loadLatestUsers();
    }

    handleFriendshipChange( toUserId, status ) {
        console.log( 'handleFriendshipChange', toUserId, status );
        const { updateFriendship, requestFriendship, user } = this.props;
        // updateFriendship( user.uid, toUserId, status );
        requestFriendship( user.uid, toUserId, status );
    }

    handleUpdateInput( e ) {
        console.log( 'handleUpdateInput: ', e.target.value );
        if ( !e.target.value ) {
            console.log( 'fn: handleUpdateInput: value is blank' );
            this.setState( { showSearchedUsersList: false } );
            this.props.clearSearchedUsers();
        } else {
            this.props.loadSearchedUsers( e.target.value );
            this.setState( { showSearchedUsersList: true } );
        }

    }

    render() {
        console.log( 'UsersContainer - RENDER - this.props: ', this.props );
        const { searchedUsersList, users } = this.props;
        return (
            <div>
                <Toolbar>
                    <TextField
                        hintText="Full width"
                        fullWidth={true}
                        onChange={e => this.handleUpdateInput(e)}
                    />
                    <ToolbarGroup><ActionSearch/></ToolbarGroup>
                </Toolbar>
                {
                    this.state.showSearchedUsersList && searchedUsersList &&
                    <Users
                        users={searchedUsersList}
                        handleFriendshipChange={( toUserId, status ) => this.handleFriendshipChange( toUserId, status )}/>
                }

                {
                    !this.state.showSearchedUsersList && users &&
                    <Users
                        users={users}
                        handleFriendshipChange={( toUserId, status ) => this.handleFriendshipChange( toUserId, status )}/>
                }
            </div>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const mapStateToProps = state => {
    console.log( 'UsersContainer - fn: mapStateToProps' );
    return {
        user: state.user,
        users: state.users && state.users.filter( user => {
            if ( !user.status ) {
                return user;
            } else {
                if ( user.status == 'TERMINATED' || user.status == 'CANCELED' ) {
                    return user;
                }
            }

        } ),
        searchedUsersList: state.searchedUsersList
    };
};

const mapDispatchToProps = dispatch => ( {
    loadLatestUsers: () => dispatch( loadLatestUsers() ),
    updateFriendship: ( fromUserId, toUserId, status ) => dispatch( updateFriendship( fromUserId, toUserId, status ) ),
    requestFriendship: ( fromUserId, toUserId, status ) => dispatch( requestFriendship( fromUserId, toUserId, status ) ),
    loadSearchedUsers: search => dispatch( loadSearchedUsers( search ) ),
    clearSearchedUsers: () => dispatch( clearSearchedUsers() )
} );

export default connect( mapStateToProps, mapDispatchToProps )( UsersContainer );
