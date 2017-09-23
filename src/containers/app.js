import React from 'react';
import axios from '../utils/axios';
import { store } from '../shell';
import { persistThisUserDataOnce } from '../actions/actions';
import Logo from '../components/logo';
import ProfilePic from '../components/profilePic';
import ProfilePicUpload from '../components/profilePicUpload';
import { Link } from 'react-router';
import getSocket from '../utils/socketIo';

export default class App extends React.Component {

    constructor( props ) {
        super( props );
        getSocket();
        this.state = {
            uploaderIsVisible: false,
        };
        this.showProfilePicUpload = this.showProfilePicUpload.bind( this );
    }

    // life-cycle method
    componentDidMount() {
        axios.get( '/api/getUserInfo' )

            .then( resp => {
                this.setState( resp.data.userData );
                const user = resp.data.userData
                store.dispatch( persistThisUserDataOnce(  user ) );
                console.log( 'App - fn: componentDidMount - this.state', this.state );
            } )

            .catch( err => {
                this.setState( { error: 'Something went wrong. Please try again!' } );
                console.log( err );
            } );
    }

    showProfilePicUpload( e ) {
        e.stopPropagation();
        console.log( 'App - fn: showProfilePicUpload' );
        this.setState( { uploaderIsVisible: true } );
    }

    hideProfilePicUpload( e ) {
        e.stopPropagation();
        console.log( 'App - fn: hideProfilePicUpload' );
        this.setState( { uploaderIsVisible: false } );
    }

    uploadProfilePic( e ) {
        console.log( 'App - fn: uploadProfilePic' );
        e.stopPropagation();
        const formData = new FormData;
        formData.append( 'file', e.target.files[ 0 ] );

        axios.put( `/api/user/${this.state.uid}/profile_pic`, formData )

            .then( resp => {
                const userData = Object.assign( resp.data.userData, { uploaderIsVisible: false } );
                this.setState( userData );
                console.log( 'App - fn: uploadProfilePic - AXIOS PUT', this.state );
            } )

            .catch( ( err ) => {
                this.setState( { error: 'Something went wrong. Please try again!' } );
                console.log( err );
            } );
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    render() {
        console.log( 'App - RENDER - this.state: ', this.state );

        const {
            uid,
            firstName,
            lastName,
            email,
            bio,
            profilePic
        } = this.state;

        const { error, uploaderIsVisible } = this.state;

        const children = React.cloneElement( this.props.children, {
            uid,
            firstName,
            lastName,
            email,
            bio,
            profilePic
        } );


        if ( !uid ) {
            return <div>Loading....</div>;
        }


        return (
            <div style={{border : 'thin dashed green'}}>
                <header style={{
                    display: 'inline-flex',
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: 'goldenrod'

                }}>
                    <Logo />
                    <nav>
                        <ul>
                            <li><Link to='/'>Home</Link></li>
                            <li><Link to='/online'>Online Users</Link></li>
                            <li><Link to='/chat'>Chat</Link></li>
                            <li><Link to='/friends'>Friends</Link></li>
                            <li><Link to='/logout'>Logout</Link></li>

                        </ul>
                    </nav>

                    <title><h1>App</h1></title>

                    <ProfilePic
                        src={profilePic}
                        alt={firstName + ' ' + lastName}
                        showProfilePicUpload={ (e) => this.showProfilePicUpload(e) }
                    />

                </header>




                {uploaderIsVisible &&
                    <ProfilePicUpload
                        uploadProfilePic={ (e) => this.uploadProfilePic(e) }
                        hideProfilePicUpload={ (e) => this.hideProfilePicUpload(e) }/>
                }


                { error && <div>{ error }</div> }


                {children}


                <footer></footer>
            </div>
        );
    }

}
