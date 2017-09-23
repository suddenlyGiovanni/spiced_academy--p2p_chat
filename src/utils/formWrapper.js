import React from 'react';
import axios from './axios';

export default ( Component, url ) => {

    return class AuthForm extends React.Component {

        constructor( props ) {
            super( props );
            this.state = {};
            this.url = url;
        }

        handleInput( e ) {
            // gather value from changed form field
            this.setState( { [ e.target.name ]: e.target.value } );
        }

        handleSubmit( e ) {
            e.preventDefault();
            // make POST request to this.url and handle response
            axios.post( this.url, this.state )
                .then( resp => {
                    const data = resp.data;
                    // console.log( 'formWrapper - fn: Axios.post - data: ', data );
                    if ( !data.success ) {
                        this.setState( { error: true } );
                    }

                    // else {
                    //     this.setState({ success: true });
                    // }

                    location.replace( '/' );
                } )

                .catch( err => {
                    console.error( err.stack );
                    this.setState( { error: true } );
                } );
        }

        render() {
            return (
                <Component
                    error={this.state.error}
                    handleInput={(e)=>this.handleInput(e)}
                    handleSubmit={(e)=>this.handleSubmit(e)}/>
            );
        }
    };
};
