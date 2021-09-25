import React from 'react';
import Page from 'components/Page';
import Form from 'components/Form';
// import Input from 'components/Input';
import { Tabs, Tab } from 'components/Tabs';
import { Submit, Reset, Cancel, ButtonGroup } from 'components/Button';

const EmpAdd = () => {
    return (
        <Page breadCrumb="employee|add">
            <Form action="system/application/Login">
                <Tabs>
                    <Tab title="Personal Data" link="/employee/personal" />
                    <Tab title="Employment Data" link="/employee/employment" />
                    <Tab title="Attendance Data" link="/employee/attendance" />
                </Tabs>

                <ButtonGroup>
                    <Submit />
                    <Reset />
                    <Cancel />
                </ButtonGroup>
            </Form>
        </Page>
    );
};

export default EmpAdd;
