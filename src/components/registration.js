import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FormWrapper from '../utils/formWrapper';

const RegistrationForm = ( { handleInput, handleSubmit, error } ) => {
    console.log( 'RegistrationForm - RENDER ' );

    return (
        <div style={{border: 'thin dotted red'}}>

            <h1>Join Us!</h1>
            {error && <div>Something went wrong. Please try again!</div>}
            <form onSubmit={handleSubmit}>

                <label forHtml='firstName'>First Name</label>
                <input id='firstName'
                    type="text"
                    name='firstName'
                    autoComplete="given-name"
                    required
                    onChange={handleInput}>
                </input>
                
                <label forHtml='lastName'>Last Name</label>
                <input
                    id='lastName'
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    required
                    onChange={handleInput}>
                </input>

                <label forHtml='email'>Email</label>
                <input id='email'
                    type="email"
                    name="email"
                    autoComplete="email"
                    required onChange={handleInput}>
                </input>

                <label forHtml='password'>Password</label>
                <input id='password'
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    onChange={handleInput}>
                </input>

                <button type='submit'>Register</button>
            </form>

            <p>Already a member? <Link to='/login'>Log In</Link></p>
        </div>
    );
};


RegistrationForm.propTypes = {
    handleInput: PropTypes.func,
    handleSubmit: PropTypes.func,
    error: PropTypes.string
};

export default FormWrapper( RegistrationForm, '/api/register' );
