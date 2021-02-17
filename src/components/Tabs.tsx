import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import Navlink from 'components/Navlink';

const TabClickHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, tabNumber: number | undefined) => {
    const navTabs = document.querySelectorAll('nav.nav.nav-tabs .nav-item');
    const tabContainers = document.querySelectorAll('.tab-pane');
    const tabContainer = document.querySelector(`#tab-pane[tab-container-number='${tabNumber}']`);

    for (let i = 0; i < tabContainers.length; i++) {
        const element = tabContainers[i];
        element.classList.remove('active');
        element.classList.remove('show');
    }

    if (tabContainer) {
        tabContainer.classList.add('active');
        window.setTimeout(() => {
            tabContainer.classList.add('show');
        }, 100);
    }

    for (let i = 0; i < navTabs.length; i++) {
        const element = navTabs[i];
        element.classList.remove('activelink');
    }

    e.currentTarget.classList.add('activelink');
};

type TabPropsType = {
    title: string;
    link: string;
    childNumber?: number;
};

const Tab = (props: TabPropsType) => {
    return (
        <Navlink
            to="#"
            link={props.link}
            className={`nav-item nav-link noactivenavlink ${props.childNumber === 0 ? 'activelink' : ''}`.trim()}
            tab-number={props.childNumber}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => TabClickHandler(e, props.childNumber)}
        >
            {props.title}
        </Navlink>
    );
};

type TabsPropsType = {
    // path: string;
    children?: any;
};

const Tabs = (props: TabsPropsType) => {
    const UserState = useSelector((state: AppState) => state.UserState);
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const PageState = useSelector((state: AppState) => state.PageState);
    const MenuAuthState = useSelector((state: AppState) => state.MenuAuthState);
    const dispatch = useDispatch();

    return (
        <React.Fragment>
            <nav className="nav nav-tabs">
                {React.Children.map(props.children, (child, index) => {
                    return React.cloneElement(child, { childNumber: index });
                })}
            </nav>
            <div className="tab-content">
                {React.Children.map(props.children, (child: { props: TabPropsType }, index: number) => {
                    /* if (index === 0 && PageState.path !==) {
                        const arrAuth = MenuAuthState.filter((a) => {
                            return a.link === child.props.link;
                        });
                        const AccessMode = arrAuth.length > 0 ? arrAuth[0].accessmode : 0;
                        dispatch({ type: 'OPENPAGE', path: child.props.link, accessmode: AccessMode });
                    } */

                    const Component = MenuAuthState.filter((a) => {
                        return a.link === (ModalState.isOpened ? ModalState.path : child.props.link);
                    });
                    let X;
                    try {
                        if (Component[0].isGlobal === 'Yes' || Component[0].isGlobal === 1) {
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                            X = require(`../screens${Component[0].componentPath}`);
                        } else {
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                            X = require(`../screens/${UserState.current_app}${Component[0].componentPath}`);
                        }
                    } catch (error) {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        X = require(`../screens/PageNotFoundScreen`);
                    }
                    return (
                        <div key={index} id="tab-pane" className={`fade tab-page-container tab-pane ${index === 0 ? 'active show' : ''}`.trim()} tab-container-number={index}>
                            <X.default />
                        </div>
                    );
                })}
            </div>
        </React.Fragment>
    );
};

export { Tabs, Tab };
