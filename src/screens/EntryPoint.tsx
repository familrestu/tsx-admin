import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { MenuAuthStateType } from 'redux/reducers/MenuAuthState';

import { AxiosError, AxiosResponse } from 'axios';
import { get } from 'libs/fetch';

import Header from 'components/Header';
import Navbar from 'components/Navbar';
import LoadingSuspense from 'components/LoadingSuspense';

import LoginScreen from 'screens/LoginScreen';
import HomeScreen from 'screens/HomeScreen';

const PageNotFoundScreen = lazy(() => import('screens/PageNotFoundScreen'));
const ForgotPasswordScreen = lazy(() => import('screens/ForgotPasswordScreen'));
const NotificationScreen = lazy(() => import('screens/NotificationScreen'));
const PrintPreviewScreen = lazy(() => import('screens/PrintPreviewScreen'));

type AuthorizedScreenPropsType = {
    GetToken: () => void;
    SignOutHandler: () => void;
    isMobile: boolean;
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
    const MenuAuthState: MenuAuthStateType = useSelector((state: AppState) => state.MenuAuthState);

    CheckTokenInterval(props);

    const ToggleNavbarHandler = () => {
        const navbar = document.getElementById('navbar-left');

        if (navbar !== null) {
            if (navbar.classList.contains('mobile')) {
                navbar.classList.toggle('mobile-opened');
            } else {
                navbar.classList.toggle('closed');
            }
        }
    };

    return (
        <BrowserRouter basename={`/`}>
            {window.location.pathname !== '/printpreview' && <Navbar ToggleNavbarHandler={() => ToggleNavbarHandler()} SignOutHandler={() => props.SignOutHandler()} isMobile={props.isMobile} />}
            <div className="content-container">
                {window.location.pathname !== '/printpreview' && <Header ToggleNavbarHandler={() => ToggleNavbarHandler()} isMobile={props.isMobile} SignOutHandler={() => props.SignOutHandler()} />}
                <div id="body" className="body">
                    <Suspense fallback={<LoadingSuspense />}>
                        <Switch>
                            <Route exact path="/" component={HomeScreen} />

                            {MenuAuthState &&
                                MenuAuthState.map((item, index) => {
                                    let component;

                                    if (item.children === undefined && item.componentPath !== '' && item.componentPath !== null) {
                                        if (item.isGlobal === 'Yes' || item.isGlobal === 1) {
                                            component = lazy(() => import(`../screens${item.componentPath}`));
                                        } else {
                                            component = lazy(() => import(`../screens/${currentApp}${item.componentPath}`));
                                        }

                                        return <Route key={`dynamic-route-${index}`} exact path={item.link} component={component} />;
                                    } else {
                                        const retEl = GetChildrenRoute(item.children, currentApp);

                                        return <React.Fragment key={`dynamic-route-${index}`}>{retEl}</React.Fragment>;
                                    }
                                })}

                            {/* <DynamicRouter MenuAuthState={MenuAuthState} currentApp={currentApp} /> */}

                            <Route path="/notification" component={NotificationScreen} />
                            <Route path="/printpreview" component={PrintPreviewScreen} />
                            <Route path="/pagenotfound" component={PageNotFoundScreen} />
                            <Redirect to="/pagenotfound" />
                        </Switch>
                    </Suspense>
                </div>
            </div>
        </BrowserRouter>
    );
};

/* still error */
const GetChildrenRoute = (children: MenuAuthStateType | undefined, currentApp: string) => {
    const retEl: JSX.Element[] = [];

    if (children) {
        children.forEach((item, index) => {
            let component;

            if (item.children === undefined && item.componentPath !== '' && item.componentPath !== null) {
                if (item.isGlobal === 'Yes' || item.isGlobal === 1) {
                    component = lazy(() => import(`../screens${item.componentPath}`));
                } else {
                    component = lazy(() => import(`../screens/${currentApp}${item.componentPath}`));
                }

                retEl.push(<Route key={`dynamic-route-children-${index}`} exact path={item.link} component={component} />);
            } else {
                const retEl = GetChildrenRoute(item.children, currentApp);

                retEl.push(<React.Fragment key={`dynamic-route-children-${index}`}>{retEl}</React.Fragment>);
            }
        });
    }

    return retEl;
};

const NotAuthorizedScreen = () => (
    <BrowserRouter basename={`/`}>
        <div className="content-container">
            <Suspense fallback={<LoadingSuspense />}>
                <Switch>
                    <Route exact path="/" component={LoginScreen} />
                    <Route exact path="/forgotpassword" component={ForgotPasswordScreen} />
                    <Redirect to="/" />
                </Switch>
            </Suspense>
        </div>
    </BrowserRouter>
);

type LocalState = {
    loggedIn: boolean | null;
    error: boolean;
    isMobile: boolean;
};

class EntryPoint extends React.Component<AppState & typeof MapDispatch, LocalState> {
    state = {
        loggedIn: null,
        error: false,
        isMobile: window.innerWidth <= 480 ? true : false,
    };

    CheckLoginState() {
        const onSuccessPost = (res: AxiosResponse) => {
            if (res) {
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
            }
        };

        const onErrorPost = (err: AxiosError) => {
            this.setState((prevState) => {
                return { ...prevState, loggedIn: false };
            });
            console.log(err);
        };

        get(
            '/system/application/LoginStatus',
            null,
            (res: AxiosResponse) => onSuccessPost(res),
            (err: AxiosError) => onErrorPost(err),
        );
    }

    GetMenuAuth() {
        const onSuccessPost = (res: AxiosResponse) => {
            if (res) {
                if (res.data && res.data.menuData) {
                    const { menuData } = res.data;
                    this.props.SetUserMenu(menuData);
                } else {
                    console.error({ code: 'ErrUnknown', data: res.data, message: `Your might have bad data` });
                }
            }
        };

        const onErrorPost = (err: AxiosError) => {
            console.log(err);
        };

        get(
            '/system/application/GetMenuAuth',
            null,
            (res: AxiosResponse) => onSuccessPost(res),
            (err: AxiosError) => onErrorPost(err),
        );
    }

    GetToken() {
        get(`/system/application/GetToken`, null);
    }

    SignOutHandler() {
        const onSuccessPost = (res: AxiosResponse) => {
            if (res) {
                if (res.data) {
                    if (!res.data.loginStatus) {
                        this.props.Logout();
                        window.location.reload();
                    }
                }
            }
        };

        const onErrorPost = (err: AxiosError) => {
            console.error(err);
        };

        get(
            '/system/application/Logout',
            null,
            (res: AxiosResponse) => onSuccessPost(res),
            (err: AxiosError) => onErrorPost(err),
        );
    }

    ResizeHandler() {
        // console.log('test');
        let isMobile = false;
        if (window.innerWidth <= 480) {
            isMobile = true;
        } else {
            isMobile = false;
        }

        if (this.state.isMobile !== isMobile) {
            this.setState((prevState) => {
                return { ...prevState, isMobile };
            });
        }
    }

    SetResizeListener() {
        window.addEventListener('resize', () => this.ResizeHandler());
    }

    componentDidMount() {
        this.GetMenuAuth();
        this.CheckLoginState();

        this.SetResizeListener();

        /* if (process.env.REACT_APP_SUBDIRECTORY) {
            if (window.location.pathname.indexOf(process.env.REACT_APP_SUBDIRECTORY) < 0) {
                window.history.replaceState(null, 'Ersys', process.env.REACT_APP_SUBDIRECTORY);
            }
        } */
    }

    render() {
        if (this.state.loggedIn === null) {
            return null;
        } else {
            if (this.state.loggedIn) {
                return <AuthorizedScreen GetToken={() => this.GetToken()} isMobile={this.state.isMobile} SignOutHandler={() => this.SignOutHandler()} />;
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
    Logout: () => ({ type: 'LOGOUT' }),
    SetUserMenu: (data: any) => ({ type: 'SETUSERMENU', data }),
};

export default connect(MapStateToProps, MapDispatch)(EntryPoint);
