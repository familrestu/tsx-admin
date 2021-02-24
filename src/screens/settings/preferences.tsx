import React from 'react';
import Page from 'components/Page';
import Input from 'components/Input';
import Fieldset from 'components/Fieldset';

const GetCurrentTheme = () => {
    const localStorageTheme = localStorage.getItem('themes');
    return localStorageTheme === null ? 'light' : localStorageTheme;
};

const changeTheme = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.currentTarget;

    for (let i = 0; i < target.children.length; i++) {
        const option = target.children[i] as HTMLOptionElement;
        if (option.value === target.value) {
            option.selected = true;
            break;
        }
    }

    document.body.setAttribute('themes', target.value);
    localStorage.setItem('themes', target.value);
};

const Preferences = () => {
    return (
        <Page breadCrumb="settings|preferences">
            <Fieldset label="Page Preferences">
                <Input
                    name="theme"
                    label="Choose Theme"
                    size={5}
                    type="select"
                    data="dark=Dark,light=Light"
                    defaultValue={GetCurrentTheme()}
                    // value={GetCurrentTheme()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => changeTheme(e)}
                />
            </Fieldset>
        </Page>
    );
};

export default Preferences;
