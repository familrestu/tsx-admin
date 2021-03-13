import React, { Component } from 'react';
import { useLocation, RouteComponentProps, withRouter } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { connect, useSelector, useDispatch } from 'react-redux';
import { AppState } from 'redux/store';
import { TabStateType } from 'redux/reducers/TabState';
import { NavLink } from 'react-router-dom';

const TabClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, childNumber: number) => {
    const navTabParents = e.currentTarget.parentElement;
    if (navTabParents) {
        const navTabs = navTabParents.children;
        for (let i = 0; i < navTabs.length; i++) {
            const element = navTabs[i];
            element.classList.remove('activelink');
        }

        e.currentTarget.classList.add('activelink');

        const tabPane = navTabParents.nextElementSibling;

        if (tabPane) {
            const tabChild = tabPane.children;
            for (let i = 0; i < tabChild.length; i++) {
                const element = tabChild[i];
                if (element.getAttribute('tab-container-number') === childNumber.toString()) {
                    element.classList.add('show');
                    element.classList.add('active');
                } else {
                    element.classList.remove('show');
                    element.classList.remove('active');
                }
            }
        }
    }
};

type TabPropsType = {
    title: string;
    link: string;
    showif?: boolean;
    childNumber?: number;
};

const Tab = (props: TabPropsType) => {
    const dispatch = useDispatch();
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const MenuAuthState = useSelector((state: AppState) => state.MenuAuthState);
    const location = useLocation<{ tab: string }>();

    let show = false;
    let accessmode: AppState['TabState']['accessmode'] = 0;
    let tablocation = '';

    if (ModalState.isOpened && props.childNumber === 0) {
        tablocation = props.link;
    } else {
        tablocation = location.state && !ModalState.isOpened ? location.state.tab : '';
    }

    /* automatic not showing tabs if didn't get access */
    for (let x = 0; x < MenuAuthState.length; x++) {
        const Menu = MenuAuthState[x];

        if (Menu.link === props.link) {
            show = true;
            accessmode = Menu.accessmode;
            break;
        } else {
            accessmode = 0;
        }
    }

    let Element = <React.Fragment />;

    if ((props.showif !== undefined && !props.showif) || !show) {
        Element = <React.Fragment />;
    } else {
        Element = (
            <NavLink
                to={{
                    state: {
                        tab: props.link,
                    },
                }}
                className={`nav-item nav-link noactivenavlink ${props.link === tablocation ? 'activelink' : ''}`.trim()}
                tab-number={props.childNumber}
                tab-location={props.link}
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    dispatch({ type: 'OPENTAB', path: props.link, accessmode });
                    TabClick(e, Number(props.childNumber));
                }}
            >
                {props.title}
            </NavLink>
        );
    }

    return Element;
};

type TabsPropsType = {
    children?: any;
};

class TabsC extends Component<TabsPropsType & MapStateToPropsType & typeof MapDispatch & RouteComponentProps<null, StaticContext, { tab: string }>> {
    constructor(props: TabsPropsType & MapStateToPropsType & typeof MapDispatch & RouteComponentProps<null, StaticContext, { tab: string }>) {
        super(props);
        this.TabOpened();
    }

    TabOpened() {
        const { location } = this.props;
        if (location.state) {
            const path = location.state.tab;
            const Component = this.props.MenuAuthState.filter((a) => {
                return a.link === path;
            });

            if (Component) {
                this.props.OpenTab(Component[0].link, Component[0].accessmode);
            }
        }
    }

    HideAllOpenedTabs() {
        if (this.props.TabState.tabcontentpath !== null) {
            const tabs = document.querySelectorAll('.tab-page-container');

            if (tabs) {
                for (let i = 0; i < tabs.length; i++) {
                    const tabscontent = tabs[i];
                    if (tabscontent.getAttribute('tab-container-number') !== '99') {
                        tabscontent.classList.remove('show');
                        tabscontent.classList.remove('active');
                    }
                }
            }
        }
    }

    GetTabsContent() {
        let X;
        const Component = this.props.MenuAuthState.filter((a) => {
            return a.link === this.props.TabState.tabcontentpath;
        });

        try {
            if (Component) {
                if (Component[0].isGlobal === 'Yes' || Component[0].isGlobal === 1) {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    X = require(`screens/app${Component[0].componentPath}`);
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    X = require(`screens/${this.props.UserState.current_app}${Component[0].componentPath}`);
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                X = require(`screens/app/pagenotfound`);
            }
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            X = require(`screens/app/pagenotfound`);
        }
        return (
            <div id="tab-pane" className="fade tab-page-container tab-pane active show" tab-container-number={99}>
                <X.default />
            </div>
        );
    }

    componentDidUpdate() {
        this.HideAllOpenedTabs();
    }

    componentWillUnmount() {
        this.props.ClearTab();
    }

    render() {
        return (
            <React.Fragment>
                <nav className="nav nav-tabs">
                    {React.Children.map(this.props.children, (child, index) => {
                        return React.cloneElement(child, { childNumber: index });
                    })}
                </nav>
                <div className="tab-content">
                    {React.Children.map(this.props.children, (child: { props: TabPropsType }, index: number) => {
                        let X;
                        const Component = this.props.MenuAuthState.filter((a) => {
                            return a.link === child.props.link;
                        });
                        try {
                            if (Component) {
                                if (Component[0].isGlobal === 'Yes' || Component[0].isGlobal === 1) {
                                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                                    X = require(`screens/app${Component[0].componentPath}`);
                                } else {
                                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                                    X = require(`screens/${this.props.UserState.current_app}${Component[0].componentPath}`);
                                }
                            } else {
                                // eslint-disable-next-line @typescript-eslint/no-var-requires
                                X = require(`screens/app/pagenotfound`);
                            }
                        } catch (error) {
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                            X = require(`screens/app/pagenotfound`);
                        }

                        return (
                            <div
                                key={index}
                                id="tab-pane"
                                className={`fade tab-page-container tab-pane ${this.props.location.state.tab === child.props.link ? 'active show' : ''}`.trim()}
                                tab-container-number={index}
                                tab-container-name={child.props.title.toLowerCase().replaceAll(' ', '-')}
                            >
                                <X.default />
                            </div>
                        );
                    })}
                    {this.props.TabState.tabcontentpath !== null && this.GetTabsContent()}
                </div>
            </React.Fragment>
        );
    }
}

type MapStateToPropsType = {
    UserState: AppState['UserState'];
    MenuAuthState: AppState['MenuAuthState'];
    ModalState: AppState['ModalState'];
    TabState: AppState['TabState'];
};

const MapStateToProps = (state: MapStateToPropsType) => ({
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
