import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { Button } from 'react-bootstrap';
import Avatar from 'components/Avatar';
import Notification from 'components/Notification';
import { UserMenuDetailType } from 'redux/reducers/MenuState';
import { ThemeMode } from './Header';
import { GetInitial } from 'libs/utils';
import { NavLink } from 'react-router-dom';

type AppLogoPropsType = {
    isMobile: boolean;
    ToggleNavbarHandler: () => void;
};

/* logo should have fetch to server */
const AppLogo = (props: AppLogoPropsType) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageLoadedSmall, setImageLoadedSmall] = useState(false);

    const UserState = useSelector((state: { UserState: AppState['UserState'] }) => state.UserState);
    const { company_logo, company_logo_small } = UserState;
    let path = `${process.env.REACT_APP_FILES_PATH}`;

    useEffect(() => {
        if (company_logo !== null && UserState.company_code !== null) {
            if (company_logo.indexOf('http') >= 0 || company_logo.indexOf('https') >= 0) {
                path = company_logo;
            } else {
                path += `${UserState.company_code}/logo/${company_logo}`;
            }
        }

        if (company_logo !== null) {
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

        if (company_logo_small !== null && UserState.company_code !== null) {
            if (company_logo_small.indexOf('http') >= 0 || company_logo_small.indexOf('https') >= 0) {
                path = company_logo_small;
            } else {
                path += `${UserState.company_code}/logo/${company_logo_small}`;
            }
        }

        if (company_logo_small !== null) {
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
                <NavLink
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
                            backgroundImage: UserState.company_logo !== null ? `url(${UserState.company_logo})` : undefined,
                        }}
                    >
                        {!imageLoaded && UserState.company_name}
                    </div>
                    <div
                        id="app-small"
                        className="app-small"
                        style={{
                            backgroundImage: UserState.company_logo_small !== null ? `url(${path})` : undefined,
                        }}
                    >
                        {!imageLoadedSmall && UserState.company_name !== null && GetInitial(UserState.company_name)}
                    </div>
                </NavLink>
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
                    <NavLink
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
                            <div className="avatar-container">
                                <Avatar />
                            </div>
                            <div className="avatar-user-name">{UserState.displayname}</div>
                        </div>
                    </NavLink>
                    <NavLink
                        to="/notification"
                        className="notification"
                        onClick={() => {
                            if (props.isMobile) {
                                props.ToggleNavbarHandler();
                            }
                        }}
                    >
                        <Notification isMobile={props.isMobile} />
                    </NavLink>
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

const Navitem = (props: UserMenuDetailType & NavitemPropsType) => {
    const ChildrenElement: React.ReactNode[] = [];
    if (props.children !== undefined && props.children.length > 0) {
        props.children.forEach((item, index) => {
            if (item.group_name !== null && item.group_name !== '' && item.group_name !== '' && arrGroup.indexOf(item.group_name) < 0) {
                ChildrenElement.push(
                    <div key={`${item.menu_id}-${index}-group`} className="navitem-group">
                        {item.group_name}
                    </div>,
                );
                arrGroup.push(item.group_name);
            }
            if (item.access_only !== 1) {
                ChildrenElement.push(<Navitem key={`${item.menu_id}-${index}`} {...item} isMobile={props.isMobile} ToggleNavbarHandler={props.ToggleNavbarHandler} />);
            }
        });
    }

    const Div = (props: { id: string; children: React.ReactNode }) => (
        <div id={props.id} className="navitem-container pointer" tabIndex={0} onClick={() => OpenChildrenHandler(props.id)}>
            {props.children}
        </div>
    );

    const Container = props.children !== undefined && props.children.length > 0 ? Div : NavLink;

    return (
        <li>
            <Container
                exact
                menu-id={props.menu_id}
                id={props.menu_id}
                to={props.url}
                className="navitem-container"
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    if (props.isMobile) {
                        props.ToggleNavbarHandler();
                    }
                    CloseChildrenHandler(e);
                }}
            >
                <div className="d-flex navitem-string">
                    {props.icon !== null && <i className={`${props.icon} me-2 item-left`}></i>}
                    <div className="item-center">{props.menu_name}</div>
                    {props.children !== undefined && props.children.length > 0 && <i className={`fas fa-chevron-right me-2 item-right`}></i>}
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
    const MenuState = useSelector((state: { MenuState: AppState['MenuState'] }) => state.MenuState);

    if (window.location.pathname === '/printpreview') return <React.Fragment />;

    arrGroup.length = 0;
    return (
        <React.Fragment>
            <div id="navbar-left" className={`navbar-left shadow-sm ${props.isMobile ? 'mobile' : ''}`.trim()}>
                <ul>
                    <AppLogo isMobile={props.isMobile} ToggleNavbarHandler={props.ToggleNavbarHandler} />
                    <AvatarNav UserState={UserState} isMobile={props.isMobile} ToggleNavbarHandler={props.ToggleNavbarHandler} />
                    <hr className="navbar-divider-horizontal my-0" />
                    {MenuState.map((item: UserMenuDetailType, index: number) => {
                        const arrNav: JSX.Element[] = [];
                        if (item.group_name !== null && item.group_name !== '' && arrGroup.indexOf(item.group_name) < 0) {
                            arrNav.push(
                                <div key={`${item.menu_id}-${index}-group`} className="navitem-group">
                                    {item.group_name}
                                </div>,
                            );
                            arrGroup.push(item.group_name);
                        }

                        if (item.access_only !== 1) {
                            arrNav.push(<Navitem key={`${item.menu_id}-${index}`} {...item} isMobile={props.isMobile} ToggleNavbarHandler={props.ToggleNavbarHandler} />);
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
