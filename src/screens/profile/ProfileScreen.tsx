import React from 'react';
import Page from 'components/Page';
import { Tabs, Tab } from 'react-bootstrap';
import { NavLinkProps, RouteComponentProps } from 'react-router-dom';
import PersonalInfoTab from './PersonalInfoTab';
import AccountInfoTab from './AccountInfoTab';

const customAttributeName = 'my-tab-number';

type ProfileState = {
    defaultActiveTabs: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
class ProfileScreen extends React.Component<
    NavLinkProps & RouteComponentProps,
    ProfileState
> {
    state = {
        defaultActiveTabs:
            typeof this.props.location !== 'undefined' &&
            this.props.location.state !== null
                ? (this.props.location.state as string)
                : 'personalInformation',
    };

    /* constructor(props: NavLinkProps) {
        super(props);
        this.CheckLocationState();
    } */

    AddNavtabsListener() {
        const arrNavtabs = document.querySelectorAll(
            '.tab-nav-container .nav-item',
        );

        for (let i = 0; i < arrNavtabs.length; i++) {
            const element = arrNavtabs[i];
            /* before add listener, set index as attribute on the nav-items */
            element.setAttribute(customAttributeName, `${i + 1}`);
            element.setAttribute('from', 'left');
            /* add listener */
            element.addEventListener('click', (e: Event) =>
                this.TabClickHandler(e),
            );
        }
    }

    TabClickHandler(e: Event) {
        const currentTarget = e.currentTarget as HTMLDivElement;
        const tabIndex = currentTarget.getAttribute(customAttributeName);

        const activeTab = document.querySelectorAll(
            '.tab-nav-container .nav-item.active',
        )[0] as HTMLDivElement;

        const activeTabIndex = activeTab.getAttribute(customAttributeName);

        /* temporary remarked */
        /* this.props.history.push(
            this.props.location.pathname,
            currentTarget.getAttribute('data-rb-event-key'),
        ); */

        if (activeTabIndex !== null && tabIndex !== null) {
            if (activeTabIndex > tabIndex) {
                // console.log('left');
                activeTab.setAttribute('from', 'right');
                currentTarget.setAttribute('to', 'left');
                currentTarget.removeAttribute('from');
            } else {
                // console.log('right');
                activeTab.setAttribute('from', 'left');
                currentTarget.setAttribute('to', 'right');
                currentTarget.removeAttribute('from');
            }
        }
    }

    /* temporary remarked */
    /* CheckLocationState() {
        if (
            typeof this.props.location !== 'undefined' &&
            this.props.location.state !== null
        ) {
            const shouldNotActive = document.querySelectorAll(
                '.tab-nav-container .nav-item.active',
            )[0] as HTMLDivElement;

            const shouldActive = document.querySelector(
                `.tab-nav-container .nav-item[data-rb-event-key=${
                    this.props.location.state as string
                }]`,
            );

            if (shouldNotActive !== null) {
                shouldNotActive.setAttribute('aria-selected', 'false');
                shouldNotActive.classList.remove('active');
            }

            if (shouldActive !== null) {
                shouldActive.setAttribute('aria-selected', 'true');
                shouldActive.classList.add('active');
            }

            this.setState({
                defaultActiveTabs: this.props.location.state as string,
            });
        }
    } */

    componentDidMount() {
        this.AddNavtabsListener();
    }

    /* temporary remarked */
    /* componentDidUpdate(prevProps: NavLinkProps & RouteComponentProps) {
        if (this.props.location.state !== prevProps.location.state) {
            this.CheckLocationState();
        }
    } */

    render() {
        return (
            <Page breadCrumb="Profile">
                <Tabs
                    defaultActiveKey={this.state.defaultActiveTabs}
                    className="tab-nav-container"
                >
                    <Tab
                        eventKey="personalInformation"
                        title="Personal Information"
                        className="tab-page-container"
                    >
                        <PersonalInfoTab />
                    </Tab>
                    <Tab
                        eventKey="accountInformation"
                        title="Account Information"
                        className="tab-page-container"
                    >
                        <AccountInfoTab />
                    </Tab>
                </Tabs>
            </Page>
        );
    }
}

export default ProfileScreen;
