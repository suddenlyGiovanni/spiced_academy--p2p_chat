export default ( state = {}, action ) => {
    console.log( 'REDUX - REDUCER - Action: ', action );

    if ( action.type == 'LOAD_FRIENDS' ) {
        console.log("THE OLD STATE!!", state);
        state = Object.assign( {}, state, {
            friends: action.friends
        } );
    }

    console.log( 'REDUX - REDUCER - State: ', state );
    return state;
};
