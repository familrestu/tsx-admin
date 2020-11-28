import React, { Component } from 'react';

import Page from 'components/Page';
import Table from 'components/Table';
import Column from 'components/Column';

class AttendanceDataScreen extends Component {
    render() {
        return (
            <Page breadCrumb="Time & Attendance|Attendance Data">
                <Table datasource="attendance/AttData">
                    <Column label="Employee No" name="employee_no" type="link" link="/attendance/attendancedata/details/[date]" />
                    <Column label="Date" name="date" type="date" format="DD MMM, YYYY" width="350" />
                    <Column label="Start Time" name="start_time" />
                    <Column label="End Time" name="end_time" />
                </Table>
            </Page>
        );
    }
}

export default AttendanceDataScreen;
