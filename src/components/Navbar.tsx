import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { Button } from 'react-bootstrap';
import Avatar from 'components/Avatar';
import Notification from 'components/Notification';
import Navlink from 'components/Navlink';
import { MenuAuthStateDetailType } from 'redux/reducers/MenuAuthState';
import { ThemeMode } from './Header';
import { GetInitial } from 'libs/utils';

type AppLogoPropsType = {
    isMobile: boolean;
    ToggleNavbarHandler: () => void;
};

/* logo should have fetch to server */
const AppLogo = (props: AppLogoPropsType) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageLoadedSmall, setImageLoadedSmall] = useState(false);

    const UserState = useSelector((state: { UserState: AppState['UserState'] }) => state.UserState);
    const { app_logo, app_logo_small } = UserState;
    let path = `${process.env.REACT_APP_FILES_PATH}`;

    useEffect(() => {
        if (app_logo !== null && UserState.app_code !== null) {
            if (app_logo.indexOf('http') >= 0 || app_logo.indexOf('https') >= 0) {
                path = app_logo;
            } else {
                path += `${UserState.app_code}/logo/${app_logo}`;
            }
        }

        if (app_logo !== null) {
            fetch(path)
                .then((res) => {
                    return res.blob();
                })
                .then((image) => {
                    if (image.type.indexOf('image') >= 0) {
                        setImageLoaded(true);
                    }
                });
        }

        if (app_logo_small !== null && UserState.app_code !== null) {
            if (app_logo_small.indexOf('http') >= 0 || app_logo_small.indexOf('https') >= 0) {
                path = app_logo_small;
            } else {
                path += `${UserState.app_code}/logo/${app_logo_small}`;
            }
        }

        if (app_logo_small !== null) {
            fetch(path)
                .then((res) => {
                    return res.blob();
                })
                .then((image) => {
                    if (image.type.indexOf('image') >= 0) {
                        setImageLoadedSmall(true);
                    }
                });
        }
    }, []);

    return (
        <li>
            <div id="app-nav-container" className="app-nav-container pointer">
                <Navlink
                    to="/"
                    onClick={() => {
                        if (props.isMobile) {
                            props.ToggleNavbarHandler();
                        }
                    }}
                >
                    <div
                        id="app"
                        className="app"
                        style={{
                            backgroundImage: UserState.app_logo !== null ? `url(${UserState.app_logo})` : undefined,
                        }}
                    >
                        {!imageLoaded && UserState.app_name}
                    </div>
                    <div
                        id="app-small"
                        className="app-small"
                        style={{
                            backgroundImage: UserState.app_logo_small !== null ? `url(${path})` : undefined,
                        }}
                    >
                        {!imageLoadedSmall && UserState.app_name !== null && GetInitial(UserState.app_name)}
                    </div>
                </Navlink>
                {props.isMobile && (
                    <Button onClick={props.ToggleNavbarHandler}>
                        <i className="fas fa-bars" />
                    </Button>
                )}
            </div>
        </li>
    );
};

const AvatarNav = (props: { isMobile: boolean; UserState: any; ToggleNavbarHandler: () => void }) => {
    const UserState = useSelector((state: { UserState: AppState['UserState'] }) => state.UserState);
    if (props.isMobile) {
        return (
            <React.Fragment>
                <hr className="navbar-divider-horizontal my-0" />
                <li className="d-flex avatar-group">
                    <Navlink
                        to={{
                            pathname: '/profile',
                            state: {
                                tab: '/profile/personal-information',
                            },
                        }}
                        onClick={() => {
                            if (props.isMobile) {
                                props.ToggleNavbarHandler();
                            }
                        }}
                    >
                        <div className="navitem-group navitem-avatar-container">
                            <Avatar />
                            <div className="avatar-user-name">{UserState.full_name}</div>
                        </div>
                    </Navlink>
                    <Navlink
                        to="/notification"
                        className="notification"
                        onClick={() => {
                            if (props.isMobile) {
                                props.ToggleNavbarHandler();
                            }
                        }}
                    >
                        <Notification isMobile={props.isMobile} />
                    </Navlink>
                </li>
            </React.Fragment>
        );
    } else {
        return <React.Fragment />;
    }
};

const OpenChildrenHandler = (id: string) => {
    const target = document.getElementById(id);
    const bodyBottomPosition = document.body.getBoundingClientRect().bottom;

    if (typeof target !== 'undefined' && target !== null) {
        target.focus();
        const targetNextSibling = target.nextElementSibling as HTMLUListElement;
        if (target.classList.contains('open')) {
            target.classList.add('closing');

            setTimeout(() => {
                target.classList.remove('open');
                target.classList.remove('closing');
                targetNextSibling.removeAttribute('style');
            }, 100);
        } else {
            targetNextSibling.style.display = 'block';
            setTimeout(() => {
                target.classList.add('open');
            }, 100);

            const targetSiblingBottomPosition = targetNextSibling.getBoundingClientRect().bottom;
            const targetHeight = (target.nextElementSibling as HTMLUListElement).offsetHeight;

            if (targetSiblingBottomPosition + targetHeight > bodyBottomPosition) {
                targetNextSibling.style.top = ((targetSiblingBottomPosition - bodyBottomPosition + 16) * -1).toString() + 'px';
            }
        }
    }
};

const CloseChildrenHandler = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const navbarActive = document.querySelectorAll('.navbar-left .open');
    if (navbarActive.length) {
        const nextSibling = (event.target as HTMLDivElement).nextSibling as HTMLDivElement;
        const haveSibling = nextSibling !== null;

        if (haveSibling && nextSibling.classList.value.indexOf('navitem-children-parent') >= 0) return false;
        const WaitLoop = () => {
            return new Promise((resolve) => {
                for (let i = 0; i < navbarActive.length; i++) {
                    const element = navbarActive[i];
                    element.classList.add('closing');

                    setTimeout(() => {
                        element.classList.remove('open');
                        element.classList.remove('closing');

                        const elementSibling = element.nextElementSibling;
                        if (elementSibling !== null) {
                            elementSibling.removeAttribute('style');
                        }

                        if (i === navbarActive.length) {
                            resolve('Done');
                        }
                    }, 100);
                }
            });
        };

        await WaitLoop();
    }
};

type NavitemPropsType = {
    isMobile: boolean;
    ToggleNavbarHandler: () => void;
};

const arrGroup: string[] = [];

const Navitem = (props: MenuAuthStateDetailType & NavitemPropsType) => {
    const ChildrenElement: React.ReactNode[] = [];
    if (props.children !== undefined && props.children.length > 0) {
        props.children.forEach((item, index) => {
            if (item.group !== null && arrGroup.indexOf(item.group) < 0 && (item.isMenu === 1 || item.isMenu === 'Yes')) {
                ChildrenElement.push(
                    <div key={`${item.id}-${index}-group`} className="navitem-group">
                        {item.group}
                    </div>,
                );
                arrGroup.push(item.group);
            }
            if (item.isMenu === 1 || item.isMenu === 'Yes') {
                ChildrenElement.push(<Navitem key={`${item.id}-${index}`} {...item} isMobile={props.isMobile} ToggleNavbarHandler={props.ToggleNavbarHandler} />);
            }
        });
    }

    const Div = (props: { id: string; children: React.ReactNode }) => (
        <div id={props.id} className="navitem-container pointer" tabIndex={0} onClick={() => OpenChildrenHandler(props.id)}>
            {props.children}
        </div>
    );

    const Container = props.children !== undefined && props.children.length > 0 ? Div : Navlink;

    return (
        <li>
            <Container
                exact
                to={props.link}
                id={props.id}
                className="navitem-container"
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    if (props.isMobile) {
                        props.ToggleNavbarHandler();
                    }
                    CloseChildrenHandler(e);
                }}
            >
                <div className="d-flex navitem-string">
                    {props.icon !== null && <i className={`${props.icon} mr-2 item-left`}></i>}
                    <div className="item-center">{props.name}</div>
                    {props.children !== undefined && props.children.length > 0 && <i className={`fas fa-chevron-right mr-2 item-right`}></i>}
                </div>
            </Container>
            {props.children !== undefined && props.children.length > 0 && <ul className="navitem-children-parent shadow">{ChildrenElement}</ul>}
        </li>
    );
};

type NavbarPropsType = {
    ToggleNavbarHandler: () => void;
    SignOutHandler: () => void;
    isMobile: boolean;
};

const Navbar = (props: NavbarPropsType) => {
    const UserState = useSelector((state: { UserState: AppState['UserState'] }) => state.UserState);
    const MenuAuthState = useSelector((state: { MenuAuthState: AppState['MenuAuthState'] }) => state.MenuAuthState);

    if (window.location.pathname === '/printpreview') return <React.Fragment />;

    arrGroup.length = 0;
    return (
        <React.Fragment>
            <div id="navbar-left" className={`navbar-left shadow-sm ${props.isMobile ? 'mobile' : ''}`.trim()}>
                <ul>
                    <AppLogo isMobile={props.isMobile} ToggleNavbarHandler={props.ToggleNavbarHandler} />
                    <AvatarNav UserState={UserState} isMobile={props.isMobile} ToggleNavbarHandler={props.ToggleNavbarHandler} />
                    <hr className="navbar-divider-horizontal my-0" />
                    {MenuAuthState.map((item, index) => {
                        const arrNav: JSX.Element[] = [];
                        if (item.group !== null && arrGroup.indexOf(item.group) < 0 && (item.isMenu === 1 || item.isMenu === 'Yes')) {
                            arrNav.push(
                                <div key={`${item.id}-${index}-group`} className="navitem-group">
                                    {item.group}
                                </div>,
                            );
                            arrGroup.push(item.group);
                        }

                        if (item.isMenu === 1 || item.isMenu === 'Yes' || item.id === 'dashboard') {
                            arrNav.push(<Navitem key={`${item.id}-${index}`} {...item} isMobile={props.isMobile} ToggleNavbarHandler={props.ToggleNavbarHandler} pageType={item.pageType} />);
                        }

                        return arrNav;
                    })}
                    {props.isMobile && (
                        <React.Fragment>
                            <hr className="navbar-divider-horizontal my-0" />
                            <li>
                                <div className="navitem-container" style={{ paddingBottom: 0 }}>
                                    <div className="d-flex navitem-string align-items-center">
                                        <div className="item-center" style={{ width: 'min-content', flex: 'unset', marginRight: '1rem' }}>
                                            Theme
                                        </div>
                                        <ThemeMode />
                                    </div>
                                </div>
                            </li>
                            <li onClick={() => props.SignOutHandler()}>
                                <div className="navitem-container">
                                    <div className="d-flex navitem-string">
                                        <div className="item-center">Sign out</div>
                                    </div>
                                </div>
                            </li>
                        </React.Fragment>
                    )}
                </ul>
            </div>
            {props.isMobile && <div className="navbar-left-overlay" onClick={props.ToggleNavbarHandler} />}
        </React.Fragment>
    );
};

export default Navbar;
