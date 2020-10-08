/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

/* import Flex from 'components/Flex';
import View from 'components/View';
import Absolute from 'components/Absolute'; */

import Header from 'components/Header';
import { NavbarLeft } from 'components/Navbar';

import HomeScreen from 'screens/HomeScreen';
import ProfileScreen from 'screens/profile/ProfileScreen';
import Page from 'components/Page';
// import ReactDOM from 'react-dom';

const NotAuthorized = () => {
    return (
        <Page>
            <h2>Not Authorized</h2>
        </Page>
    );
};

class Body extends React.Component {
    render() {
        return (
            <div id="body-container" className="body-container">
                <div className="body">
                    <Switch>
                        <Route exact path="/" component={HomeScreen} />
                        <Route
                            exact
                            path="/profile"
                            component={ProfileScreen}
                        />
                        <Route
                            path="/notauthorized"
                            component={NotAuthorized}
                        />
                        <Redirect to="/notauthorized" />
                    </Switch>
                </div>
            </div>
        );
    }
}

class EntryPoint extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <NavbarLeft />
                <div className="content-container">
                    <Header />
                    <Body />
                </div>
            </BrowserRouter>
        );
    }
}

export default EntryPoint;
