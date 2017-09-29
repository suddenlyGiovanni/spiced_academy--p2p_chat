import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FormWrapper from '../utils/formWrapper';
// MATERIAL-UI
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const style = { margin: 12 };


const RegistrationForm = ( { handleInput, handleSubmit, error } ) => {
    console.log( 'RegistrationForm - RENDER ' );

    return (
        <div>

            <h1>Register</h1>
            {error && <div>Something went wrong. Please try again!</div>}
            <form onSubmit={handleSubmit}>

                <TextField
                    id='firstName'
                    type="text"
                    name='firstName'
                    autoComplete="given-name"
                    hintText="Hint Text"
                    floatingLabelText="First Name"
                    onChange={handleInput}
                    required
                />
                <br />

                <TextField
                    id='lastName'
                    type="text"
                    name='lastName'
                    autoComplete="family-name"
                    hintText="Hint Text"
                    floatingLabelText="Last Name"
                    onChange={handleInput}
                    required
                />
                <br />


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
                    autoComplete='new-password'
                    hintText='Hint Text'
                    floatingLabelText='password'
                    onChange={handleInput}
                    required
                />
                <br />

                {/* <button type='submit'>Register</button> */}
                <RaisedButton type='submit' label='Register' style={style} />
            </form>

            {/* <p>Already a member? <Link to='/login'>Log In</Link></p> */}
        </div>
    );
};


RegistrationForm.propTypes = {
    handleInput: PropTypes.func,
    handleSubmit: PropTypes.func,
    error: PropTypes.string
};

export default FormWrapper( RegistrationForm, '/api/register' );
