import React from 'react';
import Page from 'components/Page';
import Table from 'components/Table';
import Column from 'components/Column';
import { Toolbar, BtnLink } from 'components/Toolbar';
// import { useDispatch } from 'react-redux';

const AccessListing = () => {
    // const dispatch = useDispatch();
    return (
        <Page breadCrumb="Settings|Application Settings|Access|User Menu">
            {/* <div
                className="btn btn-primary"
                onClick={() => {
                    dispatch({ type: 'SETTRIGGER', name: 'FetchTable' });
                }}
            >
                Test Re-Fetch
            </div> */}
            <Table datasource="settings/userMenu.Listing">
                <Toolbar>
                    <BtnLink link="/settings/application/access/user-menu/add" linktype="popup" icon="fas fa-plus" />
                </Toolbar>

                <Column label="Menu Name" name="menu_name" type="link" link="/settings/application/access/user-menu/details/[menu_id]" linktype="popup" />
                <Column label="Group" name="group_name" />
                <Column label="Parent" name="parent_name" />
                <Column label="Link" name="url" />
                <Column label="Path" name="pagepath" />
                <Column label="Menu / Access" name="access_only" masking="0=Access & Menu,1=Access" />
                <Column label="Status" name="status" masking="1=Active,0=Inactive" />
            </Table>
        </Page>
    );
};

export default AccessListing;
