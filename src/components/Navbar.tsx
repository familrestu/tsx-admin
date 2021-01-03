import React from 'react';
import { NavLink } from 'react-router-dom';

import { DividerHorizontal } from 'components/Divider';

import { connect } from 'react-redux';
import { AppState } from 'redux/store';

type AppLogoDetailsType = {
    name: string;
    name_short: string;
    app_id: number;
    app_code: string;
    app_logo: string | null;
    app_logo_small: string | null;
};

const AppLogoDetails: AppLogoDetailsType = {
    name: 'Ersys Admin',
    name_short: 'EA',
    app_id: 1,
    app_code: 'EA',
    app_logo: null,
    app_logo_small: null,
};

class AppLogo extends React.Component<AppLogoDetailsType> {
    render() {
        const imgUrl = '';

        return (
            <li>
                <div id="app-nav-container" className="app-nav-container pointer" /* onClick={() => (window.location.href = `/`)} */>
                    <NavLink to="/">
                        <div id="app" className="app">
                            {this.props.app_logo !== null ? <img src={`${imgUrl}/${this.props.app_logo}`} alt={this.props.name} /> : this.props.name}
                        </div>
                        <div id="app-small" className="app-small">
                            {this.props.app_logo_small !== null ? <img src={`${imgUrl}/${this.props.app_logo_small}`} alt={this.props.name} /> : this.props.name_short}
                        </div>
                    </NavLink>
                </div>
            </li>
        );
    }
}

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

const CloseChildrenHandler = (event: MouseEvent) => {
    const navbarActive = document.querySelectorAll('.navbar-left .open');

    if (navbarActive.length) {
        const nextSibling = (event.target as HTMLDivElement).nextSibling as HTMLDivElement;
        const haveSibling = nextSibling !== null;

        if (haveSibling && nextSibling.classList.value.indexOf('navitem-children-parent') >= 0) return false;

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
            }, 100);
        }
    }
};

type NavitemPropsType = {
    group: string | null;
    groupid: string | null;
    id: string;
    icon: string | null;
    name: string;
    link: string;
    componentPath?: string;
    isMenu: 0 | 1 | 'No' | 'Yes';
    isGlobal: 0 | 1 | 'No' | 'Yes';
    accessmode?: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children?: any;
};

const arrGroup: Array<string> = [];

const Navitem = (props: NavitemPropsType) => {
    const ChildrenElement: React.ReactNode[] = [];
    if (props.children !== undefined && props.children.length > 0) {
        (props.children as Array<NavitemPropsType>).forEach((item, index) => {
            if (item.group !== null && arrGroup.indexOf(item.group) < 0 && (item.isMenu === 1 || item.isMenu === 'Yes')) {
                ChildrenElement.push(
                    <div key={`${item.id}-${index}-group`} className="navitem-group">
                        {item.group}
                    </div>,
                );
                arrGroup.push(item.group);
            }
            if (item.isMenu === 1 || item.isMenu === 'Yes') {
                ChildrenElement.push(<Navitem key={`${item.id}-${index}`} {...item} />);
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
                // onClick={() => CloseChildrenHandler()}
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

type NavbarLeftState = {
    element: React.ReactNode[];
};

class TempNavbarLeft extends React.Component<AppState, NavbarLeftState> {
    state: NavbarLeftState = {
        element: [],
    };
    currentMenu: any;

    BuildNav() {
        const { MenuAuthState } = this.props;
        const arrNav: JSX.Element[] = [];
        if (MenuAuthState !== undefined) {
            MenuAuthState.forEach((item, index) => {
                if (item.group !== null && arrGroup.indexOf(item.group) < 0 && (item.isMenu === 1 || item.isMenu === 'Yes')) {
                    arrNav.push(
                        <div key={`${item.id}-${index}-group`} className="navitem-group">
                            {item.group}
                        </div>,
                    );
                    arrGroup.push(item.group);
                }

                if (item.isMenu === 1 || item.isMenu === 'Yes' || item.id === 'dashboard') {
                    arrNav.push(<Navitem key={`${item.id}-${index}`} {...item} />);
                }
            });
        }

        this.setState({ element: arrNav });
    }

    SetCloseChildrenListener() {
        document.addEventListener('click', CloseChildrenHandler);
    }

    /* not yet implemented */
    SetResizeListener() {
        /*  */
    }

    componentDidMount() {
        this.currentMenu = this.props.MenuAuthState;
        this.SetCloseChildrenListener();
        this.SetResizeListener();
        this.BuildNav();
    }

    componentDidUpdate() {
        if (this.currentMenu !== this.props.MenuAuthState) {
            this.BuildNav();
            this.currentMenu = this.props.MenuAuthState;
        }
    }

    render() {
        return (
            <div id="navbar-left" className="d-flex navbar-left shadow-sm">
                <ul>
                    <AppLogo {...AppLogoDetails} />
                    <DividerHorizontal />
                    {this.state.element}
                </ul>
            </div>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    MenuAuthState: state.MenuAuthState,
});

const NavbarLeft = connect(MapStateToProps)(TempNavbarLeft);

export { NavbarLeft };
