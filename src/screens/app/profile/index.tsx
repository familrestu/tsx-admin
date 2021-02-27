import React from 'react';
import Page from 'components/Page';
import { Tabs, Tab } from 'components/Tabs';

// import { useSelector } from 'react-redux';
// import { AppState } from 'redux/store';

const Profile = () => {
    // const MenuAuthState = useSelector((state: AppState) => state.MenuAuthState);
    // const showPersonalInfo = false;
    // const showAccountInfo = false;
    // const showAddress = false;

    return (
        <Page breadCrumb="Profile">
            <Tabs>
                <Tab title="Personal" link="/profile/personal-information" />
                <Tab title="Address" link="/profile/address" />
                <Tab title="Account" link="/profile/account-information" />
                <Tab title="Employee" link="/employee" />
            </Tabs>
        </Page>
    );
};

export default Profile;
