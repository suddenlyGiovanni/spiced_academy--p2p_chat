import { combineReducers } from 'redux';
import FriendsReducers from './reducer-friends';


const allReducers = combineReducers({
    friends: FriendsReducers
});

export default allReducers;
