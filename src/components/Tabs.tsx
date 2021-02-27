import React, { Component } from 'react';
import { useLocation, RouteComponentProps, withRouter } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { connect, useSelector, useDispatch } from 'react-redux';
import { AppState } from 'redux/store';
import { TabStateType } from 'redux/reducers/TabState';

const TabClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const navTabs = document.querySelectorAll('nav.nav.nav-tabs .nav-item');
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
            console.log(accessmode);
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
            <span
                className={`nav-item nav-link noactivenavlink ${props.link === tablocation ? 'activelink' : ''}`.trim()}
                tab-number={props.childNumber}
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    dispatch({ type: 'OPENTAB', path: props.link, accessmode });
                    TabClick(e);
                }}
            >
                {props.title}
            </span>
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

    SetTabContent() {
        let path;
        if (this.props.location && this.props.location.state) {
            path = this.props.location.state.tab;
        } else {
            if (this.props.children) {
                path = this.props.children[0].props.link;
            }
        }

        if (this.props.MenuAuthState) {
            for (let index = 0; index < this.props.MenuAuthState.length; index++) {
                const Component = this.props.MenuAuthState[index];
                if (Component.link === path) {
                    this.props.OpenTab(path, Component.accessmode);
                    break;
                }
            }
        }
    }

    GetTabsContent() {
        if (this.props.TabState && this.props.TabState.path !== null && this.props.MenuAuthState) {
            let X;
            for (let index = 0; index < this.props.MenuAuthState.length; index++) {
                const Component = this.props.MenuAuthState[index];
                // console.log(Component);
                if (Component.link === this.props.TabState.path) {
                    if (Component.isGlobal === 'Yes' || Component.isGlobal === 1) {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        X = require(`screens/app${Component.componentPath}`);
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        X = require(`screens/${this.props.UserState.current_app}${Component.componentPath}`);
                    }
                    break;
                }
            }

            return <X.default />;
        } else {
            return <React.Fragment />;
        }
    }

    componentDidMount() {
        this.SetTabContent();
    }

    componentWillUnmount() {
        this.props.ClearTab();
    }

    render() {
        const TabsContent = () => this.GetTabsContent();

        return (
            <React.Fragment>
                <nav className="nav nav-tabs">
                    {React.Children.map(this.props.children, (child, index) => {
                        return React.cloneElement(child, { childNumber: index });
                    })}
                </nav>
                <div className="tab-content">{this.props.TabState && this.props.TabState.path && <TabsContent />}</div>
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
