import React from 'react';
import Input from 'components/Input';
import Row from 'react-bootstrap/Row';

class AddPersonal extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Input type="text" label="Name" size="4" placeholder="Full Name" name="full_name" required />
                {/* <Input type="text" label="Position" size="auto" placeholder="Position" name="position" required /> */}

                <Row>
                    <Input type="text" size={3} label="First name" placeholder="First name" name="first_name" required groups="name" />
                    <Input type="text" size={3} label="Middle name" placeholder="Middle name" name="middle_name" groups="name" />
                    <Input type="text" size={3} label="Last name" placeholder="Last name" name="last_name" required groups="name" />
                </Row>

                {/* <Input type="email" label="Email" size={4} placeholder="email@example.com" name="email" required />
                <Input type="radio" label="Gender" size={3} name="gender" data="Male=0,Female=1" /> */}

                <Row>
                    <Input type="text" label="Birth Place" placeholder="Birth Place" name="birth_place" required size={4} groups="birth" />
                    <Input type="date" label="Birth Date" placeholder="Birth Date" name="birth_date" required size={3} groups="birth" />
                </Row>

                <Input type="text" label="Phone" placeholder="+62 21 XXX XXXX XXXX" name="phone" size={4} />
                <Input type="text" label="Mobile Phone" placeholder="+62 21 XXX XXXX XXXX" name="mobile_phone" size={4} />
                <Input type="textarea" label="Address" name="address" size={6} rows={5} />
            </React.Fragment>
        );
    }
}

export default AddPersonal;
