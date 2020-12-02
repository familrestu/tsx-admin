import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Page from 'components/Page';
import Form from 'components/Form';
import Input from 'components/Input';

class AttendanceDataDetailsScreen extends Component<RouteComponentProps<{ id: string }>> {
    render() {
        return (
            <Page breadCrumb="Attendance|Attendance Data|Details">
                <Form>
                    <Input type="text" label="Username" size="4" placeholder="username" name="username" row="false" />
                    <Input type="select" label="Select Test" size="4" name="select_test" data="1=Male,2=Female" datasource="" />
                </Form>
            </Page>
        );
    }
}

export default AttendanceDataDetailsScreen;
