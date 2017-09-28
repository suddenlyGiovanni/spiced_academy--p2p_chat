// REQUIRED MODULES_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const express = require( 'express' ),
    // morgan = require( 'morgan' ),
    path = require( 'path' ),
    bodyParser = require( 'body-parser' ),
    cookieSession = require( 'cookie-session' ),
    csrf = require( 'csurf' ),
    compression = require( 'compression' );
// db = require( './modules/dbQuery' );
// favicon = require( 'serve-favicon' );


// EXPRESS
const app = express();

// SOCKETio
const server = require( 'http' ).Server( app );
const io = require( 'socket.io' )( server );
module.exports.io = io;

// PEERJS
const ExpressPeerServer = require( 'peer' ).ExpressPeerServer;
const options = { debug: true };

// MIDDLEWARE __________________________________________________________________

// HTTP request logger middleware
// app.use( morgan( 'dev' ) );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// compression gZip response before sending them
app.use( compression() );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// BODY PARSER
app.use( bodyParser.json() );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// COOKIE SESSION
app.use( cookieSession( {
    secret: require( './config/secrets.json' ).sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
} ) );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


if ( process.env.NODE_ENV != 'production' ) {
    app.use( '/bundle.js', require( 'http-proxy-middleware' )( {
        target: 'http://localhost:8081/'
    } ) );
}


// set the public folder where client stuff lives
// app.use( express.static( './public' ) );
app.use( express.static( path.join( __dirname, '/public' ) ) );


// CSURF
// app.use( csrf() );

app.use( ( req, res, next ) => {
    // res.cookie( '__csrf__', req.csrfToken() );
    next();
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// ROUTING _____________________________________________________________________
//  Connect all our routes to our application
app.use( '/', require( './routes/root' ) );
app.use( '/api/', require( './routes/api' ) );
// load webSocket.js and pass it the socket.io object
app.use( '/ws/', require( './routes/webSocket' ) );


// PEERJS ROUTING
app.use( '/peerjs', ExpressPeerServer( server, options ) );

// if no route match then..
app.get( '*', function ( req, res ) {
    res.sendFile( path.join( __dirname, 'index.html' ) );
} );



// PEERJS EVENTS LISTENING
server.on( 'connection', peer => {
    console.log( 'Peerjs - server - Event - "connection" - id:', peer.id );
} );
server.on( 'disconnect', peer => {
    console.log( 'Peerjs - server - Event - "disconnect" - id:', peer.id );
} );



// ERROR:
// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
} );

app.use( ( err, req, res, next ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

    // render the error page
    res.status( err.status || 500 );
    console.log(err);
    res.send( 'error' );
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// SERVER ______________________________________________________________________
const listener = server.listen( process.env.PORT || 8080, () => {
    console.log( `listening on port ${listener.address().port}.` );
} );
