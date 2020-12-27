import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { MenuAuthStateType } from 'redux/reducers/MenuAuthState';

import Header from 'components/Header';
import { NavbarLeft } from 'components/Navbar';

import LoginScreen from 'screens/LoginScreen';
import PageNotFoundScreen from 'screens/PageNotFoundScreen';
// import AttendanceScreen from 'screens/hris/attendance/AttendanceDataScreen';

import HomeScreen from 'screens/HomeScreen';
import ProfileScreen from 'screens/profile/ProfileScreen';
import axios from 'axios';

type AuthorizedScreenPropsType = {
    GetToken: () => void;
};

let interval: number;
const getTokenInterval = 14000;

const CheckTokenInterval = (props: AuthorizedScreenPropsType) => {
    if (interval === undefined) {
        props.GetToken();
        interval = window.setInterval(() => {
            props.GetToken();
        }, getTokenInterval);
    }
};

const AuthorizedScreen = (props: AuthorizedScreenPropsType) => {
    const currentApp = useSelector((state: any) => state.UserState.current_app);
    const menuAuth: MenuAuthStateType = useSelector((state: any) => state.MenuAuthState);
    let component;

    CheckTokenInterval(props);

    return (
        <BrowserRouter basename={`/${process.env.REACT_APP_SUBDIRECTORY}`}>
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
};

const NotAuthorizedScreen = () => (
    <BrowserRouter basename={`/${process.env.REACT_APP_SUBDIRECTORY}`}>
        <div className="content-container">
            <Switch>
                <Route exact path={`/`} component={LoginScreen} />
                <Route exact path={`/forgotpassword`} component={ProfileScreen} />
                <Redirect to={`/`} />
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
            .get(`${process.env.REACT_APP_API_PATH}/system/application/LoginStatus`, { withCredentials: true })
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
            .get(`${process.env.REACT_APP_API_PATH}/system/application/GetMenuAuth`, { withCredentials: true })
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

    GetToken() {
        axios.get(`${process.env.REACT_APP_API_PATH}/system/application/GetToken`, { withCredentials: true });
    }

    componentDidMount() {
        this.GetMenuAuth();
        this.CheckLoginState();

        // console.log();
        // if (window.location.pathname !== `/${process.env.REACT_APP_SUBDIRECTORY}`) {
        //     if (process.env.REACT_APP_SUBDIRECTORY) {
        //         window.location.href = process.env.REACT_APP_SUBDIRECTORY;
        //     }
        // }
        // window.history.pushState(null, '/admin-template');
    }

    render() {
        if (this.state.loggedIn === null) {
            return null;
        } else {
            if (this.state.loggedIn) {
                return <AuthorizedScreen GetToken={() => this.GetToken()} />;
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

export default connect(MapStateToProps, MapDispatch)(EntryPoint);
