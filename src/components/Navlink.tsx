import React from 'react';
import { NavLink as NavLinkRRD, NavLinkProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'redux/store';

type NavlinkPropsType = {
    link?: string;
    navtype: string;
    navlink?: string;
};

const NavLink = (props: NavLinkProps & NavlinkPropsType) => {
    const url = props.navlink ? props.navlink : props.link ? props.link : props.to;
    const dispatch = useDispatch();
    const MenuAuthState = useSelector((state: AppState) => state.MenuAuthState);

    return (
        <NavLinkRRD
            {...props}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                let type = '';
                const arrAuth = MenuAuthState.filter((a) => {
                    return a.link === url;
                });
                const accessmode = arrAuth.length > 0 ? arrAuth[0].accessmode : 0;

                if (props.navtype === 'page') {
                    type = 'OPENPAGE';
                    console.log(url);
                    dispatch({ type, path: url, accessmode });
                } else if (props.navtype === 'tab') {
                    type = 'OPENTAB';
                    dispatch({ type, path: url, accessmode });
                }

                if (props.onClick) {
                    props.onClick(e);
                }
            }}
        />
    );
};

export default NavLink;
