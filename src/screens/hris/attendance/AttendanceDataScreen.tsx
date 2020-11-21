import React, { Component } from 'react';

import Page from 'components/Page';
import Table from 'components/Table';
import Column from 'components/Column';

class AttendanceDataScreen extends Component {
    render() {
        const data = {
            header: ['date', 'start_time', 'end_time'],
            body: [
                [
                    '2020-01-01',
                    '2020-01-02',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                    '2020-01-03',
                ],
                ['06:45', '07:50', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00', '08:00'],
                ['15:00', '18:00', null],
            ],
        };
        data.body[2][6] = '15:00';
        return (
            <Page breadCrumb="Time & Attendance|Attendance Data">
                <Table data={data}>
                    <Column label="Date" name="date" width="350" />
                    <Column label="Start Time" name="start_time" />
                    <Column label="End Time" name="end_time" />
                    <Column label="Date" name="date" />
                    <Column label="Start Time" name="start_time" />
                    <Column label="End Time" name="end_time" />
                    <Column label="Date" name="date" />
                    <Column label="Start Time" name="start_time" />
                    <Column label="End Time" name="end_time" />
                    <Column label="Date" name="date" />
                    <Column label="Start Time" name="start_time" />
                    <Column label="End Time" name="end_time" />
                    <Column label="Date" name="date" />
                    <Column label="Start Time" name="start_time" />
                    <Column label="End Time" name="end_time" />
                    <Column label="Date" name="date" />
                    <Column label="Start Time" name="start_time" />
                    <Column label="End Time" name="end_time" />
                </Table>
            </Page>
        );
    }
}

export default AttendanceDataScreen;
