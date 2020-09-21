import React from 'react';
import { NavLink } from 'react-router-dom';
// import SimpleBar from 'simplebar-react';

import View from 'components/View';
import Flex from 'components/Flex';
import Icon from 'components/Icon';
import { DividerHorizontal } from 'components/Divider';

type ArrayMenuTypes = {
    group?: string | undefined;
    children: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: string | any;
    }[];
}[];

const ArrMenuNew = [];

const ArrMenu: ArrayMenuTypes = [
    {
        group: undefined,
        children: [
            {
                id: 'dashboard',
                link: '/',
                name: 'Dashboard',
                icon: 'fas fa-tachometer-alt',
            },
        ],
    },
    {
        group: 'Employee',
        children: [
            {
                id: 'employee.information',
                link: '/employee/information',
                name: 'employee information',
                icon: 'fas fa-user',
            },
        ],
    },
    {
        group: 'Time & Attendance',
        children: [
            {
                id: 'attendance.data',
                link: '/attendance/data',
                name: 'attendance data',
                icon: 'fas fa-user-clock',
            },
            {
                id: 'attendance.reports',
                link: '/attendance/reports',
                name: 'attendance reports',
                icon: 'far fa-calendar-alt',
                children: [
                    {
                        id: 'attendance.reports.leave.employee_balance',
                        link: '/attendance/reports.leave.employee_balance',
                        name: 'employee balance',
                        children: [
                            {
                                id:
                                    'attendance.reports.leave.employee_balance_nested',
                                link:
                                    '/attendance/reports.leave.employee_balance_nested',
                                name: 'employee balance nested',
                            },
                        ],
                    },
                    {
                        id: 'attendance.reports.long',
                        link: '/attendance/reports/long',
                        name: 'reports very very very very long naem',
                    },
                ],
            },
        ],
    },
    {
        group: 'Payroll',
        children: [
            {
                id: 'payroll.data',
                link: '/payroll/history',
                name: 'salary history',
                icon: 'fas fa-dollar-sign',
            },
        ],
    },
];

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
                <View
                    id="company-nav-container"
                    className="company-nav-container"
                    onClick={() => alert()}
                >
                    <View id="company" className="company">
                        {this.props.company_logo !== null ? (
                            <img
                                src={`${imgUrl}/${this.props.company_logo}`}
                                alt={this.props.name}
                            />
                        ) : (
                            this.props.name
                        )}
                    </View>
                    <View id="company-small" className="company-small">
                        {this.props.company_logo_small !== null ? (
                            <img
                                src={`${imgUrl}/${this.props.company_logo_small}`}
                                alt={this.props.name}
                            />
                        ) : (
                            this.props.name_short
                        )}
                    </View>
                </View>
            </li>
        );
    }
}

type NavitemProps = {
    id: string;
    link: string;
    name: string;
    icon?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children?: any;
};

class Navitem extends React.Component<NavitemProps> {
    OpenChildrenHandler(id: string) {
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
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ClickLinkHandler(id: string) {
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
    }

    render() {
        let Element = null;
        let haveChildren = false;
        const navs = [];
        let navsparent = null;

        if (typeof this.props.children !== 'undefined') {
            if (this.props.children.length > 0) {
                Element = View;
                haveChildren = true;
            } else {
                Element = NavLink;
            }
        } else {
            Element = NavLink;
        }

        if (haveChildren) {
            for (let i = 0; i < this.props.children.length; i++) {
                const key = this.props.children[i];
                if (typeof key.children !== 'undefined') {
                    navs.push(
                        <Navitem
                            key={i}
                            name={key.name}
                            link={key.link}
                            icon={key.icon}
                            id={key.id}
                        >
                            {key.children}
                        </Navitem>,
                    );
                } else {
                    navs.push(
                        <Navitem
                            key={i}
                            name={key.name}
                            link={key.link}
                            icon={key.icon}
                            id={key.id}
                        />,
                    );
                }
            }

            navsparent = (
                <Navparent className="navbar-children-parent shadow">
                    {navs}
                </Navparent>
            );
        }

        return (
            <li>
                <Element
                    exact
                    to={this.props.link}
                    className="viewlink"
                    id={this.props.id}
                    activeClassName="active"
                    onClick={
                        haveChildren
                            ? () => this.OpenChildrenHandler(this.props.id)
                            : () => this.ClickLinkHandler(this.props.id)
                    }
                >
                    <Flex
                        id="navitem"
                        className="navitem"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {typeof this.props.icon !== 'undefined' ? (
                            <Icon name={this.props.icon} />
                        ) : (
                            <React.Fragment></React.Fragment>
                        )}
                        <Flex
                            flex={1}
                            id="navstring-group"
                            className="navstring-group"
                            alignItems="center"
                        >
                            <View flex={1}>{this.props.name}</View>
                            {haveChildren ? (
                                <Icon name="fas fa-chevron-right chevron" />
                            ) : (
                                <React.Fragment></React.Fragment>
                            )}
                        </Flex>
                    </Flex>
                </Element>
                {navsparent}
                {/* {typeof this.props.children !== 'undefined' ? (
                    this.props.children ? (
                        this.props.children.length && (
                            <Navparent className="navbar-children-parent shadow">
                                {this.props.children.map(
                                    (key: NavitemProps, index: number) => {
                                        return (
                                            <Navitem
                                                key={index}
                                                name={key.name}
                                                link={key.link}
                                                icon={key.icon}
                                                id={key.id}
                                            />
                                        );
                                    },
                                )}
                            </Navparent>
                        )
                    ) : (
                        <React.Fragment></React.Fragment>
                    )
                ) : (
                    <React.Fragment></React.Fragment>
                )} */}
            </li>
        );
    }
}

type NavparentProps = {
    className?: string;
    children: React.ReactNode;
};

const Navparent = (props: NavparentProps) => {
    return <ul className={props.className}>{props.children}</ul>;
};

type NavbarLeftProps = {
    NavbarOpened: boolean;
};

class NavbarLeft extends React.Component<NavbarLeftProps> {
    NavbarTogglerHandler() {
        if (this.props.NavbarOpened) {
            document.getElementById('navbar-left')?.classList.add('closed');
        } else {
            document.getElementById('navbar-left')?.classList.remove('closed');
        }
    }

    componentDidUpdate() {
        this.NavbarTogglerHandler();
    }

    render() {
        const navs = [];

        for (let groupIndex = 0; groupIndex < ArrMenu.length; groupIndex++) {
            const groupKey = ArrMenu[groupIndex];
            if (typeof groupKey.group !== 'undefined') {
                navs.push(
                    <View
                        key={`${groupKey.group}-${groupIndex}`}
                        className="navbar-group-heading"
                    >
                        {groupKey.group}
                    </View>,
                );
            }

            for (
                let itemIndex = 0;
                itemIndex < groupKey.children.length;
                itemIndex++
            ) {
                const itemKey = groupKey.children[itemIndex];

                if (typeof itemKey.children !== 'undefined') {
                    navs.push(
                        <Navitem
                            key={`${itemKey.name}-${itemIndex}`}
                            name={itemKey.name}
                            icon={itemKey.icon}
                            link={itemKey.link}
                            id={itemKey.id}
                        >
                            {itemKey.children}
                        </Navitem>,
                    );
                } else {
                    navs.push(
                        <Navitem
                            key={`${itemKey.name}-${itemIndex}`}
                            name={itemKey.name}
                            icon={itemKey.icon}
                            link={itemKey.link}
                            id={itemKey.id}
                        />,
                    );
                }

                if (groupKey.children.length - 1 === itemIndex) {
                    navs.push(
                        <DividerHorizontal
                            key={`divider-${itemKey.name}-${itemIndex}`}
                            marginBottom
                        />,
                    );
                }
            }
        }

        return (
            <Flex
                id="navbar-left"
                className="navbar-left"
                width="14.5rem"
                flexDirection="column"
                zIndex={6}
            >
                <Navparent>
                    <Company {...CompanyDetails} />
                    <DividerHorizontal
                        marginBottom={typeof ArrMenu[0].group !== 'undefined'}
                    />
                    {navs}
                </Navparent>
            </Flex>
        );
    }
}

export { NavbarLeft };
