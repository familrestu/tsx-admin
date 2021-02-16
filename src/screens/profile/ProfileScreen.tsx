import React from 'react';
import Page from 'components/Page';
import { Tabs, Tab } from 'components/Tabs';

class ProfileScreen extends React.Component {
    render() {
        return (
            <Page breadCrumb="Profile">
                <Tabs>
                    <Tab title="Personal Information" link="/profile/personal-information" />
                    <Tab title="Account Information" link="/profile/account-information" />
                </Tabs>
            </Page>
        );
    }
}

export default ProfileScreen;
