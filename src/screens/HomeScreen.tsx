import React from 'react';
import Flex from 'components/Flex';
import Page from 'components/Page';

import { Card } from 'react-bootstrap';

class HomeScreen extends React.Component {
    render() {
        return (
            <Page breadCrumb="Dashboard">
                <Flex flexDirection="row">
                    <Flex flex={1} className="mr-4">
                        <Card className="shadow bl-green">
                            <Card.Body>
                                <Card.Title>Today Attendance</Card.Title>
                            </Card.Body>
                        </Card>
                    </Flex>
                    <Flex flex={1} className="mr-4">
                        <Card className="shadow bl-warning">
                            <Card.Body>
                                <Card.Title>Today Task</Card.Title>
                                <Card.Text>5</Card.Text>
                            </Card.Body>
                        </Card>
                    </Flex>
                    <Flex flex={1} className="mr-4">
                        <Card className="shadow bl-info">
                            <Card.Body>
                                <Card.Title>Today Task</Card.Title>
                                <Card.Text>5</Card.Text>
                            </Card.Body>
                        </Card>
                    </Flex>
                </Flex>
            </Page>
        );
    }
}

export default HomeScreen;
