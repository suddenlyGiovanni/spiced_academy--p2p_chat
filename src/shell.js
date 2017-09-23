// REACT components
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';

// REDUX components
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
// import allReducers from './reducers';
import reducers from './reducers/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

// MY Components:

// Containers:
import App from './containers/app';
import FriendsContainer from './containers/friendsContainer';
import ProfileOther from './containers/profileOther';
import ChatChildrenContainer from './containers/chat-children-container';
import ChatListContainer from './containers/chat-list-container';
import ChatPublicContainer from './containers/chat-public-container';
import ChatPrivateContainer from './containers/chat-private-container';
import OnlineUsersContainer from './containers/onlineUsersContainer';

// Components
import Welcome from './components/welcome';
import Registration from './components/registration';
import Login from './components/login';
import ProfileSelf from './components/profileSelf';


export const store = createStore( reducers, composeWithDevTools( applyMiddleware( reduxPromise ) ) );

// REACT Router
let router;

if ( location.pathname === '/welcome/' ) {
    console.log( 'Shell: ', location.pathname );
    router = (
        <Router history={hashHistory}>
            <Route path='/' component={Welcome}>
                <IndexRoute component={Registration}/>
                <Route path='/login' component={Login}/>
            </Route>
        </Router>
    );
} else if ( location.pathname !== '/welcome/' ) {
    console.log( 'Shell: ', location.pathname );
    router = (
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path='/' component={App}>
                    <IndexRoute component={ProfileSelf} />
                    <Route path='friends' component={FriendsContainer} />
                    <Route path='user/:uid' component={ProfileOther} />
                    <Route path='online' component={OnlineUsersContainer} />
                    <Route path='chat' component={ChatChildrenContainer}>
                        <IndexRoute component={ChatListContainer} />
                        <Route path='public' component={ChatPublicContainer} />
                        <Route path='private/:otherUid' component={ChatPrivateContainer} />
                    </Route>
                </Route>
            </Router>
        </Provider>
    );
}



ReactDOM.render(
    router,
    document.querySelector( 'main' )
);
