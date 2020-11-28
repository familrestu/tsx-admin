import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Page from 'components/Page';

class AttendanceDataDetailsScreen extends Component<RouteComponentProps<{ id: string }>> {
    render() {
        return <Page breadCrumb="Time & Attendance|Attendance Data|Details"></Page>;
    }
}

export default AttendanceDataDetailsScreen;
