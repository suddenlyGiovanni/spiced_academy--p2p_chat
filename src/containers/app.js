// REACT
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

// REDUX
import { connect } from 'react-redux';
import { logOutUser, updateProfilePic, loadUserData } from '../actions/actions';

// SOCKETIO
import getSocket from '../utils/socketIo';

// MATERIAL-UI:
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';


// MY COMPONENTS
import Logo from '../components/logo';
import ProfilePic from '../components/profile-pic';
import ProfilePicUpload from '../components/profile-pic-upload';


class App extends Component {

    constructor( props ) {
        super( props );
        getSocket();
        this.state = {
            uploaderIsVisible: false,
            open: false
        };
        this.showProfilePicUpload = this.showProfilePicUpload.bind( this );
    }

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
        this.props.updateProfilePic( formData );
    }

    handleLogOut() {
        console.log( 'App - fn: handleLogOut' );
        this.props.logOutUser();
    }

    handleTouchTitle() {
        console.log( 'App - fn: handleTouchTitle' );
        browserHistory.push( '/' );
    }


    // DRAWER:
    handleToggle() {
        this.setState( { open: !this.state.open } );
    }

    handleClose() {
        this.setState( { open: false } );
    }


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    render() {
        console.log( 'App - RENDER - this.props: ', this.props );



        const { error, uploaderIsVisible } = this.state;


        const headerStyle = {
            display: 'inline-flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'goldenrod'

        };
        const titleStyle = { cursor: 'pointer' };

        if ( !this.props.user ) {
            return null;
        }

        const {
            uid,
            firstName,
            lastName,
            email,
            bio,
            profilePic
        } = this.props.user;

        return (
            <div>
                <AppBar
                    title={<span style={titleStyle}>p2pChat</span>}
                    onTitleTouchTap={ () => this.handleTouchTitle() }
                    iconClassNameRight='muidocs-icon-navigation-expand-more'
                    iconElementRight={<FlatButton label="LogOut" />}
                    onRightIconButtonTouchTap={ () => this.handleLogOut() }
                    onLeftIconButtonTouchTap={ () => this.handleToggle() }
                />

                <Drawer
                    docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={ open => this.setState( { open } )}>
                </Drawer>


                <header style={headerStyle}>
                    <Logo />
                    <nav>
                        <ul>
                            <li><Link to='/online'>Online Users</Link></li>
                            <li><Link to='/chat'>Chat</Link></li>
                            <li><Link to='/friends'>Friends</Link></li>
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


                {this.props.children}


                <footer></footer>

            </div>
        );
    }

}
// REDUX - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const mapStateToProps = ( state ) => {
    console.log( 'App - fn: mapStateToProps' );
    return { user: state.user };
};

const mapDispatchToProps = ( dispatch ) => ( {
    loadUserData: () => dispatch( loadUserData() ),
    logOutUser: () => dispatch( logOutUser() ),
    updateProfilePic: ( formData ) => dispatch( updateProfilePic( formData ) )
} );

export default connect( mapStateToProps, mapDispatchToProps )( App );
