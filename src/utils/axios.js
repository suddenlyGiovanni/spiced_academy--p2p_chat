import axios from 'axios';

const instance = axios.create( {
    xsrfCookieName: '__csrf__',
    xsrfHeaderName: 'csrf-token'
} );

export default instance;
