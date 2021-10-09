import React from 'react';
import Input from 'components/Input';
// import Row from 'react-bootstrap/Row';

class AddPersonal extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Input type="filter" label="Leave" name="leave" required datasource="/employee/employeeInformation.GetShift" data="Yes=1,No=2" />
            </React.Fragment>
        );
    }
}

export default AddPersonal;
