import React, { Component } from 'react';

import Page from 'components/Page';
import Calendar from 'components/Calendar';
import { DatePicker } from 'components/Input';
import { Col, Row } from 'react-bootstrap';

class CalendarScreen extends Component {
    render() {
        return (
            <Page breadCrumb="Components|Calendar" style={{ height: '100vh' }}>
                <Row>
                    <Col>
                        <p>Calendar</p>
                        <Calendar />
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <p>Datepicker</p>
                        <DatePicker />
                    </Col>
                </Row>
            </Page>
        );
    }
}

export default CalendarScreen;
