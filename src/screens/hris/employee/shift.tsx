import React from 'react';
import Input from 'components/Input';
// import Row from 'react-bootstrap/Row';

class AddPersonal extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Input type="filter" label="Leave" name="leave" required />
            </React.Fragment>
        );
    }
}

export default AddPersonal;
