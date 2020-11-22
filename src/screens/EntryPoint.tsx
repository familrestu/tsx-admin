import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { MenuAuthStateType } from 'redux/reducers/MenuAuthState';

import Header from 'components/Header';
import { NavbarLeft } from 'components/Navbar';

import LoginScreen from 'screens/LoginScreen';
import PageNotFoundScreen from 'screens/PageNotFoundScreen';
import AttendanceScreen from 'screens/hris/attendance/AttendanceDataScreen';

import HomeScreen from 'screens/HomeScreen';
import ProfileScreen from 'screens/profile/ProfileScreen';
import axios from 'axios';

const AuthorizedScreen = () => {
    const currentApp = useSelector((state: any) => state.UserState.current_app);
    const menuAuth: MenuAuthStateType = useSelector((state: any) => state.MenuAuthState);
    let component;

    return (
        <BrowserRouter>
            <NavbarLeft />
            <div className="content-container">
                <Header />
                <div id="body" className="body">
                    <Switch>
                        <Route exact path="/" component={HomeScreen} />

                        {menuAuth.map((item, index) => {
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
                        })}

                        <Route path="/attendance/attendancedata" exact component={AttendanceScreen} />

                        <Route path="/pagenotfound" component={PageNotFoundScreen} />
                        <Redirect to="/pagenotfound" />
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
};

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
            .post(`${process.env.REACT_APP_API_PATH}/system/global/LoginStatus`, null, { withCredentials: true })
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

    componentDidUpdate() {
        if (this.state.loggedIn) {
            // this.GetMenuAuth();
        }
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
