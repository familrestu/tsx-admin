import React, { Component } from 'react';

import Page from 'components/Page';
import Calendar from 'components/Calendar';
import { DatePicker } from 'components/Input';
import { Col, Row } from 'react-bootstrap';

class CalendarScreen extends Component {
    render() {
        return (
            <Page breadCrumb="Components|Calendar">
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

                <Row>
                    <Col>
                        <p>HTML 5 Datepicker</p>
                        <input type="date" />
                    </Col>
                </Row>
            </Page>
        );
    }
}

export default CalendarScreen;
