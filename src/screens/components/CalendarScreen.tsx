import React, { Component } from 'react';

import Page from 'components/Page';
import Calendar from 'components/Calendar';
import { Card } from 'react-bootstrap';

class CalendarScreen extends Component {
    render() {
        return (
            <Page breadCrumb="Components|Calendar">
                <Card className="shadow-sm card-border-left-success mb-4">
                    <Card.Header className="calendar-toolbar" id="calendar-toolbar">
                        <div className="left">Calendar</div>
                        <div className="right" id="calendar-toolbar-right"></div>
                    </Card.Header>
                    <Card.Body>
                        <Calendar ToolbarPosition="calendar-toolbar-right" />
                    </Card.Body>
                </Card>
                <Card className="shadow-sm card-border-left-success">
                    <Card.Header>Datepicker</Card.Header>
                    <Card.Body>
                        <Calendar type="datepicker" />
                    </Card.Body>
                </Card>
            </Page>
        );
    }
}

export default CalendarScreen;
