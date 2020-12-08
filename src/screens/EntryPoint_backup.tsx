import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect /* useSelector */ } from 'react-redux';
import { AppState } from 'redux/store';
// import { MenuAuthStateType } from 'redux/reducers/MenuAuthState';

import Header from 'components/Header';
import { NavbarLeft } from 'components/Navbar';

import LoginScreen from 'screens/LoginScreen';
import PageNotFoundScreen from 'screens/PageNotFoundScreen';
// import AttendanceScreen from 'screens/hris/attendance/AttendanceDataScreen';

import HomeScreen from 'screens/HomeScreen';
import ProfileScreen from 'screens/profile/ProfileScreen';
import axios from 'axios';

class TempAuthorizedScreen extends Component<AppState & typeof MapDispatch> {
    CheckAuth() {
        axios
            .post(`${process.env.REACT_APP_API_PATH}/system/application/LoginStatus`, null, { withCredentials: true })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        // this.CheckAuth();
    }

    render() {
        const currentApp = this.props.UserState.current_app;
        const menuAuth = this.props.MenuAuthState;
        let component;

        return (
            <BrowserRouter>
                <NavbarLeft />
                <div className="content-container">
                    <Header />
                    <div id="body" className="body">
                        <Switch>
                            <Route exact path="/" component={HomeScreen} />

                            {menuAuth &&
                                menuAuth.map((item, index) => {
                                    try {
                                        if (index > 0) {
                                            if (item.isGlobal === 'Yes' || item.isGlobal === 1) {
                                                // eslint-disable-next-line @typescript-eslint/no-var-requires
                                                component = require(`../screens${item.componentPath}`);
                                                return <Route key={`dynamic-route-${index}`} exact path={item.link} component={component.default} />;
                                            } else {
                                                component = require(`screens/${currentApp}${item.componentPath}`);
                                                return <Route key={`dynamic-route-${index}`} exact path={item.link} component={component.default} />;
                                            }
                                        } else {
                                            return null;
                                        }
                                    } catch (error) {
                                        console.error(error.message);
                                        return null;
                                    }
                                })}

                            <Route path="/pagenotfound" component={PageNotFoundScreen} />
                            <Redirect to="/pagenotfound" />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

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
    state = {
        loggedIn: null,
    };

    CheckLoginState() {
        axios
            .post(`${process.env.REACT_APP_API_PATH}/system/application/LoginStatus`, null, { withCredentials: true })
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

    GetMenuAuth() {
        axios
            .post(`${process.env.REACT_APP_API_PATH}/system/application/GetMenuAuth`, null, { withCredentials: true })
            .then((res) => {
                if (res.data && res.data.menuData) {
                    const { menuData } = res.data;
                    this.props.SetUserMenu(menuData);
                } else {
                    console.error({ code: 'ErrUnknown', data: res.data, message: `Your might have bad data` });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    componentDidMount() {
        this.GetMenuAuth();
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
    SetUserMenu: (data: any) => ({ type: 'SETUSERMENU', data }),
};

const AuthorizedScreen = connect(MapStateToProps, MapDispatch)(TempAuthorizedScreen);

export default connect(MapStateToProps, MapDispatch)(EntryPoint);
