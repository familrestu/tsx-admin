import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import SimpleBar from 'simplebar-react';

import View from 'components/View';
import Flex from 'components/Flex';
import Text from 'components/Text';
import Icon from 'components/Icon';
import { DividerHorizontal } from 'components/Divider';

import { Primary } from 'themes/styles';

type ArrayMenuTypes = {
    group?: string | undefined;
    children: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: string | any;
    }[];
}[];

const ArrMenu: ArrayMenuTypes = [
    {
        group: undefined,
        children: [
            {
                link: '/',
                name: 'Dashboard',
                icon: 'fas fa-tachometer-alt',
            },
        ],
    },
    {
        group: 'Components',
        children: [
            {
                link: '/components/absolute',
                name: 'absolute',
            },
            {
                link: '/components/flex',
                name: 'Flex',
            },
            {
                link: '/components/icon',
                name: 'icon',
            },
            {
                link: '/components/text',
                name: 'text',
            },
            {
                link: '/components/table',
                name: 'table',
            },
            {
                link: '/components/view',
                name: 'view',
            },
        ],
    },
    {
        group: 'Pages',
        children: [
            {
                link: '/pages/login',
                name: 'login',
            },
            {
                link: '/pages/forgotpassword',
                name: 'forgot password',
            },
            {
                link: '/pages/error',
                name: 'forgot error',
                children: [
                    {
                        link: 'pages/error/404',
                        name: 'err404',
                    },
                    {
                        link: 'pages/error/notfound',
                        name: 'page not found',
                    },
                ],
            },
        ],
    },
];

class Company extends React.Component {
    render() {
        return (
            <li>
                <Link to="#">
                    <View id="company" className="company">
                        <Text>Ersys Admin</Text>
                    </View>
                </Link>
            </li>
        );
    }
}

type NavitemProps = {
    link: string;
    name: string;
    icon?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children?: any;
};

const Navitem = (props: NavitemProps) => {
    return (
        <li>
            <NavLink to={props.link} activeClassName="active">
                <Flex flexDirection="row" alignItems="center">
                    {typeof props.icon !== 'undefined' ? (
                        <Icon name={props.icon} />
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                    <View flex={1}>{props.name}</View>
                    {typeof props.children !== 'undefined' ? (
                        props.children ? (
                            <Icon name="fas fa-chevron-right chevron" />
                        ) : (
                            <React.Fragment></React.Fragment>
                        )
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                </Flex>
            </NavLink>
            {typeof props.children !== 'undefined' ? (
                props.children ? (
                    <Navparent>
                        {props.children.map(
                            (
                                key: {
                                    name: string;
                                    link: string;
                                    icon: string | undefined;
                                },
                                index: number,
                            ) => {
                                return (
                                    <Navitem
                                        key={index}
                                        name={key.name}
                                        link={key.link}
                                        icon={key.icon}
                                    />
                                );
                            },
                        )}
                    </Navparent>
                ) : (
                    <React.Fragment></React.Fragment>
                )
            ) : (
                <React.Fragment></React.Fragment>
            )}
        </li>
    );
};

type NavparentProps = {
    children: React.ReactNode;
};

const Navparent = (props: NavparentProps) => {
    return <ul>{props.children}</ul>;
};

class NavbarLeft extends React.Component {
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
                flex={0.25}
                maxWidth="14rem"
                flexDirection="column"
                backgroundColor={Primary}
            >
                <SimpleBar style={{ maxHeight: '100vh' }}>
                    <Navparent>
                        <Company />
                        <DividerHorizontal
                            marginBottom={
                                typeof ArrMenu[0].group !== 'undefined'
                            }
                        />
                        {navs}
                    </Navparent>
                </SimpleBar>
            </Flex>
        );
    }
}

export { NavbarLeft };
