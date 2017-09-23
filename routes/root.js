// ROUTE: --> /
const router = require( 'express' ).Router();
const path = require( 'path' );



// router.get( '/', ( req, res ) => {
//     res.sendFile( path.join( __dirname, '../index.html' ) );
// } );



router.get( '/', function ( req, res ) {
    if ( !req.session.user ) {
        return res.redirect( '/welcome/' );
    }
    res.sendFile( path.join( __dirname, '../index.html' ) );
} );



router.get( '/welcome/', function ( req, res ) {
    if ( req.session.user ) {
        return res.redirect( '/' );
    }
    res.sendFile( path.join( __dirname, '../index.html' ) );
} );



/* MODULE EXPORTS */
module.exports = router;
