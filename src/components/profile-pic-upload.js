import React from 'react';

export default class ProfilePicUpload extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {
            hover: false
        };
        this.toggleHover = this.toggleHover.bind( this );
    }


    toggleHover() {
        this.setState( { hover: !this.state.hover } );
    }

    render() {
        console.log( 'ProfilePicUpload - RENDER - this.prop: ', this.prop );

        const {
            hideProfilePicUpload,
            uploadProfilePic
        } = this.props;

        const modalStyle = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999',
            background: '#fff'
        };

        const backdropStyle = {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: '0px',
            left: '0px',
            zIndex: '9998',
            background: 'rgba(0, 0, 0, 0.3)'
        };

        const inputStyle = {
            width: '0.1px',
            height: '0.1px',
            opacity: '0',
            overflow: 'hidden',
            position: 'absolute',
            zIndex: '-1'
        };

        let labelStyle;

        if ( this.state.hover ) {
            labelStyle = {
                fontSize: '1.25em',
                fontWeight: '700',
                color: 'white',
                backgroundColor: 'red',
                display: 'inline-block',
                cursor: 'pointer'
            };
        } else {
            labelStyle = {
                fontSize: '1.25em',
                fontWeight: '700',
                color: 'white',
                backgroundColor: 'black',
                display: 'inline-block',
                cursor: 'pointer'
            };
        }

        return (

            <div>

                <div>

                    <div style={modalStyle}>
                        <h4>ProfilePicUploader</h4>

                        <label htmlFor='profilePic'
                            style={labelStyle}
                            onMouseEnter={this.toggleHover}
                            onMouseLeave={this.toggleHover}>Profile Picture</label>
                        <input
                            id='profilePic'
                            type="file"
                            name="profilePic"
                            required
                            onChange={uploadProfilePic}
                            style={inputStyle}/>

                        <p><button onClick={hideProfilePicUpload}>Close</button></p>
                    </div>

                </div>

                <div style={backdropStyle} onClick={hideProfilePicUpload} />

            </div>
        );
    }
}
