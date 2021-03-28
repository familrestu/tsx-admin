import React from 'react';
import Page from 'components/Page';
import { Tabs, Tab } from 'components/Tabs';

const Profile = () => {
    return (
        <Page breadCrumb="Profile">
            <Tabs>
                <Tab title="Personal" link="/profile/personal-information" />
                <Tab title="Account" link="/profile/account-information" />
            </Tabs>
        </Page>
    );
};

export default Profile;
