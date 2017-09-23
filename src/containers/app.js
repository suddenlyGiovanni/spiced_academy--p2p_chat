import React, { Component } from 'react';
import { Link } from 'react-router';
// REDUX
import { connect } from 'react-redux';
// import { store } from '../shell';
import { logOutUser, loadUserData } from '../actions/actions';
// SOCKETIO
import getSocket from '../utils/socketIo';
// UTILS
// import axios from '../utils/axios';
// MY COMPONENTS
import Logo from '../components/logo';
import ProfilePic from '../components/profilePic';
import ProfilePicUpload from '../components/profilePicUpload';

// MATERIAL-UI:
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton'


class App extends Component {

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
        console.log( 'App - fn: componentDidMount - this.props: ', this.props );
        this.props.loadUserData();
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

    handleLogOut() {
        console.log( 'App - fn: handleLogOut' );
        this.props.logOutUser();
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    render() {
        console.log( 'App - RENDER - this.props: ', this.props );

        const {
            uid,
            firstName,
            lastName,
            email,
            bio,
            profilePic
        } = this.props;

        const { error, uploaderIsVisible } = this.state;

        const children = React.cloneElement( this.props.children, {
            uid,
            firstName,
            lastName,
            email,
            bio,
            profilePic
        } );


        const headerStyle = {
            display: 'inline-flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'goldenrod'

        };

        // if ( !this.props.uid ) {
        //     return <div>Loading....</div>;
        // }
        return (
            <div>
                {/* <MuiThemeProvider> */}
                <AppBar
                    title="p2pChat"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    iconElementRight={<FlatButton label="LogOut" />}
                    onRightIconButtonTouchTap={e=>this.handleLogOut()}
                />
                {/* </MuiThemeProvider> */}


                <header style={headerStyle}>
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




                {
                        uploaderIsVisible &&
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
// REDUX - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const mapStateToProps = ( state ) => {
    console.log( 'App - fn: mapStateToProps' );
    return {
        user: state.user
    };
};

const mapDispatchToProps = ( dispatch ) => ( {
    loadUserData: () => dispatch( loadUserData() ),
    logOutUser: () => dispatch( logOutUser() )
} );

export default connect( mapStateToProps, mapDispatchToProps )( App );
