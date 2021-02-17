import React from 'react';
import { NavLink as NavLinkRRD, NavLinkProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'redux/store';

type NavlinkPropsType = {
    link?: string;
};

const NavLink = (props: NavLinkProps & NavlinkPropsType) => {
    const link = props.link ? props.link : props.to;
    const MenuAuthState = useSelector((state: AppState) => state.MenuAuthState);
    const dispatch = useDispatch();

    return (
        <NavLinkRRD
            {...props}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                // console.log('My Navlink Click', link);
                const arrAuth = MenuAuthState.filter((a) => {
                    return a.link === link;
                });
                const AccessMode = arrAuth.length > 0 ? arrAuth[0].accessmode : 0;
                // console.log(AccessMode, arrAuth[0]);
                dispatch({ type: 'OPENPAGE', path: link, accessmode: AccessMode });
                if (props.onClick) {
                    props.onClick(e);
                }
            }}
        />
    );
};

export default NavLink;
