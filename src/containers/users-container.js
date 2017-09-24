// REACT
import React, { Component } from 'react';
// REDUX
import { connect } from 'react-redux';
import { loadLatestUsers } from '../actions/actions';

// MATERIAL-UI
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import AutoComplete from 'material-ui/AutoComplete';

import ActionSearch from 'material-ui/svg-icons/action/search';

class UsersContainer extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            dataSource: []
        }
    }

    componentDidMount() {
        this.props.loadLatestUsers();
    }

    handleUpdateInput( value ) {
        console.log( 'handleUpdateInput: ', value );
        this.setState( {
            dataSource: [
            value,
            value + value,
            value + value + value,
          ],
        } );
    }

    render() {
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
            </div>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const mapStateToProps = state => {
    console.log( 'UsersContainer - fn: mapStateToProps' );
    return {
        user: state.user
    }
};

const mapDispatchToProps = dispatch => ( {
    loadLatestUsers: () => dispatch( loadLatestUsers() ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( UsersContainer )
