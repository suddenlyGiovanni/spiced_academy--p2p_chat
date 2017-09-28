import { store } from '../shell';
import { sendPeerIdToServer } from '../actions/actions';

export const getPeer = () => {
    const peer = new Peer( {
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
            .then(() => peer.connect(peer.id));
    } );

    return peer;


};

export default getPeer;
