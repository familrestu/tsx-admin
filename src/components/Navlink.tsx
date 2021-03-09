import React from 'react';
import { NavLink as NavLinkRRD, NavLinkProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppState } from 'redux/store';

type NavlinkPropsType = {
    link?: string;
    navlink?: string;
    accessmode?: AppState['PageState']['accessmode'];
};

const NavLink = (props: NavLinkProps & NavlinkPropsType) => {
    let url = props.navlink ? props.navlink : props.link ? props.link : props.to;
    const tempUrl: any = url;
    const dispatch = useDispatch();

    if (tempUrl.pathname !== undefined) {
        url = tempUrl.pathname;
    }

    return (
        <NavLinkRRD
            {...props}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                dispatch({ type: 'OPENPAGE', path: url, accessmode: props.accessmode });

                if (props.onClick) {
                    props.onClick(e);
                }
            }}
        />
    );
};

export default NavLink;
