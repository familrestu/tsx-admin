import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import SimpleBar from 'simplebar-react';

import { DividerHorizontal } from 'components/Divider';
import { AvatarImage } from 'components/Avatar';
import { Button } from 'react-bootstrap';
import Icon from 'components/Icon';
import Notification from 'components/Notification';

import { MenuAuthStateDetailType } from 'redux/reducers/MenuAuthState';

type AppLogoPropsType = {
    isMobile: boolean;
    ToggleNavbarHandler: () => void;
};

type AppDetailsType = {
    name: string;
    name_short: string;
    app_id: number;
    app_code: string;
    app_logo: string | null;
    app_logo_small: string | null;
};

const AppLogoDetails: AppDetailsType = {
    name: 'Ersys Admin',
    name_short: 'EA',
    app_id: 1,
    app_code: 'EA',
    app_logo: null,
    app_logo_small: null,
};

/* logo should have fetch to server */
class AppLogo extends React.Component<AppLogoPropsType & AppDetailsType> {
    render() {
        const imgUrl = '';

        return (
            <li>
                <div id="app-nav-container" className="app-nav-container pointer">
                    <NavLink
                        to="/"
                        onClick={() => {
                            if (this.props.isMobile) {
                                this.props.ToggleNavbarHandler();
                            }
                        }}
                    >
                        <div id="app" className="app">
                            {this.props.app_logo !== null ? <img src={`${imgUrl}/${this.props.app_logo}`} alt={this.props.name} /> : this.props.name}
                        </div>
                        <div id="app-small" className="app-small">
                            {this.props.app_logo_small !== null ? <img src={`${imgUrl}/${this.props.app_logo_small}`} alt={this.props.name} /> : this.props.name_short}
                        </div>
                    </NavLink>
                    {this.props.isMobile && (
                        <Button onClick={this.props.ToggleNavbarHandler}>
                            <Icon name="fas fa-bars" />
                        </Button>
                    )}
                </div>
            </li>
        );
    }
}

const AvatarNav = (props: { isMobile: boolean; UserState: any; ToggleNavbarHandler: () => void }) => {
    if (props.isMobile) {
        return (
            <React.Fragment>
                <DividerHorizontal />
                <li className="d-flex avatar-group">
                    <NavLink
                        to="/profile"
                        onClick={() => {
                            if (props.isMobile) {
                                props.ToggleNavbarHandler();
                            }
                        }}
                    >
                        <div className="navitem-group navitem-avatar-container">
                            <AvatarImage name={props.UserState.full_name} image={props.UserState.profile_picture} />
                            <div className="avatar-user-name">{props.UserState.full_name}</div>
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

const CloseChildrenHandler = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, SetSuspenseType: (type: string) => void, pageType: string) => {
    const navbarActive = document.querySelectorAll('.navbar-left .open');
    if (navbarActive.length) {
        const nextSibling = (event.target as HTMLDivElement).nextSibling as HTMLDivElement;
        const haveSibling = nextSibling !== null;

        if (haveSibling && nextSibling.classList.value.indexOf('navitem-children-parent') >= 0) return false;
        const WwaitLoop = () => {
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

        await WwaitLoop();

        if (SetSuspenseType) {
            SetSuspenseType(pageType);
        }
    } else {
        if (SetSuspenseType) {
            SetSuspenseType(pageType);
        }
    }
};

type NavitemPropsType = {
    isMobile: boolean;
    ToggleNavbarHandler: () => void;
    SetSuspenseType: (type: string) => void;
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
                ChildrenElement.push(
                    <Navitem
                        key={`${item.id}-${index}`}
                        {...item}
                        isMobile={props.isMobile}
                        ToggleNavbarHandler={props.ToggleNavbarHandler}
                        SetSuspenseType={(type: string) => props.SetSuspenseType(type)}
                    />,
                );
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
                id={props.id}
                className="navitem-container"
                exact
                to={props.link}
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    if (props.isMobile) {
                        props.ToggleNavbarHandler();
                    }
                    CloseChildrenHandler(e, props.SetSuspenseType, props.pageType);
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
    SetSuspenseType: (type: string) => void;
    isMobile: boolean;
};

class TempNavbarLeft extends React.Component<NavbarPropsType & AppState> {
    render() {
        arrGroup.length = 0;
        return (
            <React.Fragment>
                <div id="navbar-left" className={`navbar-left shadow-sm ${this.props.isMobile ? 'mobile' : ''}`.trim()}>
                    <SimpleBar style={{ maxHeight: '100vh' }}>
                        <ul>
                            <AppLogo {...AppLogoDetails} isMobile={this.props.isMobile} ToggleNavbarHandler={this.props.ToggleNavbarHandler} />
                            <AvatarNav UserState={this.props.UserState} isMobile={this.props.isMobile} ToggleNavbarHandler={this.props.ToggleNavbarHandler} />
                            <DividerHorizontal />
                            {this.props.MenuAuthState
                                ? this.props.MenuAuthState.map((item, index) => {
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
                                          arrNav.push(
                                              <Navitem
                                                  key={`${item.id}-${index}`}
                                                  {...item}
                                                  isMobile={this.props.isMobile}
                                                  ToggleNavbarHandler={this.props.ToggleNavbarHandler}
                                                  pageType={item.pageType}
                                                  SetSuspenseType={(type: string) => this.props.SetSuspenseType(type)}
                                              />,
                                          );
                                      }

                                      return arrNav;
                                  })
                                : null}
                            {this.props.isMobile && (
                                <React.Fragment>
                                    <DividerHorizontal />
                                    <li className="" onClick={() => this.props.SignOutHandler()}>
                                        <div className="navitem-container">
                                            <div className="d-flex navitem-string">
                                                <i className={`fas fa-sign-out-alt mr-2 item-left`}></i>
                                                <div className="item-center">Sign out</div>
                                            </div>
                                        </div>
                                    </li>
                                </React.Fragment>
                            )}
                        </ul>
                    </SimpleBar>
                </div>
                {this.props.isMobile && <div className="navbar-left-overlay" onClick={this.props.ToggleNavbarHandler} />}
            </React.Fragment>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    MenuAuthState: state.MenuAuthState,
    UserState: state.UserState,
});

const NavbarLeft = connect(MapStateToProps)(TempNavbarLeft);

export default NavbarLeft;
