import React from 'react';
import Input from 'components/Input';
// import Row from 'react-bootstrap/Row';

class AddPersonal extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Input type="date" label="Join Date" placeholder="Join Date" name="join_date" required size={3} />
                <Input
                    type="search"
                    label="Position"
                    size={5}
                    placeholder="Position"
                    name="position_id"
                    datasource="/employee/employeeInformation.GetPositions"
                    required
                    searchClickHandler={(data) => {
                        for (const key in data) {
                            if (document.getElementById(`inp_${key}`)) {
                                (document.getElementById(`inp_${key}`) as HTMLInputElement).value = data[key];
                            }
                        }
                    }}
                />
                <Input type="label" label="Department" size="auto" placeholder="Department" name="department" />
                <Input type="label" label="Division" size="auto" placeholder="Division" name="division" />
                <Input type="label" label="Grade" size="auto" placeholder="Grade" name="grade" />

                <Input type="search" label="Manager" size={6} placeholder="Manager Name" name="manager" />
                <Input type="search" label="Supervisor" size={6} placeholder="Supervisor Name" name="supervisor" />
            </React.Fragment>
        );
    }
}

export default AddPersonal;
