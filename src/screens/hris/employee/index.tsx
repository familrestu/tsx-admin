import React from 'react';
import Page from 'components/Page';
import Table from 'components/Table';
import Column from 'components/Column';
import { Toolbar, BtnLink } from 'components/Toolbar';

const EmployeeListScreen = () => {
    return (
        <Page breadCrumb="Employee|List">
            <Table datasource="emp/EmpData">
                <Toolbar>
                    <BtnLink link="/employee/add" linktype="popup" icon="fas fa-user-plus" label="Add Employee" />
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
};

export default EmployeeListScreen;
