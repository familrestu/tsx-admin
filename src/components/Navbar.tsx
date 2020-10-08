import React from 'react';
import { NavLink } from 'react-router-dom';

import { DividerHorizontal } from 'components/Divider';
/* import div from 'components/div';
import View from 'components/View'; */

import { connect } from 'react-redux';
import { AppState } from 'redux/store';

type CompanyDetailsType = {
    name: string;
    name_short: string;
    company_id: number;
    company_code: string;
    company_logo: string | null;
    company_logo_small: string | null;
};

const CompanyDetails: CompanyDetailsType = {
    name: 'Ersys Admin',
    name_short: 'EA',
    company_id: 1,
    company_code: 'EA',
    company_logo: null,
    company_logo_small: null,
};

class Company extends React.Component<CompanyDetailsType> {
    render() {
        const imgUrl = '';

        return (
            <li>
                <div
                    id="company-nav-container"
                    className="company-nav-container pointer"
                    onClick={() => alert()}
                >
                    <div id="company" className="company">
                        {this.props.company_logo !== null ? (
                            <img
                                src={`${imgUrl}/${this.props.company_logo}`}
                                alt={this.props.name}
                            />
                        ) : (
                            this.props.name
                        )}
                    </div>
                    <div id="company-small" className="company-small">
                        {this.props.company_logo_small !== null ? (
                            <img
                                src={`${imgUrl}/${this.props.company_logo_small}`}
                                alt={this.props.name}
                            />
                        ) : (
                            this.props.name_short
                        )}
                    </div>
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

            const targetSiblingBottomPosition = targetNextSibling.getBoundingClientRect()
                .bottom;
            const targetHeight = (target.nextElementSibling as HTMLUListElement)
                .offsetHeight;

            if (
                targetSiblingBottomPosition + targetHeight >
                bodyBottomPosition
            ) {
                targetNextSibling.style.top =
                    (
                        (targetSiblingBottomPosition -
                            bodyBottomPosition +
                            16) *
                        -1
                    ).toString() + 'px';
            }
        }
    }
};

const CloseChildrenHandler = (event: MouseEvent) => {
    const navbarActive = document.querySelectorAll('.navbar-left .open');
    const nextSibling = (event.target as HTMLDivElement)
        .nextSibling as HTMLDivElement;
    const haveSibling = nextSibling !== null;

    if (
        haveSibling &&
        nextSibling.classList.value.indexOf('avitem-children-parent') >= 0
    )
        return false;

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
};

type NavitemPropsType = {
    group: string | null;
    groupid: string | null;
    id: string;
    link: string;
    name: string;
    icon: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children?: any;
};

const arrGroup: Array<string> = [];

const Navitem = (props: NavitemPropsType) => {
    const ChildrenElement: React.ReactNode[] = [];
    if (props.children !== undefined && props.children.length > 0) {
        (props.children as Array<NavitemPropsType>).forEach((item, index) => {
            if (item.group !== null && arrGroup.indexOf(item.group) < 0) {
                ChildrenElement.push(
                    <div
                        key={`${item.id}-${index}-group`}
                        className="navitem-group"
                    >
                        {item.group}
                    </div>,
                );
                arrGroup.push(item.group);
            }

            ChildrenElement.push(
                <Navitem key={`${item.id}-${index}`} {...item} />,
            );
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Div = (props: any) => (
        <div
            id={props.id}
            className="navitem-container pointer"
            tabIndex={0}
            onClick={() => OpenChildrenHandler(props.id)}
            // onBlur={() => CloseChildrenHandler()}
        >
            {props.children}
        </div>
    );

    const Container =
        props.children !== undefined && props.children.length > 0
            ? Div
            : NavLink;

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
                    {props.icon !== null && (
                        <i className={`${props.icon} mr-2 item-left`}></i>
                    )}
                    <div className="item-center">{props.name}</div>
                    {props.children !== undefined &&
                        props.children.length > 0 && (
                            <i
                                className={`fas fa-chevron-right mr-2 item-right`}
                            ></i>
                        )}
                </div>
            </Container>
            {props.children !== undefined && props.children.length > 0 && (
                <ul className="navitem-children-parent shadow">
                    {ChildrenElement}
                </ul>
            )}
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

    BuildNav() {
        const { MenuAuthState } = this.props;
        const arrNav: JSX.Element[] = [];
        if (MenuAuthState !== undefined) {
            MenuAuthState.forEach((item, index) => {
                if (item.group !== null && arrGroup.indexOf(item.group) < 0) {
                    arrNav.push(
                        <div
                            key={`${item.id}-${index}-group`}
                            className="navitem-group"
                        >
                            {item.group}
                        </div>,
                    );
                    arrGroup.push(item.group);
                }

                arrNav.push(<Navitem key={`${item.id}-${index}`} {...item} />);
            });
        }

        this.setState({ element: arrNav });
    }

    SetCloseChildrenListener() {
        document.addEventListener('click', CloseChildrenHandler);
    }

    componentDidMount() {
        this.BuildNav();
        this.SetCloseChildrenListener();
    }

    render() {
        return (
            <div id="navbar-left" className="d-flex navbar-left shadow">
                <ul>
                    <Company {...CompanyDetails} />
                    <DividerHorizontal />
                    {this.state.element}
                </ul>
            </div>
        );
    }
}

export const MapStateToProps = (state: AppState) => ({
    MenuAuthState: state.MenuAuthState,
});

const NavbarLeft = connect(MapStateToProps)(TempNavbarLeft);

export { NavbarLeft };
