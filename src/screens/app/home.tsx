import React, { Suspense, lazy, Component, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { AxiosResponse } from 'axios';
import { get } from 'libs/fetch';
import Header from 'components/Header';
import Navbar from 'components/Navbar';
import LoadingSuspense from 'components/LoadingSuspense';
import Modal from 'components/Modal';
import Page from 'components/Page';

// const Dashboard = lazy(() => import('screens/app/dashboard'));
const Login = lazy(() => import('screens/app/login'));
const ForgotPassword = lazy(() => import('screens/app/forgotpassword'));
const Notification = lazy(() => import('screens/app/notification'));
const PagenotFound = lazy(() => import('screens/app/pagenotfound'));
const Printpreview = lazy(() => import('screens/app/printpreview'));

let interval: number;

type AuthorizedScreenPropsType = {
    CheckToken: () => void;
    SignOutHandler: () => void;
    isMobile: boolean;
};

const CheckTokenInterval = (props: AuthorizedScreenPropsType) => {
    if (interval === undefined) {
        props.CheckToken();
        interval = window.setInterval(() => {
            props.CheckToken();
        }, 14000);
    }
};

const DynamicRouter = () => {
    const AccessState = useSelector((state: { AccessState: AppState['AccessState'] }) => state.AccessState);
    const UserState = useSelector((state: { UserState: AppState['UserState'] }) => state.UserState);
    const { current_app } = UserState;
    const ArrRouterElement: JSX.Element[] = [];

    if (AccessState.length > 0) {
        for (let i = 0; i < AccessState.length; i++) {
            const element = AccessState[i];
            const component = lazy(() =>
                import(`screens/${current_app}${element.pagepath}`).catch((err) => {
                    console.log(err);
                    return {
                        // eslint-disable-next-line react/display-name
                        default: () => (
                            <Page>
                                <div className="pt-4">{`Screen ${element.pagepath} not found`}</div>
                            </Page>
                        ),
                    };
                }),
            );
            ArrRouterElement.push(<Route key={`dynamic-route-${i}`} exact path={element.url} component={component} />);
        }
    }

    return ArrRouterElement;
};

let setRouterTimeout: number;

const AuthorizedScreen = (props: AuthorizedScreenPropsType) => {
    /* add this so DynamicRouter will be fully loaded first */
    const DRouter = DynamicRouter();
    const [router, setRouter] = useState(false);

    useEffect(() => {
        /* do something here */
        CheckTokenInterval(props);
        setRouterTimeout = window.setTimeout(() => {
            if (!router) {
                setRouter(true);
            }
        }, 500);

        return () => {
            window.clearTimeout(setRouterTimeout);
        };
    }, []);

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
            <Navbar ToggleNavbarHandler={() => ToggleNavbarHandler()} SignOutHandler={() => props.SignOutHandler()} isMobile={props.isMobile} />
            <div className="content-container" authorized-screen="true">
                <Header ToggleNavbarHandler={() => ToggleNavbarHandler()} isMobile={props.isMobile} SignOutHandler={() => props.SignOutHandler()} />
                <div id="body" className="body">
                    <Suspense fallback={<LoadingSuspense />}>
                        {router ? (
                            <Switch>
                                {/* <Route exact path="/" component={Dashboard} /> */}
                                {/* {DynamicRouter()} */}
                                {DRouter}
                                <Route exact path="/notification" component={Notification} />
                                <Route exact path="/pagenotfound">
                                    <PagenotFound />
                                </Route>
                                <Route exact path="/printpreview" component={Printpreview} />
                                <Redirect to="/pagenotfound" />
                            </Switch>
                        ) : (
                            <LoadingSuspense />
                        )}
                    </Suspense>
                </div>
            </div>
            <Modal />
        </Router>
    );
};

const NotAuthorizedScreen = () => {
    return (
        <Router>
            <div className="content-container" authorized-screen="false">
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
};

type LocalState = {
    isLoggedIn: boolean | null;
    isMobile: boolean;
};

type HomeProps = MapStateToPropsType & typeof MapDispatch;

class Home extends Component<HomeProps, LocalState> {
    state = {
        isLoggedIn: null,
        isMobile: window.innerWidth <= 480 ? true : false,
    };

    CheckLoginState() {
        const onSuccessPost = (res: AxiosResponse) => {
            if (res) {
                if (res.data) {
                    if (res.data.loginStatus) {
                        this.props.Login(res.data);
                        this.setState((prevState) => {
                            return { ...prevState, isLoggedIn: true };
                        });
                    } else {
                        this.setState((prevState) => {
                            return { ...prevState, isLoggedIn: false };
                        });
                    }
                }
            }
        };

        get('/system/authorization.loginStatus', null, (res) => onSuccessPost(res));
    }

    GetMenu() {
        const onSuccessPost = (res: AxiosResponse) => {
            if (res) {
                // console.log(res);
                if (res.data) {
                    if (res.data.status) {
                        if (res.data.menuData && res.data.menuData.length > 0 && res.data.accessData.length > 0) {
                            const { menuData, accessData } = res.data;
                            // this.props.SETACCESS(accessData);
                            // this.props.SETMENU(menuData);
                            this.props.SetMenuAndAccess(menuData, accessData);
                        }
                    }
                } else {
                    console.error({ code: 'ErrUnknown', data: res.data, message: `Your might have bad data` });
                }
            }
        };

        get('/system/application.getMenu', null, (res) => onSuccessPost(res));
    }

    CheckToken() {
        get(`/system/authorization.checkToken`, null);
    }

    SignOutHandler() {
        const onSuccessPost = (res: AxiosResponse) => {
            if (res) {
                if (res.data) {
                    if (!res.data.loginStatus) {
                        // this.props.Logout();
                        window.location.reload();
                    }
                }
            }
        };

        get('/system/authorization.logout', null, (res) => onSuccessPost(res));
    }

    ResizeHandler() {
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
        this.GetMenu();
        this.CheckLoginState();
        this.SetResizeListener();
    }

    render() {
        let Screen;
        if (this.state.isLoggedIn === null) {
            return null;
        } else {
            if (this.state.isLoggedIn) {
                this.SetThemes();
                Screen = () => <AuthorizedScreen CheckToken={() => this.CheckToken()} isMobile={this.state.isMobile} SignOutHandler={() => this.SignOutHandler()} />;
            } else {
                Screen = () => <NotAuthorizedScreen />;
            }
        }

        return <Screen />;
    }
}

type MapStateToPropsType = {
    UserState: AppState['UserState'];
};

const MapStateToProps = (state: MapStateToPropsType) => ({
    UserState: state.UserState,
});

const MapDispatch = {
    Login: (data: any) => ({ type: 'LOGIN', data }),
    Logout: () => ({ type: 'LOGOUT' }),
    SETMENU: (data: any) => ({ type: 'SETMENU', data }),
    SETACCESS: (data: any) => ({ type: 'SETACCESS', data }),
    SetMenuAndAccess: (menu: any, access: any) => ({ type: 'SETMENUANDACCESS', menu, access }),
};

export default connect(MapStateToProps, MapDispatch)(Home);
