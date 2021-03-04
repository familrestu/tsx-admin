import React, { Component } from 'react';

import Page from 'components/Page';
import Table from 'components/Table';
import Column from 'components/Column';
import Form from 'components/Form';
import Input from 'components/Input';
import { Toolbar, BtnLink } from 'components/Toolbar';

class EmployeeListScreen extends Component {
    render() {
        return (
            <Page breadCrumb="Employee|List">
                <Table datasource="emp/EmpData">
                    <Toolbar>
                        <BtnLink link="/employee/add" icon="fas fa-user-plus" label="Add Employee" />
                    </Toolbar>

                    <Column label="Employee No" name="employee_no" type="link" link="/employee/details/[employee_no]" linktype="popup" />
                    <Column label="Full Name" name="full_name" />
                    <Column label="Position" name="position" />
                    <Column label="Department" name="department" />
                    <Column label="Division" name="division" width="350" />
                    <Column label="Join Date" name="join_date" type="date" />
                    <Column label="Grade" name="grade" />
                </Table>

                <Form>
                    <Input type="text" name="testing" label="Testing" />
                </Form>
            </Page>
        );
    }
}

export default EmployeeListScreen;
