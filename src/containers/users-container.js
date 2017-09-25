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

import ActionSearch from 'material-ui/svg-icons/action/search';

class UsersContainer extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            dataSource: [],
        }
    }

    componentDidMount() {
        this.props.loadLatestUsers();
    }

    componentWillReceiveProps( nextProps ) {
        console.log( 'UsersContainer - fn: componentWillReceiveProps - nextProps.users: ', nextProps.users );
        this.setState( { users: nextProps.users } );
    }

    handleFriendshipChange( toUserId, status ) {
        console.log( 'handleFriendshipChange', toUserId, status );
        const { updateFriendship, uid } = this.props;
        updateFriendship( uid, toUserId, status );
    }

    handleUpdateInput( value ) {
        console.log( 'handleUpdateInput: ', value );
        this.props.loadSearchedUsers( value );

        this.setState( {
            dataSource: [
            value,
            value + value,
            value + value + value,
          ],
        } );
    }

    render() {
        console.log( 'UsersContainer - RENDER - this.props: ', this.state );

        const { users } = this.state;
        return (
            <div>
                <Toolbar>
                    <AutoComplete
                        hintText='Search for new Friends'
                        dataSource={this.state.dataSource}
                        onUpdateInput={ e => this.handleUpdateInput(e) }
                        fullWidth={true}
                    />
                    <ToolbarGroup><ActionSearch/></ToolbarGroup>
                </Toolbar>
                {
                    users &&
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
        users: state.users
    }
};

const mapDispatchToProps = dispatch => ( {
    loadLatestUsers: () => dispatch( loadLatestUsers() ),
    updateFriendship: ( fromUserId, toUserId, status ) => dispatch( updateFriendship( fromUserId, toUserId, status ) ),
    loadSearchedUsers: search => dispatch( loadSearchedUsers( search ) )
} );

export default connect( mapStateToProps, mapDispatchToProps )( UsersContainer )
