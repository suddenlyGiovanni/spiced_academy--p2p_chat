import { store } from '../shell';
import { sendPeerIdToServer } from '../actions/actions';

let peer;

export default function getPeers() {
    if ( !peer ) {

        peer = new Peer( {
            host: 'localhost',
            port: 8080,
            path: '/peerjs',
            debug: 3
        } );


        // Once the initialization succeeds:
        // Log the ID that allows other user to connect to your session.

        peer.on( 'open', () => {
            console.log( 'PeerJs - client - Event - "open" - id:', peer.id );
            store.dispatch( sendPeerIdToServer( peer.id ) )
                .then( () => peer.connect( peer.id ) );
        } );


        peer.on( 'connection', dataConnection => {
            console.log( 'PeerJs - client - Event - "connection" - dataConnection:', dataConnection );
        } );


        peer.on( 'data', data => {
            console.log( 'PeerJs - client - Event - "data" - data:', data );
        } );

        return peer;

    }
}
