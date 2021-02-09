import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

import { AvatarImage } from 'components/Avatar';
import Form from 'components/Form';
// import Page from 'components/Page';
import Input from 'components/Input';

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
                                className="shadow-sm"
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

                <Input type="text" label="Name" size="4" placeholder="Full Name" name="full_name" readOnly />
                <Input type="text" label="Position" size="auto" placeholder="Position" name="position_name" plaintext readOnly />

                <Row>
                    <Input type="text" size={3} row="false" label="First name" placeholder="First name" name="first_name" formrequired="true" />
                    <Input type="text" size={3} row="false" label="Middle name" placeholder="Middle name" name="middle_name" />
                    <Input type="text" size={3} row="false" label="Last name" placeholder="Last name" name="last_name" formrequired="true" />
                </Row>

                <Input type="email" label="Email" size={4} placeholder="email@example.com" name="email" formrequired="true" />
                <Input type="radio" label="Gender" size={3} name="gender" data="Male=0,Female=1" />

                <Input type="text" label="Identification No." placeholder="XXXX-XXXX-XXXX-XXXX" name="identification_no" formrequired="true" ktp-value="1" maxLength={16} size={4} text="16 Digit" />
                <Input type="text" label="Tax File No." placeholder="XX.XXX.XXX.X-XXX.XXX" name="taxfile_no" formrequired="true" className="required" npwp-value="1" maxLength={15} size={4} />

                <Row>
                    <Input type="text" label="Birth Place" placeholder="Birth Place" name="birth_place" formrequired="true" size={4} row="false" />
                    <Input type="date" label="Birth Date" placeholder="Birth Date" name="birth_date" formrequired="true" size={3} row="false" />
                </Row>

                <Input type="text" label="Phone" placeholder="+62 21 XXX XXXX XXXX" name="phone" size={4} />
                <Input type="text" label="Mobile Phone" placeholder="+62 21 XXX XXXX XXXX" name="mobile_phone" size={4} />
                <Input as="textarea" type="text" label="Address" name="address" size={6} rows={5} style={{ resize: 'none' }} />
            </Form>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

export default connect(MapStateToProps)(PersonalInfoTab);
