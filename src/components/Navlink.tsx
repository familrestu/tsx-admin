import React from 'react';
import { NavLink as NavLinkRRD, NavLinkProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'redux/store';

type NavlinkPropsType = {
    link?: string;
    navlink?: string;
};

const NavLink = (props: NavLinkProps & NavlinkPropsType) => {
    let url = props.navlink ? props.navlink : props.link ? props.link : props.to;
    const tempUrl: any = url;
    const dispatch = useDispatch();
    const MenuAuthState = useSelector((state: AppState) => state.MenuAuthState);

    if (tempUrl.pathname !== undefined) {
        url = tempUrl.pathname;
    }

    return (
        <NavLinkRRD
            {...props}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                const type = 'OPENPAGE';
                const arrAuth = MenuAuthState.filter((a) => {
                    return a.link === url;
                });
                const accessmode = arrAuth.length > 0 ? arrAuth[0].accessmode : 0;
                dispatch({ type, path: url, accessmode });

                if (props.onClick) {
                    props.onClick(e);
                }
            }}
        />
    );
};

export default NavLink;
