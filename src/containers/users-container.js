// REACT
import React, { Component } from 'react';
// REDUX
import { connect } from 'react-redux';
import { loadLatestUsers, loadSearchedUsers, updateFriendship } from '../actions/actions';

// MY COMPONENTS
import Users from '../components/users';



// MATERIAL-UI
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';


import ActionSearch from 'material-ui/svg-icons/action/search';

class UsersContainer extends Component {
    constructor( props ) {
        super( props );
        this.state = { showSearchedUsersList: false }
    }

    componentDidMount() {
        this.props.loadLatestUsers();
    }

    // componentWillReceiveProps( nextProps ) {
    //     console.log( 'UsersContainer - fn: componentWillReceiveProps - nextProps.users: ', nextProps.users );
    //     this.setState( { users: nextProps.users } );
    // }

    handleFriendshipChange( toUserId, status ) {
        console.log( 'handleFriendshipChange', toUserId, status );
        const { updateFriendship, uid } = this.props;
        updateFriendship( uid, toUserId, status );
    }

    handleUpdateInput( e ) {
        console.log( 'handleUpdateInput: ', e.target.value );
        if ( !e.target.value ) {
            console.log( 'fn: handleUpdateInput: value is blank' );
            this.setState( { showSearchedUsersList: false } );
        } else {
            this.props.loadSearchedUsers( e.target.value );
            this.setState( { showSearchedUsersList: true } );
        }

    }

    render() {
        console.log( 'UsersContainer - RENDER - this.state: ', this.state );
        // const users = this.props.searchedUsersList;
        const { searchedUsersList } = this.props;
        const { users } = this.props;
        // let users;
        // if (this.state.showSearchedUsersList) {
        //     console.log('showSearchedUsersList: ', showSearchedUsersList);
        //     users = this.props.searchedUsersList;
        // } else {
        //     console.log('showSearchedUsersList: ', showSearchedUsersList);
        //     users = this.props.users;
        // }

        return (
            <div>
                <Toolbar>
                    {/* <AutoComplete
                        hintText='Search for new Friends'
                        dataSource={this.state.dataSource}
                        onUpdateInput={ e => this.handleUpdateInput(e) }
                        fullWidth={true}
                    /> */}
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
        users: state.users,
        searchedUsersList: state.searchedUsersList
    }
};

const mapDispatchToProps = dispatch => ( {
    loadLatestUsers: () => dispatch( loadLatestUsers() ),
    updateFriendship: ( fromUserId, toUserId, status ) => dispatch( updateFriendship( fromUserId, toUserId, status ) ),
    loadSearchedUsers: search => dispatch( loadSearchedUsers( search ) )
} );

export default connect( mapStateToProps, mapDispatchToProps )( UsersContainer )
