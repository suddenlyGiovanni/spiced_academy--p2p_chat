// ROUTE: --> /api
const router = require( 'express' ).Router(),
    db = require( '../modules/dbQuery' ),
    fs = require( 'fs' ),
    path = require( 'path' ),
    multer = require( 'multer' ),
    uidSafe = require( 'uid-safe' ),
    knox = require( 'knox' );


//_ MUTER & UIDSAFE_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
const diskStorage = multer.diskStorage( {
    // path.resolve;
    destination: ( req, file, callback ) => {
        callback( null, `${ path.dirname( __dirname ) }/uploads` );
    },


    filename: ( req, file, callback ) => {
        uidSafe( 24 )
            .then( ( uid ) => {
                callback( null, uid + path.extname( file.originalname ) );
            } );
    }
} );

const uploader = multer( {
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
} );

//_ KNOX_ _ _ _ _ __ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
let secrets;
if ( process.env.NODE_ENV == 'production' ) {
    secrets = process.env;
    // in prod the secrets are environment variables
} else {
    secrets = require( '../config/secrets.json' );
    // secrets.json is in .gitignore
}

const client = knox.createClient( {
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: secrets.AWS_BUCKET
} );

// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// ROOT OF THE API _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
router.get( '/', ( req, res ) => {
    console.log( 'API: ', 'method: GET ', '/api/' );
    res.json( { message: 'api route working fine' } );
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// REGISTER USER _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
router.post( '/register', ( req, res ) => {
    console.log( 'API: ', 'method: POST ', '/api/register' );

    const firstName = req.body.firstName.toLowerCase();
    const lastName = req.body.lastName.toLowerCase();
    const email = req.body.email.toLowerCase();
    const password = req.body.password.toLowerCase();

    if ( firstName && lastName && email && password ) {

        return db.createUser( firstName, lastName, email, password )

            .then( result => {
                if ( result ) {
                    // set the session to be true
                    req.session.user = {
                        uid: result.uid,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        email: result.email
                    };
                    // log user session
                    console.log( 'successfully set the session', req.session.user );

                    res.json( { success: true } );

                } else {

                    res.json( { error: true } );
                }
            } )

            .catch( ( err ) => {
                console.log( err.stack );
            } );
    } else {
        res.json( { error: true } );
    }
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// LOGIN USER_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

router.post( '/login', ( req, res ) => {
    console.log( 'API: method: POST /api/login' );

    const email = req.body.email.toLowerCase();
    const password = req.body.password.toLowerCase();

    if ( email && password ) {

        return db.checkUser( email, password )

            .then( ( resp ) => {

                if ( resp ) {
                    // set the session to be true
                    req.session.user = {
                        uid: resp.uid,
                        // firstName: resp.firstName,
                        // lastName: resp.lastName,
                        // email: resp.email
                    };

                    res.json( { success: true } );

                } else {

                    res.json( { error: true } );
                }
            } )

            .catch( ( err ) => {
                console.log( err.stack );
            } );
    } else {

        res.json( { error: true } );
    }
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// LOGOUT USER _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
router.get( '/logout', ( req, res ) => {
    console.log( 'API: method: POST /api/logout' );
    req.session = null;
    // res.redirect('/welcome');
    return res.json( { success: true } );
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// GET USER DATA _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
router.get( '/user', ( req, res ) => {
    console.log( `API: method: GET /api/user - uid = ${req.session.user.uid}` );

    if ( req.session.user ) {
        return db.readUser( req.session.user.uid )
            .then( userData => res.json( { userData } ) )
            .catch( err => console.error( err.stack ) );
    }
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// SET USER PROFILE PICTURE PROFILE_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
router.put( '/user/profile_pic', uploader.single( 'file' ), ( req, res ) => {
    console.log( 'API: method: PUT /api/user/profile_pic' );
    console.log( req.file );

    if ( req.file ) {
        /*
            You can call the put method of the client you've created to create a request
            object using the data in the file object that multer added to the req.
                *   The first argument to put is the name you want the file to have in
                    the bucket
                *   The second argument is an object with additional parameters.
                    The Content-Type and Content-Length parameters are the headers you
                    want S3 to use when it serves the file. The x-amz-acl parameter
                    tells S3 to serve the file to anybody who requests it
                    (the default is for files to be private)
        */
        const s3Request = client.put( req.file.filename, {
            'Content-Type': req.file.size,
            'Content-Length': req.file.size,
            'x-amz-acl': 'public-read'
        } );
        /*  You can now create a read stream out of the file and pipe it to the
            request you've created.
        */
        const readStream = fs.createReadStream( req.file.path );

        readStream.pipe( s3Request );

        s3Request.on( 'response', ( s3Response ) => {

            const wasSuccessful = s3Response.statusCode == 200;

            if ( wasSuccessful ) {

                const profilePic = req.file.filename;
                const uid = req.session.user.uid;

                return db.saveUserProfilePic( uid, profilePic )

                    .then( userData => {
                        res.json( { success: wasSuccessful, userData } );
                        // remove image from server/uploads
                        fs.unlink( req.file.path, () => {} );
                    } );
            }
        } );
    } else {
        return res.json( { success: false } );
    }

} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// SET USER BIO_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

router.put( '/user/:uid/bio', ( req, res ) => {
    console.log( 'API: ', 'method: PUT ', `/api/user/${req.params.uid}/bio \n` );
    const bio = req.body.bio.toLowerCase();

    return db.saveUserBio( req.params.uid, bio )
        .then( ( userData ) => {
            res.json( {
                success: true,
                userData: userData
            } );
        } )
        .catch( ( err ) => {
            console.error( err.stack );
        } );
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// GET OTHER USER'S DATA _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
router.get( '/user/:uid', ( req, res ) => {
    console.log( `API: method: GET /api/user/${req.params.uid} \n` );

    return db.getOtherUserInfo( req.params.uid )
        .then( otherUserData => res.json( { success: true, otherUserData } ) )
        .catch( err => console.error( err.stack ) );
} );
// _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// GET USERS DATA FROM LATEST 20 TO REGISTER:
router.get( '/users', ( req, res ) => {
    console.log( 'API: method: GET /api/users \n' );
    return db.readLatestUsers()
        .then( latestUsers => {
            // console.log( 'latestUsers: ', latestUsers );
            res.json( { users: latestUsers } );
        } )
        .catch( err => console.error( err.stack ) );
} );




// GET USERS DATA FOR SERCHED USERS:
router.post( '/users/search', ( req, res ) => {
    const search = req.body.search.toLowerCase();
    console.log( 'API: method: GET /api/users/search - search: ', search );
    return db.readSearchedUsers( search )
        .then( searchedUsers => res.json( { users: searchedUsers } ) )
        .catch( err => console.error( err.stack ) );
} );


// ____________________________________________________________________________
// FRIENDSHIP ROUTES:
// C:   CREATE  -   POST    -   /api/friends/:fromUserId/:toUserId   BECOME FRIEND
// R:   READ    -   GET     -   /api/friends/:fromUserId/           SEE ALL USERS'S FRIEND
// U:   UPDATE  -   PUT     -   /api/friends/:fromUserId/:toUserId   UPDATE FRIENDSHIP
// D:   DELETE  -   DELETE  -   /api/friends/:fromUserId/:toUserId   TERMINATE FREINDSHIP




// R:   READ    -   GET     -   /api/friends/:fromUserId/   SEE ALL USERS'S FRIEND
router.get( '/friends', ( req, res ) => {
    const fromUserId = req.session.user.uid;
    console.log( `API: method: GET /api/friends/${fromUserId}` );

    return db.readAllFriends( fromUserId )
        .then( friends => res.json( { friends } ) )
        .catch( err => console.error( err.stack ) );
} );
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// R:   READ    -   GET     -   /api/friends/:fromUserId/:toUserI   SEE FRIENDSHIP STATUS OF TWO USERS
router.get( '/friends/:fromUserId/:toUserId', ( req, res ) => {
    const fromUserId = req.params.fromUserId;
    const toUserId = req.params.toUserId;

    console.log( `API: method: GET /api/friends/${fromUserId}/${toUserId}` );

    return db.readFriendshipStatus( fromUserId, toUserId )

        .then( resp => {

            if ( !resp ) {
                res.json( {
                    success: true,
                    btnAction: 'MAKE FRIEND REQ'
                } );
            } else {
                return res.json( Object.assign( resp, { success: true } ) );
            }
        } )

        .catch( err => console.error( err.stack ) );
} );
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// C:   CREATE  -   POST    -   /api/friends/:fromUserId/:toUserId   && newStatus === 'PENDING'
router.post( '/friends/:fromUserId/:toUserId/new', ( req, res ) => {
    const fromUserId = req.params.fromUserId;
    const toUserId = req.params.toUserId;
    const status = req.body.status;

    console.log( `API: method: POST /api/friends/${fromUserId}/${toUserId}` );
    if ( status === 'PENDING' ) {
        return db.createFriendshipReq( fromUserId, toUserId, status )

            .then( resp => res.json( resp ) )

            .catch( err => console.error( err.stack ) );
    } else {
        res.json( { success: false } );
        throw 'ERROR: WRONG VERB. ONLY PENDING';
    }
} );
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// U:   UPDATE  -   PUT     -   /api/friends/:fromUserId/:toUserId
//  UPDATE FRIENDSHIP { PENDING, ACCEPTED, CANCELED, TERMINATED }
router.put( '/friends/:fromUserId/:toUserId', ( req, res ) => {
    const fromUserId = req.params.fromUserId;
    const toUserId = req.params.toUserId;
    const status = req.body.status;

    console.log( `API: method: PUT /api/friends/${fromUserId}/${toUserId} - status: ${status}` );
    if ( status === 'PENDING' ||
        status === 'ACCEPTED' ||
        status === 'CANCELED' ||
        status === 'TERMINATED' ) {

        console.log('WE ARE IN THIS B!', status, fromUserId, toUserId );

        return db.updateFriendshipStatus( fromUserId, toUserId, status )

            .then( newFriendshipStatus => res.json( { newFriendshipStatus } ) )

            .catch( err => console.error( err.stack ) );
    } else {
        res.json( { success: false } );
        throw 'ERROR: WRONG VERB. ONLY PENDING || ACCEPTED || CANCELED || TERMINATED';
    }

} );
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// D:   DELETE  -   DELETE  -   /api/friends/:fromUserId/:toUserId   TERMINATE FREINDSHIP
router.delete( '/friends/:fromUserId/:toUserId/delete', ( req, res ) => {
    const fromUserId = req.params.fromUserId;
    const toUserId = req.params.toUserId;

    console.log( `API: method: DELETE /api/friends/${fromUserId}/${toUserId}/delete - status: ${status}` );

    return db.deleteFriendship( fromUserId, toUserId )
        .then( resp => res.json( resp ) )
        .catch( err => console.error( err.stack ) );
} );
//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _



/* MODULE EXPORTS */
module.exports = router;
