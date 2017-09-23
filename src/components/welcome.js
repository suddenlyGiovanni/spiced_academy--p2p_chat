import React from 'react';
import PropTypes from 'prop-types';
// MATERIAL-UI:
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
    return (
        <MuiThemeProvider>
            <div style={style}>
                {props.children}
            </div>
        </MuiThemeProvider>
    );
};

Welcome.propTypes = { children: PropTypes.element };

export default Welcome;
