import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Row } from 'react-bootstrap';
import Page from 'components/Page';
import Form from 'components/Form';
import Input from 'components/Input';

class EmployeeListDetailScreen extends Component<RouteComponentProps<{ employee_no: string }>> {
    render() {
        return (
            <Page breadCrumb="Employee|List|Details">
                <Form datasource="emp/empData" data={{ employee_no: this.props.match.params.employee_no }}>
                    <Input type="text" label="Name" size="4" placeholder="Full Name" name="full_name" readOnly />
                    <Input type="text" label="Position" size="auto" placeholder="Position" name="position" plaintext readOnly />

                    <Row>
                        <Input type="text" size={3} row="false" label="First name" placeholder="First name" name="first_name" formrequired="true" />
                        <Input type="text" size={3} row="false" label="Middle name" placeholder="Middle name" name="middle_name" />
                        <Input type="text" size={3} row="false" label="Last name" placeholder="Last name" name="last_name" formrequired="true" />
                    </Row>

                    <Input type="email" label="Email" size={4} placeholder="email@example.com" name="email" formrequired="true" />
                    <Input type="radio" label="Gender" size={3} name="gender" data="Male=0,Female=1" />

                    <Row>
                        <Input type="text" label="Birth Place" placeholder="Birth Place" name="birth_place" formrequired="true" size={4} row="false" />
                        <Input type="date" label="Birth Date" placeholder="Birth Date" name="birth_date" formrequired="true" size={3} row="false" />
                    </Row>

                    <Input type="text" label="Phone" placeholder="+62 21 XXX XXXX XXXX" name="phone" size={4} />
                    <Input type="text" label="Mobile Phone" placeholder="+62 21 XXX XXXX XXXX" name="mobile_phone" size={4} />
                    <Input as="textarea" type="text" label="Address" name="address" size={6} rows={5} style={{ resize: 'none' }} />
                </Form>
            </Page>
        );
    }
}

export default EmployeeListDetailScreen;
