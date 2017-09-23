import React from 'react';
import PropTypes from 'prop-types';

const Welcome = ( props ) => {
    console.log( 'Welcome - RENDER - this.props: ', props );
    return (
        <div style={{ border: 'medium dotted purple' }}>
            <h1>Welcome Component</h1>
            {props.children}
        </div>
    );
};

Welcome.propTypes = { children: PropTypes.element };

export default Welcome;
