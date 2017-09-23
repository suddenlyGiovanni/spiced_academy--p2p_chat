const bcrypt = require( 'bcryptjs' );

const salt = process.env.BCRYPTSALT || require( '../config/secrets.json' ).bcryptSalt;

function hashPassword( plainTextPassword ) {
    return new Promise( function ( resolve, reject ) {
        bcrypt.genSalt( function ( err, salt ) {
            if ( err ) {
                return reject( err );
            }
            bcrypt.hash( plainTextPassword, salt, function ( err, hash ) {
                if ( err ) {
                    return reject( err );
                }
                resolve( hash );
            } );
        } );
    } );
}

function checkPassword( textEnteredInLoginForm, hashedPasswordFromDatabase ) {
    return new Promise( function ( resolve, reject ) {
        bcrypt.compare( textEnteredInLoginForm, hashedPasswordFromDatabase, function ( err, doesMatch ) {
            if ( err ) {
                reject( err );
            } else {
                resolve( doesMatch );
            }
        } );
    } );
}

module.exports.hashPassword = hashPassword;
module.exports.checkPassword = checkPassword;
