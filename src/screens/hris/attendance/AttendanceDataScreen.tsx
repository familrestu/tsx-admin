import React, { Component } from 'react';

import Page from 'components/Page';
import Table from 'components/Table';
import Column from 'components/Column';

class AttendanceDataScreen extends Component {
    render() {
        return (
            <Page breadCrumb="Attendance|Attendance Data">
                <Table datasource="att/AttData">
                    <Column label="Employee No" name="employee_no" type="link" link="/attendance/attendancedata/details/[date]" />
                    <Column label="Date" name="date" type="date" format="DD MMM, YYYY" width="350" />
                    <Column label="Start Time" name="start_time" type="time" />
                    <Column label="End Time" name="end_time" type="time" />
                    <Column label="Status" name="active" masking="0=Inactive,1=Active" />
                </Table>
            </Page>
        );
    }
}

export default AttendanceDataScreen;
