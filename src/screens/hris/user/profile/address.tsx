import React from 'react';
import Page from 'components/Page';
import Table from 'components/Table';
import Column from 'components/Column';
// import Form from 'components/Form';
// import Input from 'components/Input';
// import { ButtonGroup, Save, Reset, Cancel } from 'components/Button';

const Address = () => {
    return (
        <Page>
            <Table datasource="">
                <Column label="Address Type" name="address_type" type="link" link="/employee/[employee_no]" linktype="popup" />
                <Column label="Address" name="address" />
                <Column label="City" name="city" />
                <Column label="Province" name="province" />
            </Table>
        </Page>
    );
};

export default Address;
