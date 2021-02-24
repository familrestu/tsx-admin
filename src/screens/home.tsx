import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';

import { MenuAuthStateType, MenuAuthStateDetailType } from 'redux/reducers/MenuAuthState';

import { AxiosError, AxiosResponse } from 'axios';
import { get } from 'libs/fetch';

import Header from 'components/Header';
import Navbar from 'components/Navbar';
import LoadingSuspense from 'components/LoadingSuspense';

import Modal from 'components/Modal';
// import Page from 'components/Page';
// import { SetAccess } from 'libs/access';

const Dashboard = lazy(() => import('screens/dashboard'));
const Login = lazy(() => import('screens/login'));

const ForgotPassword = lazy(() => import('screens/forgotpassword'));
const Notification = lazy(() => import('screens/notification'));
const PagenotFound = lazy(() => import('screens/pagenotfound'));
const Printpreview = lazy(() => import('screens/printpreview'));

let interval: number;
const getTokenInterval = 14000;

type AuthorizedScreenPropsType = {
    GetToken: () => void;
    SignOutHandler: () => void;
    isMobile: boolean;
};

const CheckTokenInterval = (props: AuthorizedScreenPropsType) => {
    if (interval === undefined) {
        props.GetToken();
        interval = window.setInterval(() => {
            props.GetToken();
        }, getTokenInterval);
    }
};

const RouterChildren = (menuAuthDetail: MenuAuthStateType & RouteProps) => {
    let ArrayRouter: { componentPath: MenuAuthStateDetailType['componentPath']; link: MenuAuthStateDetailType['link']; isGlobal: MenuAuthStateDetailType['isGlobal'] }[] = [];

    if (menuAuthDetail.length > 1) {
        for (let x = 0; x < menuAuthDetail.length; x++) {
            const element = menuAuthDetail[x];

            if (element.children) {
                /* when have children, call RouterChildren function */
                const tempArray = RouterChildren(element.children);
                ArrayRouter = [...ArrayRouter, ...tempArray];
            } else {
                /* if not have children, push to ArrayRouter */
                ArrayRouter.push({
                    componentPath: element.componentPath,
                    link: element.link,
                    isGlobal: element.isGlobal,
                });
            }
        }
    }

    return ArrayRouter;
};

const DynamicRouter = () => {
    const currentApp = useSelector((state: AppState) => state.UserState.current_app);
    const MenuAuthState: MenuAuthStateType = useSelector((state: AppState) => state.MenuAuthState);
    const ArrRouterElement: JSX.Element[] = [];
    let ArrayRouter: { componentPath: MenuAuthStateDetailType['componentPath']; link: MenuAuthStateDetailType['link']; isGlobal: MenuAuthStateDetailType['isGlobal'] }[] = [];

    if (MenuAuthState.length > 1) {
        for (let x = 0; x < MenuAuthState.length; x++) {
            const element = MenuAuthState[x];

            if (element.children) {
                /* when have children, call RouterChildren function */
                const tempArray = RouterChildren(element.children);
                ArrayRouter = [...ArrayRouter, ...tempArray];
            } else {
                /* if not have children, push to ArrayRouter */
                ArrayRouter.push({
                    componentPath: element.componentPath,
                    link: element.link,
                    isGlobal: element.isGlobal,
                });
            }
        }
    }

    for (let i = 0; i < ArrayRouter.length; i++) {
        const element = ArrayRouter[i];
        let component;

        if (element.isGlobal === 'Yes' || element.isGlobal === 1) {
            component = lazy(() => import(`../screens${element.componentPath}`));
        } else {
            component = lazy(() => import(`../screens/${currentApp}${element.componentPath}`));
        }

        ArrRouterElement.push(<Route key={`dynamic-route-${i}`} exact path={element.link} component={component} />);
    }

    return ArrRouterElement;
};

const AuthorizedScreen = (props: AuthorizedScreenPropsType) => {
    const [SuspenseType, SetSuspense] = useState(localStorage.getItem('pageType') === null ? 'dashboard' : localStorage.getItem('pageType'));
    const dispatch = useDispatch();
    const PageState = useSelector((state: AppState) => state.PageState);
    const MenuAuthState = useSelector((state: AppState) => state.MenuAuthState);
    const url = window.location.pathname;

    // console.log(performance.getEntriesByType('navigation'));
    if (PageState && PageState.path === null) {
        const arrAuth = MenuAuthState.filter((a) => {
            return a.link === url;
        });
        const accessmode = arrAuth.length > 0 ? arrAuth[0].accessmode : 0;
        dispatch({ type: 'OPENPAGE', path: url, accessmode });
    }

    CheckTokenInterval(props);

    const SetSuspenseType = (type: string) => {
        SetSuspense(type);
        localStorage.setItem('pageType', type);
    };

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
        <Router>
            <Navbar
                ToggleNavbarHandler={() => ToggleNavbarHandler()}
                SignOutHandler={() => props.SignOutHandler()}
                isMobile={props.isMobile}
                SetSuspenseType={(type: string) => SetSuspenseType(type)}
            />
            <div className="content-container">
                <Header ToggleNavbarHandler={() => ToggleNavbarHandler()} isMobile={props.isMobile} SignOutHandler={() => props.SignOutHandler()} />
                <div id="body" className="body">
                    <Suspense fallback={<LoadingSuspense SuspenseType={SuspenseType} />}>
                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                            {DynamicRouter()}
                            <Route exact path="/notification" component={Notification} />
                            <Route exact path="/pagenotfound" component={PagenotFound} />
                            <Route exact path="/printpreview" component={Printpreview} />
                            <Redirect to="/pagenotfound" />
                        </Switch>
                    </Suspense>
                </div>
            </div>
            <Modal />
        </Router>
    );
};

const NotAuthorizedScreen = () => (
    <Router>
        <div className="content-container">
            <Suspense fallback={<LoadingSuspense />}>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/forgotpassword" component={ForgotPassword} />
                    <Redirect to="/" />
                </Switch>
            </Suspense>
        </div>
    </Router>
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

    SetThemes() {
        const localStorageTheme = localStorage.getItem('themes');
        document.body.setAttribute('themes', localStorageTheme === null ? 'light' : localStorageTheme);
    }

    componentDidMount() {
        this.GetMenuAuth();
        this.CheckLoginState();

        this.SetResizeListener();
    }

    render() {
        let Screen;
        if (this.state.loggedIn === null) {
            return null;
        } else {
            if (this.state.loggedIn) {
                this.SetThemes();
                Screen = () => <AuthorizedScreen GetToken={() => this.GetToken()} isMobile={this.state.isMobile} SignOutHandler={() => this.SignOutHandler()} />;
            } else {
                Screen = () => <NotAuthorizedScreen />;
            }
        }

        return (
            <React.Fragment>
                <Screen />
            </React.Fragment>
        );
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
