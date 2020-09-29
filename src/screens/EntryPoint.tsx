import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

/* import Flex from 'components/Flex';
import View from 'components/View';
import Absolute from 'components/Absolute'; */

import Header from 'components/Header';
import { NavbarLeft } from 'components/Navbar';

import HomeScreen from 'screens/HomeScreen';

class Body extends React.Component {
    render() {
        return (
            <div id="body-container" className="body-container">
                <div className="body">
                    <Switch>
                        <Route exact path="/" component={HomeScreen} />
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
