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
import axios from 'axios';

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
                <Redirect to="/" />
            </Switch>
        </div>
    </BrowserRouter>
);

type LocalState = {
    loggedIn: boolean | null;
};

class EntryPoint extends React.Component<AppState & typeof MapDispatch, LocalState> {
    /* constructor(props: any) {
        super(props);
        this.CheckLoginState();
    } */

    state = {
        loggedIn: null,
    };

    CheckLoginState() {
        axios
            .post(`${process.env.REACT_APP_API_PATH}/system/core/loginStatus`, null, { withCredentials: true })
            .then((res) => {
                if (res.data) {
                    if (res.data.loginStatus) {
                        this.props.Login(res.data);
                        this.setState((prevState) => {
                            return { ...prevState, loggedIn: true };
                        });
                    } else {
                        this.setState((prevState) => {
                            return { ...prevState, loggedIn: false };
                        });
                    }
                }
            })
            .catch(() => {
                this.setState((prevState) => {
                    return { ...prevState, loggedIn: false };
                });
            });
    }

    componentDidMount() {
        this.CheckLoginState();
    }

    render() {
        if (this.state.loggedIn === null) {
            return null;
        } else {
            if (this.state.loggedIn) {
                return <AuthorizedScreen />;
            } else {
                return <NotAuthorizedScreen />;
            }
        }
    }
}

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

const MapDispatch = {
    Login: (data: any) => ({ type: 'LOGIN', data }),
};

export default connect(MapStateToProps, MapDispatch)(EntryPoint);
