import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FormWrapper from '../utils/formWrapper';

const LoginForm = ( { handleInput, handleSubmit, error } ) => {

    console.log( 'LoginForm - RENDER');

    return (
        <div style={{border: 'thin dotted red'}}>
            <h1>Log in</h1>
            { error && <div>Something went wrong. Please try again!</div> }
            <form onSubmit={handleSubmit}>

                <label forHtml='email'>Email</label>
                <input id='email'
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    onChange={handleInput}>
                </input>

                <label forHtml='password'>Password</label>
                <input id='password'
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    onChange={handleInput}>
                </input>

                <button type='submit'>Log In</button>
            </form>
            <p>Not a member? <Link to='/'>Register</Link></p>
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
