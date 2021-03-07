import React from 'react';
import Form from 'components/Form';
import Page from 'components/Page';
import Input from 'components/Input';
import Avatar from 'components/Avatar';
import { ButtonGroup, Save, Reset, Cancel } from 'components/Button';

const PersonalInfoTab = () => {
    return (
        <Page>
            <Form datasource="/emp/EmpData/FormData" action="system/application/TestDB">
                <Avatar />
                <Input type="text" label="Name" size="4" placeholder="Full Name" name="full_name" />
                <Input type="label" label="Position" size="auto" placeholder="Position" name="position_name" readOnly />

                <Input type="text" size={3} label="First name" placeholder="First name" name="first_name" required={true} groups="name" />
                <Input type="text" size={3} label="Middle name" placeholder="Middle name" name="middle_name" groups="name" />
                <Input type="text" size={3} label="Last name" placeholder="Last name" name="last_name" required={true} groups="name" />

                <Input type="email" label="Email" size={4} placeholder="email@example.com" name="email" required={true} />
                <Input type="radio" label="Gender" size={3} name="gender" data="Male=0,Female=1" />

                <Input type="text" label="Identification No." placeholder="XXXX-XXXX-XXXX-XXXX" name="identification_no" required={true} ktp-value="1" maxLength={16} size={4} textInfo="16 Digit" />
                <Input type="text" label="Tax File No." placeholder="XX.XXX.XXX.X-XXX.XXX" name="taxfile_no" required={true} className="required" npwp-value="1" maxLength={15} size={4} />

                <Input type="text" label="Birth Place" placeholder="Birth Place" name="birth_place" required={true} size={4} groups="birth" />
                <Input type="date" label="Birth Date" placeholder="Birth Date" name="birth_date" required={true} size={3} groups="birth" />

                <Input type="text" label="Phone" placeholder="+62 21 XXX XXXX XXXX" name="phone" size={4} />
                <Input type="text" label="Mobile Phone" placeholder="+62 21 XXX XXXX XXXX" name="mobile_phone" size={4} />
                <Input type="select" label="Address Type" name="address_type" size={3} data="C=Current Address,I=ID Address,O=Others" />
                <Input type="textarea" label="Address" name="address" size={6} rows={5} style={{ resize: 'none' }} />

                <ButtonGroup>
                    <Save />
                    <Reset />
                    <Cancel />
                </ButtonGroup>
            </Form>
        </Page>
    );
};

export default PersonalInfoTab;
