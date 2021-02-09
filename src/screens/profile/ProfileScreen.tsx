import React from 'react';

import { Tabs, Tab } from 'react-bootstrap';
import { NavLinkProps, RouteComponentProps } from 'react-router-dom';

import Page from 'components/Page';

import PersonalInfoTab from './PersonalInfoTab';
import AccountInfoTab from './AccountInfoTab';
import OtherInfoTab from './OtherInfoTab';

const customAttributeName = 'my-tab-number';

type ProfileState = {
    defaultActiveTabs: string;
};

class ProfileScreen extends React.Component<NavLinkProps & RouteComponentProps, ProfileState> {
    state = {
        defaultActiveTabs: typeof this.props.location !== 'undefined' && this.props.location.state !== null ? (this.props.location.state as string) : 'personalInformation',
    };

    AddNavtabsListener() {
        const arrNavtabs = document.querySelectorAll('.tab-nav-container .nav-item');

        for (let i = 0; i < arrNavtabs.length; i++) {
            const element = arrNavtabs[i];
            /* before add listener, set index as attribute on the nav-items */
            element.setAttribute(customAttributeName, `${i + 1}`);
            element.setAttribute('from', 'left');
            /* add listener */
            element.addEventListener('click', (e: Event) => this.TabClickHandler(e));
        }
    }

    TabClickHandler(e: Event) {
        const currentTarget = e.currentTarget as HTMLDivElement;
        const tabIndex = currentTarget.getAttribute(customAttributeName);
        const activeTab = document.querySelectorAll('.tab-nav-container .nav-item.active')[0] as HTMLDivElement;
        const activeTabIndex = activeTab.getAttribute(customAttributeName);

        if (activeTabIndex !== null && tabIndex !== null) {
            if (activeTabIndex > tabIndex) {
                // console.log('left');
                activeTab.setAttribute('from', 'right');
                currentTarget.setAttribute('to', 'left');
                currentTarget.removeAttribute('from');
            } else {
                activeTab.setAttribute('from', 'left');
                currentTarget.setAttribute('to', 'right');
                currentTarget.removeAttribute('from');
            }
        }
    }

    componentDidMount() {
        this.AddNavtabsListener();
    }

    render() {
        return (
            <Page breadCrumb="Profile">
                <Tabs defaultActiveKey={this.state.defaultActiveTabs} /*  className="tab-nav-container" */>
                    <Tab eventKey="personalInformation" title="Personal Information" className="tab-page-container">
                        <PersonalInfoTab />
                    </Tab>
                    <Tab eventKey="accountInformation" title="Account Information" className="tab-page-container">
                        <AccountInfoTab />
                    </Tab>
                    <Tab eventKey="otherInformation" title="Other Information" className="tab-page-container">
                        <OtherInfoTab />
                    </Tab>
                </Tabs>
            </Page>
        );
    }
}

export default ProfileScreen;
