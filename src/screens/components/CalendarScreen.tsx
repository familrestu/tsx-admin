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
                    <Calendar />
                </Row>
                <Row>
                    <Col sm={4}>
                        <DatePicker />
                    </Col>
                </Row>
            </Page>
        );
    }
}

export default CalendarScreen;
