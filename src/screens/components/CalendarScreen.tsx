import React, { Component } from 'react';

import Page from 'components/Page';
import Calendar from 'components/Calendar';

class CalendarScreen extends Component {
    render() {
        return (
            <Page breadCrumb="Components|Calendar">
                <Calendar />
            </Page>
        );
    }
}

export default CalendarScreen;
