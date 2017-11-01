import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FormWrapper from '../utils/formWrapper';
// MATERIAL-UI
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const style = { margin: 12 };

const LoginForm = ( { handleInput, handleSubmit, error } ) => {

    console.log( 'LoginForm - RENDER');

    return (
        <div>
            <h1>Log in</h1>
            { error && <div>Something went wrong. Please try again!</div> }
            <form onSubmit={handleSubmit}>


                <TextField
                    id='email'
                    type='email'
                    name='email'
                    autoComplete='email'
                    hintText='Hint Text'
                    floatingLabelText='email'
                    onChange={handleInput}
                    required
                />
                <br />


                <TextField
                    id='password'
                    type='password'
                    name='password'
                    autoComplete='current-password'
                    hintText='Hint Text'
                    floatingLabelText='password'
                    onChange={handleInput}
                    required
                />
                <br />

                {/* <button type='submit'>Log In</button> */}
                <RaisedButton type='submit' label='Log In' style={style} />

            </form>
            {/* <p>Not a member? <Link to='/'>Register</Link></p> */}
        </div>
    );
};


LoginForm.propTypes = {
    handleInput : PropTypes.func,
    handleSubmit: PropTypes.func,
    error: PropTypes.bool,
    // success: PropTypes.bool
};

export default FormWrapper(LoginForm, '/api/login');
