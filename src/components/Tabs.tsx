import React, { Component } from 'react';
import { useLocation, RouteComponentProps, withRouter } from 'react-router-dom';
import { StaticContext } from 'react-router';

import { connect, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { TabStateType } from 'redux/reducers/TabState';
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
    showif?: boolean;
    childNumber?: number;
};

const Tab = (props: TabPropsType) => {
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const location = useLocation<{ tab: string }>();
    let tablocation = '';

    if (ModalState.isOpened && props.childNumber === 0) {
        tablocation = props.link;
    } else {
        tablocation = location.state && !ModalState.isOpened ? location.state.tab : '';
    }

    let Element = <React.Fragment />;

    if (props.showif !== undefined && !props.showif) {
        Element = <React.Fragment />;
    } else {
        Element = (
            <Navlink
                to={{
                    state: {
                        tab: props.link,
                    },
                }}
                navtype="tab"
                link={props.link}
                className={`nav-item nav-link noactivenavlink ${props.link === tablocation ? 'activelink' : ''}`.trim()}
                tab-number={props.childNumber}
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => TabClickHandler(e, props.childNumber)}
            >
                {props.title}
            </Navlink>
        );
    }

    return Element;
};

type TabsPropsType = {
    children?: any;
};

class TabsC extends Component<TabsPropsType & AppState & typeof MapDispatch & RouteComponentProps<null, StaticContext, { tab: string }>> {
    _CurrentPath: string = window.location.pathname;
    _PrevPath: string | undefined;

    componentDidMount() {
        this._PrevPath = this._CurrentPath;
    }

    componentWillUnmount() {
        this._CurrentPath = window.location.pathname;
        if (this._PrevPath !== this._CurrentPath || (this.props.ModalState && this.props.ModalState.isOpened)) {
            this.props.ClearTab();
        }
    }

    render() {
        const { location } = this.props;
        let tablocation = location.state ? location.state.tab : '';

        return (
            <React.Fragment>
                <nav className="nav nav-tabs">
                    {React.Children.map(this.props.children, (child, index) => {
                        return React.cloneElement(child, { childNumber: index });
                    })}
                </nav>
                <div className="tab-content">
                    {React.Children.map(this.props.children, (child: { props: TabPropsType }, index: number) => {
                        const Component =
                            this.props.MenuAuthState &&
                            this.props.MenuAuthState.filter((a) => {
                                return a.link === child.props.link;
                            });
                        let X;
                        try {
                            if (Component) {
                                if (this.props.ModalState && this.props.ModalState.isOpened && index === 0) {
                                    tablocation = child.props.link;
                                }

                                if (this.props.TabState && this.props.TabState.path === null && child.props.link === tablocation) {
                                    this.props.OpenTab(child.props.link, Component[0].accessmode);
                                }

                                if (Component[0].isGlobal === 'Yes' || Component[0].isGlobal === 1) {
                                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                                    X = require(`../screens${Component[0].componentPath}`);
                                } else {
                                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                                    X = require(`../screens/${this.props.UserState.current_app}${Component[0].componentPath}`);
                                }
                            } else {
                                // eslint-disable-next-line @typescript-eslint/no-var-requires
                                X = require(`../screens/pagenotfound`);
                            }
                        } catch (error) {
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                            X = require(`../screens/pagenotfound`);
                            console.log(error);
                        }

                        return (
                            <div
                                key={index}
                                id="tab-pane"
                                className={`fade tab-page-container tab-pane ${child.props.link === tablocation ? 'active show' : ''}`.trim()}
                                tab-container-number={index}
                                tab-container-name={child.props.title.toLowerCase().replaceAll(' ', '-')}
                            >
                                <X.default />
                            </div>
                        );
                    })}
                </div>
            </React.Fragment>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
    MenuAuthState: state.MenuAuthState,
    ModalState: state.ModalState,
    TabState: state.TabState,
});

const MapDispatch = {
    OpenTab: (path: TabStateType['path'], accessmode: TabStateType['accessmode']) => ({ type: 'OPENTAB', path, accessmode }),
    ClearTab: () => ({ type: 'CLEARTAB' }),
};

const TabsConnect = connect(MapStateToProps, MapDispatch)(TabsC);
const Tabs = withRouter(TabsConnect);

export { Tabs, Tab };
