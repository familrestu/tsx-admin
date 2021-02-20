import React from 'react';
import { NavLink as NavLinkRRD, NavLinkProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'redux/store';

type NavlinkPropsType = {
    link?: string;
    navtype: string;
    navlink?: string /* for column */;
};

const NavLink = (props: NavLinkProps & NavlinkPropsType) => {
    const url = props.navlink ? props.navlink : props.link ? props.link : props.to;
    const dispatch = useDispatch();
    const MenuAuthState = useSelector((state: AppState) => state.MenuAuthState);
    // const PageState = useSelector((state: AppState) => state.PageState);
    // const ModalState = useSelector((state: AppState) => state.ModalState);
    // const TabState = useSelector((state: AppState) => state.TabState);
    // console.log(props.navlink);

    return (
        <NavLinkRRD
            {...props}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                // console.log('My Navlink Click', link);
                let type = '';
                const arrAuth = MenuAuthState.filter((a) => {
                    return a.link === url;
                });
                const accessmode = arrAuth.length > 0 ? arrAuth[0].accessmode : 0;

                if (props.navtype === 'page') {
                    type = 'OPENPAGE';
                    dispatch({ type, path: url, accessmode });
                } else if (props.navtype === 'tab') {
                    type = 'OPENTAB';
                    dispatch({ type, path: url, accessmode });
                }

                // console.log(PageState.accessmode, ModalState.accessmode, TabState.accessmode);

                if (props.onClick) {
                    props.onClick(e);
                }
            }}
        />
    );
};

export default NavLink;
