import React from 'react';

export default class Modal extends React.Component {

    constructor( props ) {
        super( props );
    }

    close( e ) {
        e.preventDefault();

        if ( this.props.onClose ) {
            this.props.onClose();
        }
    }

    render() {

        if ( this.props.isOpen === false ) {
            return null;
        }

        let modalStyle = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999',
            background: '#fff'
        };

        let backdropStyle = {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: '0px',
            left: '0px',
            zIndex: '9998',
            background: 'rgba(0, 0, 0, 0.3)'
        };

        return (
            <div className={this.props.containerClassName}>

                <div className={this.props.className}
                    style={modalStyle}>

                    {/* other components will live hear! */}
                    {this.props.children}

                </div>

                {!this.props.noBackdrop &&

                    <div className={this.props.backdropClassName}
                        style={backdropStyle}
                        onClick={e => this.close(e)}>
                    </div>}
            </div>
        );
    }

}
