import React from 'react';
import Flex from 'components/Flex';
import Page from 'components/Page';

import { Card } from 'react-bootstrap';

class HomeScreen extends React.Component {
    render() {
        return (
            <Page breadCrumb="Dashboard">
                <Flex flexDirection="row">
                    <Flex className="mr-4">
                        <Card
                            className="shadow"
                            style={{
                                borderLeft: '.25rem solid #1cc88a',
                                width: '18rem',
                            }}
                        >
                            <Card.Header>Today Attendance</Card.Header>
                            <Card.Body></Card.Body>
                        </Card>
                    </Flex>
                    <Flex className="mr-4">
                        <Card
                            className="shadow"
                            style={{
                                borderLeft: '.25rem solid #1cc88a',
                                width: '18rem',
                            }}
                        >
                            <Card.Body>
                                {/* <Card.Title>Test</Card.Title> */}
                                <Card.Text>Test</Card.Text>
                            </Card.Body>
                        </Card>
                    </Flex>
                </Flex>
            </Page>
        );
    }
}

export default HomeScreen;
