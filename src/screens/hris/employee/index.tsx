import React, { Component } from 'react';

import Page from 'components/Page';
import Table from 'components/Table';
import Column from 'components/Column';
import { Toolbar, Button } from 'components/Toolbar';

class EmployeeListScreen extends Component {
    render() {
        return (
            <Page breadCrumb="Employee|List">
                <Table datasource="emp/EmpData">
                    <Toolbar>
                        <Button type="add" link="/employee/add"></Button>
                        <Button type="excel"></Button>
                        <Button type="pdf"></Button>
                        <Button type="preview"></Button>
                    </Toolbar>

                    <Column label="Employee No" name="employee_no" type="link" link="/employee/details/[employee_no]" />
                    <Column label="Full Name" name="full_name" />
                    <Column label="Position" name="position" />
                    <Column label="Department" name="department" />
                    <Column label="Division" name="division" width="350" />
                    <Column label="Join Date" name="join_date" type="date" />
                    <Column label="Grade" name="grade" />
                </Table>
            </Page>
        );
    }
}

export default EmployeeListScreen;
