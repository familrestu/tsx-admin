import React from 'react';
import Page from 'components/Page';
import Form from 'components/Form';
import Input from 'components/Input';
import { Reset, Cancel, ButtonGroup, Save, Delete } from 'components/Button';

const UsermenuAdd = () => {
    return (
        <Page breadCrumb="Settings|Application Settings|Access|User Menu|Details">
            <Form action="settings/userMenu.Update" datasource="settings/userMenu.Details">
                <Input type="text" label="Name" size="4" placeholder="Menu Name" name="menu_name" required maxLength={50} />
                <Input type="text" label="Group Name" size="4" placeholder="Group Name" name="group_name" />
                <Input type="search" label="Parent" size="4" placeholder="Search Parent..." name="parent_id" datasource="/settings/userMenu.GetParent" />
                <Input type="text" label="Link" size="6" placeholder="URL" name="url" />
                <Input type="text" label="Page Path" size="6" placeholder="Page Path" name="pagepath" />
                <Input type="text" label="Icon" size="3" placeholder="Icon ClassName" name="icon" textInfo="Use fontawesome icon" />

                <Input type="checkbox" label="Access Only?" name="access_only" data="Yes=1" size="6" textInfo="System will not show in user menu if checked" />
                <Input type="select" label="Menu Type" name="menu_type" data="0=User,1=ESS User,2=Admin,9=Super Admin" size="3" required />

                <Input type="checkbox" label="Status" name="menu_status" data="Active=1" />
                <Input type="text" label="Order" size="2" placeholder="Menu Order" name="menu_order" value="1" required />
                <Input type="hidden" name="menu_id" />

                <ButtonGroup>
                    <Save />
                    <Reset />
                    <Delete action="settings/userMenu.Delete" />
                    <Cancel />
                </ButtonGroup>
            </Form>
        </Page>
    );
};

export default UsermenuAdd;
