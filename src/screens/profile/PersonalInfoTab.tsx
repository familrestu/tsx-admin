import React from 'react';
import { AvatarImage } from 'components/Avatar';
import Form from 'components/Form';
import {
    Row,
    Col,
    FormGroup,
    FormLabel,
    FormCheck,
    FormText,
} from 'react-bootstrap';
import FormControl from 'components/FormControl';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

class PersonalInfoTab extends React.Component<AppState> {
    render() {
        const { UserState } = this.props;
        const AvatarProps = {
            name: UserState !== undefined ? UserState.full_name : '',
            position: UserState !== undefined ? UserState.position_name : '',
            image: UserState !== undefined ? UserState.profile_picture : '',
            company: UserState !== undefined ? UserState.company_name : '',
        };

        return (
            <Form datasource={UserState} action="fetchData">
                <Row>
                    <Col sm={4}>
                        <div className="d-flex m-4 flex-1">
                            <AvatarImage
                                {...AvatarProps}
                                className="shadow"
                                style={{
                                    position: 'relative',
                                    width: '150px',
                                    height: '150px',
                                    fontSize: '5rem',
                                }}
                            >
                                <i
                                    className="fas fa-camera position-absolute text-white p-2"
                                    style={{
                                        bottom: 0,
                                        right: 0,
                                        background: '#22a36b',
                                        fontSize: '17px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => alert('Open Modal')}
                                ></i>
                            </AvatarImage>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col sm={4}>
                        <FormGroup>
                            <FormLabel>Name</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Full Name"
                                name="full_name"
                                readOnly
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm={4}>
                        <FormGroup>
                            <FormLabel>Position</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Position"
                                name="position_name"
                                plaintext
                                readOnly
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm={2}>
                        <FormGroup>
                            <FormLabel>First Name</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="First name"
                                name="first_name"
                                formrequired="true"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={2}>
                        <FormGroup>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Middle name"
                                name="middle_name"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={2}>
                        <FormGroup>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Last name"
                                name="last_name"
                                formrequired="true"
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm={3}>
                        <FormGroup>
                            <FormLabel>Email</FormLabel>
                            <FormControl
                                type="email"
                                placeholder="email@example.com"
                                name="email"
                                formrequired="true"
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm={3}>
                        <FormGroup>
                            <FormLabel>Gender</FormLabel>
                            <Row>
                                <FormCheck
                                    inline
                                    id="male"
                                    type="radio"
                                    label="Male"
                                    name="gender"
                                    value={0}
                                />

                                <FormCheck
                                    inline
                                    id="female"
                                    type="radio"
                                    label="Female"
                                    name="gender"
                                    value={1}
                                />
                            </Row>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm={3}>
                        <FormGroup>
                            <FormLabel>Identification No.</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                name="identification_no"
                                formrequired="true"
                                ktp-value="1"
                                maxLength={16}
                            />

                            <FormText>16 Digit</FormText>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm={3}>
                        <FormGroup>
                            <FormLabel>Tax File No.</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="XX.XXX.XXX.X-XXX.XXX"
                                name="taxfile_no"
                                formrequired="true"
                                className="required"
                                npwp-value="1"
                                maxLength={15}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm={2}>
                        <FormGroup>
                            <FormLabel>Birth Place</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Birth Place"
                                name="birth_place"
                                formrequired="true"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={3}>
                        <FormGroup>
                            <FormLabel>Birth Date</FormLabel>
                            <FormControl
                                type="date"
                                placeholder="Birth Date"
                                name="birth_date"
                                formrequired="true"
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm={2}>
                        <FormGroup>
                            <FormLabel>Phone</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="+62 21 XXX XXXX XXXX"
                                name="phone"
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm={2}>
                        <FormGroup>
                            <FormLabel>Mobile Phone</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="+62 21 XXX XXXX XXXX"
                                name="mobile_phone"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <FormGroup>
                            <FormLabel>Address</FormLabel>
                            <FormControl
                                as="textarea"
                                type="text"
                                name="address"
                                rows={5}
                                style={{ resize: 'none' }}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

export default connect(MapStateToProps)(PersonalInfoTab);
