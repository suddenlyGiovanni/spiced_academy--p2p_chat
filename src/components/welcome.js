import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

// MATERIAL-UI:
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const style = {
    flex: '0 0 auto',
    color: 'rgba(255, 255, 255, 1)',
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196f3'
};

const Welcome = ( props ) => {
    console.log( 'Welcome - RENDER - this.props: ', props );
    let action;
    let url;
    props.location.pathname === '/' ?
        ( action = 'login' ) && ( url = 'login' ) :
        ( action = 'register' ) && ( url = '' );
    return (
        <div>
            <AppBar
                title="p2pChat"
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                iconElementRight={
                    <Link to={`/${url}`}>
                        <FlatButton label={action}/>
                    </Link>}
            />
            <div style={style}>{props.children}</div>
        </div>
    );
};

Welcome.propTypes = { children: PropTypes.element };

export default Welcome;
