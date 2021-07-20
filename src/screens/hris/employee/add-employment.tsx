import React from 'react';
import Input from 'components/Input';
// import Row from 'react-bootstrap/Row';

class AddPersonal extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Input type="text" label="Position" size="auto" placeholder="Position" name="position" required />
                <Input type="label" label="Department" size="auto" placeholder="Department" name="Department" />
                <Input type="label" label="Division" size="auto" placeholder="Division" name="Division" />

                <Input type="label" label="Manager" size="auto" placeholder="Manager" name="Manager" />
                <Input type="label" label="Supervisor" size="auto" placeholder="Supervisor" name="Supervisor" />
            </React.Fragment>
        );
    }
}

export default AddPersonal;
