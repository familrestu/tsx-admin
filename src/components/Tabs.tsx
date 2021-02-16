import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';

const TabClickHandler = (e: React.MouseEvent<HTMLDivElement>, tabNumber: number | undefined) => {
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
        element.classList.remove('active');
    }

    e.currentTarget.classList.add('active');
};

type TabPropsType = {
    title: string;
    link: string;
    childNumber?: number;
};

const Tab = (props: TabPropsType) => {
    return (
        <div
            className={`nav-item nav-link ${props.childNumber === 0 ? 'active' : ''}`.trim()}
            tab-number={props.childNumber}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => TabClickHandler(e, props.childNumber)}
        >
            {props.title}
        </div>
    );
};

type TabsPropsType = {
    // path: string;
    children?: any;
};

const Tabs = (props: TabsPropsType) => {
    const UserState = useSelector((state: AppState) => state.UserState);
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const MenuAuthState = useSelector((state: AppState) => state.MenuAuthState);

    return (
        <React.Fragment>
            <nav className="nav nav-tabs">
                {React.Children.map(props.children, (child, index) => {
                    return React.cloneElement(child, { childNumber: index });
                })}
            </nav>
            <div className="tab-content">
                {React.Children.map(props.children, (child: { props: TabPropsType }, index: number) => {
                    // console.log(child.props);
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
                        // console.log(error.message);
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        X = require(`../screens/PageNotFoundScreen`);
                    }
                    // console.log(Component);
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
