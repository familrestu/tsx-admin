import React from 'react';
import Page from 'components/Page';
import Form from 'components/Form';
import Input from 'components/Input';
import { Save, Reset, Cancel, Delete, ButtonGroup } from 'components/Button';

const EmployeeListDetailScreen = () => {
    return (
        <Page breadCrumb="Employee|Information|Details">
            <Form datasource="/employee/employeeInformation.ViewData" action="emp/EmpData/Update">
                <Input type="text" label="Name" size="4" placeholder="Full Name" name="full_name" readOnly />
                <Input type="text" label="Position" size="6" placeholder="Position" name="position" readOnly />
                <Input type="text" label="Department" size="6" placeholder="Department" name="department" readOnly />
                <Input type="text" label="Division" size="6" placeholder="Division" name="division" readOnly />

                <Input type="text" size={3} label="First name" placeholder="First name" name="first_name" required={true} groups="name" />
                <Input type="text" size={3} label="Middle name" placeholder="Middle name" name="middle_name" groups="name" />
                <Input type="text" size={3} label="Last name" placeholder="Last name" name="last_name" required={true} groups="name" />

                <Input type="email" label="Email" size={4} placeholder="email@example.com" name="email" required={true} />
                <Input type="radio" label="Gender" size={3} name="gender" data="Male=0,Female=1" />

                <Input type="text" label="Birth Place" placeholder="Birth Place" name="birth_place" required={true} size={4} groups="birth" />
                <Input type="date" label="Birth Date" placeholder="Birth Date" name="birth_date" required={true} size={3} groups="birth" />

                <Input type="text" label="Phone" placeholder="+62 21 XXX XXXX XXXX" name="phone" size={4} />
                <Input type="text" label="Mobile Phone" placeholder="+62 21 XXX XXXX XXXX" name="mobile_phone" size={4} />
                <Input type="textarea" label="Address" name="address" size={6} rows={5} />

                <ButtonGroup>
                    <Save />
                    <Reset />
                    <Delete action="/employee/employeeInformation.Delete" />
                    <Cancel />
                </ButtonGroup>
            </Form>
        </Page>
    );
};

export default EmployeeListDetailScreen;
