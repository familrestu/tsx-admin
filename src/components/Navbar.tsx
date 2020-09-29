import React from 'react';
import { NavLink } from 'react-router-dom';

import { DividerHorizontal } from 'components/Divider';
/* import Flex from 'components/Flex';
import View from 'components/View'; */

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ClickLinkHandler = (id: string) => {
    const navbarActive = document.querySelectorAll('.navbar-left .open');

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
    id: string;
    link: string;
    name: string;
    icon?: string;
    children?: { [key: string]: string }[];
};

const Navitem = (props: NavitemPropsType) => {
    let ReturnElement = null;

    if (props.children !== undefined && props.children.length > 0) {
        const ChildrenElement = [];

        for (let i = 0; i < props.children.length; i++) {
            const key = props.children[i];
            ChildrenElement.push(
                <Navitem
                    id={key.id}
                    link={key.link}
                    name={key.name}
                    icon={key.icon}
                >
                    {props.children}
                </Navitem>,
            );
        }

        ReturnElement = (
            <li>
                <div
                    id={props.id}
                    className="navitem-container"
                    onClick={() => OpenChildrenHandler(props.id)}
                >
                    <div className="d-flex navitem-string">
                        <i className={`${props.icon} mr-2 item-left`}></i>
                        <div className="item-center">{props.name}</div>
                        <i className="fas fa-chevron-right item-right"></i>
                    </div>
                </div>
                <ul>{ChildrenElement}</ul>
            </li>
        );
    } else {
        ReturnElement = (
            <li>
                <NavLink
                    id={props.id}
                    className="navitem-container"
                    exact
                    to={props.link}
                    onClick={() => ClickLinkHandler(props.id)}
                >
                    <div className="d-flex navitem-string">
                        <i className={`${props.icon} mr-2 item-left`}></i>
                        <div className="item-center">{props.name}</div>
                    </div>
                </NavLink>
            </li>
        );
    }

    return ReturnElement;
};

class NavbarLeft extends React.Component {
    render() {
        return (
            <div id="navbar-left" className="d-flex navbar-left shadow">
                <ul>
                    <Company {...CompanyDetails} />
                    <DividerHorizontal />
                    <Navitem
                        id="dashboard"
                        icon="fas fa-tachometer-alt"
                        name="dashboard"
                        link="/"
                    />
                    <Navitem
                        id="view"
                        icon="fas fa-square"
                        name="View"
                        link="/view"
                    />
                    <div className="navitem-group">Divider</div>
                    <Navitem
                        id="view"
                        icon="fas fa-square"
                        name="Views"
                        link="/views"
                    />
                </ul>
            </div>
        );
    }
}

/* {<li>
    <NavLink exact to="/" className="navitem-container">
        <Flex className="navitem-string">
            <i className="fas fa-tachometer-alt mr-2 item-left"></i>
            <View className="item-center" flex={1}>
                Dashboard
            </View>
            <i className="fas fa-chevron-right item-right"></i>
        </Flex>
    </NavLink>
</li>
<DividerHorizontal marginBottom />
<div className="navitem-group">Divider</div>
<li>
    <View
        className="navitem-container"
        id="1-testing"
        onClick={() =>
            this.OpenChildrenHandler('1-testing')
        }
    >
        <Flex className="navitem-string">
            <i className="fas fa-square mr-2 item-left"></i>
            <View className="item-center" flex={1}>
                Dashboard
            </View>
            <i className="fas fa-chevron-right item-right"></i>
        </Flex>
    </View>

    <ul className="navitem-children-parent shadow">
        <div className="navitem-group">Divider</div>
        <li>
            <NavLink
                exact
                to="/component/children"
                className="navitem-container"
            >
                <Flex className="navitem-string">
                    <i className="fas fa-tachometer-alt mr-2 item-left"></i>
                    <View className="item-center" flex={1}>
                        children
                    </View>
                    <i className="fas fa-chevron-right item-right"></i>
                </Flex>
            </NavLink>
        </li>
        <li>
            <NavLink
                exact
                to="/component/children"
                className="navitem-container"
            >
                <Flex className="navitem-string">
                    <i className="fas fa-tachometer-alt mr-2 item-left"></i>
                    <View className="item-center" flex={1}>
                        children huruf nya panjang panjang
                    </View>
                    <i className="fas fa-chevron-right item-right"></i>
                </Flex>
            </NavLink>
        </li>
        <div className="navitem-group">Divider</div>
        <li>
            <NavLink
                exact
                to="/component/children"
                className="navitem-container"
            >
                <Flex className="navitem-string">
                    <i className="fas fa-tachometer-alt mr-2 item-left"></i>
                    <View className="item-center" flex={1}>
                        children
                    </View>
                    <i className="fas fa-chevron-right item-right"></i>
                </Flex>
            </NavLink>
        </li>
        <li>
            <NavLink
                exact
                to="/component/children"
                className="navitem-container"
            >
                <Flex className="navitem-string">
                    <i className="fas fa-tachometer-alt mr-2 item-left"></i>
                    <View className="item-center" flex={1}>
                        children huruf nya panjang panjang
                    </View>
                    <i className="fas fa-chevron-right item-right"></i>
                </Flex>
            </NavLink>
        </li>
    </ul>
</li>} */

export { NavbarLeft };
