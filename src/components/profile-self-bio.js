import React from 'react';
import PropTypes from 'prop-types';
import axios from '../utils/axios';

export default class ProfileSelfBio extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {
            bio: '',
            editBioIsVisible: false

        };
    }

    componentDidMount() {
        if ( this.props.bio ) {
            this.setState( { bio: this.props.bio } );
        }
    }



    handleInput( e ) {
        this.setState( {
            [ e.target.name ]: e.target.value
        } );
    }

    handleSubmit( e ) {
        e.preventDefault();
        // make POST request to this.url and handle response
        console.log( 'ProfileSelfBio - fn: Axios.put - data: ', this.state );

        axios.put( `/api/user/${this.props.uid}/bio`, this.state )

            .then( resp => {
                const data = resp.data;
                !data.success ?
                    this.setState( { error: true } ) :
                    this.setState( { data, editBioIsVisible: false } );
            } )

            .catch( err => console.error( err.stack ) );
    }

    setBioVisibility( boolean ) {
        console.log( 'fn: editBioIsVisible ' );
        this.setState( { editBioIsVisible: boolean } );
    }


    render() {
        console.log( 'React Component: ProfileSelfBio - RENDER - this.props: ', JSON.stringify( this.props ) );

        const { bio, editBioIsVisible, error } = this.state;
        // const { bio } = this.props;

        // if no bio found..
        const noBioData = (
            <p onClick={ () => this.setBioVisibility(true)}>Add your bio now</p>
        );

        // if bio is found..
        const bioData = (
            <div>
                <label forHtml='bio'>Bio </label>
                <textarea id='bio-2'
                    name="bio"
                    value={bio} disabled />
                <span onClick={ () => this.setBioVisibility(true)}>Edit</span>
            </div>
        );

        // to edit the bio..
        const editBio = (
            <div>
                <form onSubmit={(e)=>this.handleSubmit(e)}>

                    <label forHtml='bio'>Bio </label>
                    <textarea id='bio-2'
                        name="bio"
                        value={bio}
                        onChange={(e)=>this.handleInput(e)}/>

                    { error && <div>Something went wrong. Please try again!</div> }
                    <button type='submit'>Save</button>
                </form>
            </div>
        );

        // what to var to render..
        const bioRender = () => {
            if ( editBioIsVisible ) {
                return editBio;
            } else if ( bio ) {
                return bioData;
            } else {
                return noBioData;
            }
        };

        return (
            <div>{bioRender()}</div>
        );
    }

}


ProfileSelfBio.propTypes = {
    bio: PropTypes.string,
    uid: PropTypes.number
};
