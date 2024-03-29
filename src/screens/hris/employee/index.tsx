import React from 'react';
import Page from 'components/Page';
import Table from 'components/Table';
import Column from 'components/Column';
import { Toolbar, BtnLink } from 'components/Toolbar';

const EmployeeListScreen = () => {
    return (
        <Page breadCrumb="Employee|Information">
            <Table datasource="/employee/employeeInformation.TableData">
                <Toolbar>
                    <BtnLink
                        link={{
                            pathname: '/employee/add',
                            state: {
                                tab: '/employee/personal',
                            },
                        }}
                        linktype="popup"
                        icon="fas fa-user-plus"
                        label="Add Employee"
                    />
                </Toolbar>

                <Column label="Employee No" name="employee_no" type="link" link="/employee/details/[employee_no]" linktype="popup" />
                <Column label="Full Name" name="full_name" />
                <Column label="Gender" name="gender" width="150" masking="0=Female,1=Male" />
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
