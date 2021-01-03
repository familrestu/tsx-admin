import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { MenuAuthStateType } from 'redux/reducers/MenuAuthState';
import axios from 'axios';

import Header from 'components/Header';
import { NavbarLeft } from 'components/Navbar';
import LoadingSuspense from 'components/LoadingSuspense';

// import LoginScreen from 'screens/LoginScreen';
// import PageNotFoundScreen from 'screens/PageNotFoundScreen';
// import HomeScreen from 'screens/HomeScreen';
// import ProfileScreen from 'screens/profile/ProfileScreen';

const LoginScreen = lazy(() => import('screens/LoginScreen'));
const PageNotFoundScreen = lazy(() => import('screens/PageNotFoundScreen'));
const HomeScreen = lazy(() => import('screens/HomeScreen'));
const ProfileScreen = lazy(() => import('screens/profile/ProfileScreen'));

type AuthorizedScreenPropsType = {
    GetToken: () => void;
    isError: boolean;
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

    /* if error / page is not exists */
    if (props.isError) {
        window.location.href = `/${process.env.REACT_APP_SUBDIRECTORY}/pagenotfound`;
    }

    return (
        <BrowserRouter basename={`/${process.env.REACT_APP_SUBDIRECTORY}`}>
            <NavbarLeft />
            <div className="content-container">
                <Header />
                <div id="body" className="body">
                    <Suspense fallback={<LoadingSuspense />}>
                        <Switch>
                            <Route exact path="/" component={HomeScreen} />

                            {menuAuth &&
                                menuAuth.map((item, index) => {
                                    try {
                                        if (index > 0) {
                                            if (item.isGlobal === 'Yes' || item.isGlobal === 1) {
                                                component = lazy(() => import(`../screens${item.componentPath}`));
                                                return <Route key={`dynamic-route-${index}`} exact path={item.link} component={component} />;
                                            } else {
                                                component = lazy(() => import(`screens/${currentApp}${item.componentPath}`));
                                                return <Route key={`dynamic-route-${index}`} exact path={item.link} component={component} />;
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
                    </Suspense>
                </div>
            </div>
        </BrowserRouter>
    );
};

const NotAuthorizedScreen = () => (
    <BrowserRouter basename={`/${process.env.REACT_APP_SUBDIRECTORY}`}>
        <div className="content-container">
            <Suspense fallback={<LoadingSuspense />}>
                <Switch>
                    <Route exact path={`/`} component={LoginScreen} />
                    <Route exact path={`/forgotpassword`} component={ProfileScreen} />
                    <Redirect to={`/`} />
                </Switch>
            </Suspense>
        </div>
    </BrowserRouter>
);

type LocalState = {
    loggedIn: boolean | null;
    error: boolean;
};

class EntryPoint extends React.Component<AppState & typeof MapDispatch, LocalState> {
    state = {
        loggedIn: null,
        error: false,
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

    // SetDocumentListener() {
    /*  */
    // }

    componentDidMount() {
        this.GetMenuAuth();
        this.CheckLoginState();

        // this.SetDocumentListener();
    }

    static getDerivedStateFromError() {
        return { error: true };
    }

    componentDidCatch() {
        console.log('error');
    }

    render() {
        if (this.state.loggedIn === null) {
            return null;
        } else {
            if (this.state.loggedIn) {
                return <AuthorizedScreen GetToken={() => this.GetToken()} isError={this.state.error} />;
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
