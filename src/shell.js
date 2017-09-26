// REACT components
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// REDUX components
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
// import allReducers from './reducers';
import reducers from './reducers/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';


// Containers:
import App from './containers/app';
import FriendsContainer from './containers/friends-container';
import ProfileOther from './containers/profileOther';
import ChatChildrenContainer from './containers/chat-children-container';
import ChatListContainer from './containers/chat-list-container';
import ChatPublicContainer from './containers/chat-public-container';
import ChatPrivateContainer from './containers/chat-private-container';
import ChatSecureContainer from './containers/chat-secure-container';
import UsersContainer from './containers/users-container';

// Components
import Welcome from './components/welcome';
import Registration from './components/registration';
import Login from './components/login';
import ProfileSelf from './components/profile-self';

// MATERIAL-UI:
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export const store = createStore( reducers, composeWithDevTools( applyMiddleware( reduxPromise ) ) );

// REACT Router
let router;

if ( location.pathname === '/welcome/' ) {
    console.log( 'Shell: ', location.pathname );
    router = (
        <MuiThemeProvider>
            <Router history={hashHistory}>
                <Route path='/' component={Welcome}>
                    <IndexRoute component={Registration}/>
                    <Route path='/login' component={Login}/>
                </Route>
            </Router>
        </MuiThemeProvider>
    );
} else if ( location.pathname !== '/welcome/' ) {
    console.log( 'Shell: ', location.pathname );
    router = (
        <Provider store={store}>
            <MuiThemeProvider>
                <Router history={browserHistory}>
                    <Route path='/' component={App}>
                        <IndexRoute component={ProfileSelf} />
                        <Route path='friends' component={FriendsContainer} />
                        <Route path='users' component={UsersContainer} />
                        <Route path='user/:uid' component={ProfileOther} />
                        <Route path='chat' component={ChatChildrenContainer}>
                            <IndexRoute component={ChatListContainer} />
                            <Route path='public' component={ChatPublicContainer} />
                            <Route path='private/:otherUid' component={ChatPrivateContainer} />
                            <Route path='secure/:otherUid' component={ChatSecureContainer} />
                        </Route>
                    </Route>
                </Router>
            </MuiThemeProvider>
        </Provider>
    );
}



ReactDOM.render(
    router,
    document.querySelector( 'main' )
);
