import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

import Header from 'components/Header';
import { NavbarLeft } from 'components/Navbar';

import LoginScreen from 'screens/LoginScreen';
import PageNotFoundScreen from 'screens/PageNotFoundScreen';
import HomeScreen from 'screens/HomeScreen';
import ProfileScreen from 'screens/profile/ProfileScreen';

const AuthorizedScreen = () => (
    <BrowserRouter>
        <NavbarLeft />
        <div className="content-container">
            <Header />
            <div id="body" className="body">
                <Switch>
                    <Route exact path="/" component={HomeScreen} />
                    <Route exact path="/profile" component={ProfileScreen} />
                    <Route path="/pagenotfound" component={PageNotFoundScreen} />
                    <Redirect to="/pagenotfound" />
                </Switch>
            </div>
        </div>
    </BrowserRouter>
);

const NotAuthorizedScreen = () => (
    <BrowserRouter>
        <div className="content-container">
            <Switch>
                <Route exact path="/" component={LoginScreen} />
                <Route exact path="/forgotpassword" component={ProfileScreen} />
            </Switch>
        </div>
    </BrowserRouter>
);

class EntryPoint extends React.Component<AppState> {
    render() {
        if (this.props.UserState !== undefined && this.props.UserState.loggedIn) {
            return <AuthorizedScreen />;
        } else {
            return <NotAuthorizedScreen />;
        }
    }
}

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

export default connect(MapStateToProps)(EntryPoint);
