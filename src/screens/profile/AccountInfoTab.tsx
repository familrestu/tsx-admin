import React from 'react';
import Form from 'components/Form';
import { Row, Col, FormGroup, FormLabel, Button } from 'react-bootstrap';
import FormControl from 'components/FormControl';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

type LocalState = {
    isChangePassword: boolean;
};

class AccountInfo extends React.Component<AppState, LocalState> {
    state = {
        isChangePassword: false,
    };

    render() {
        const { UserState } = this.props;

        return (
            <Form datasource={UserState} action="changepassword">
                <Row>
                    <Col sm={8}>
                        <FormGroup>
                            <FormLabel>Username</FormLabel>
                            <Row>
                                <Col sm={4}>
                                    <FormControl
                                        type="text"
                                        placeholder="username"
                                        name="username"
                                    />
                                </Col>
                                <Col sm={4} className="d-flex ml-2">
                                    <Button
                                        onClick={() =>
                                            this.setState({
                                                isChangePassword: !this.state
                                                    .isChangePassword,
                                            })
                                        }
                                    >
                                        {this.state.isChangePassword
                                            ? 'Cancel'
                                            : 'Change Password'}
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col></Col>
                </Row>

                <Row>
                    <Col sm={3}>
                        <FormGroup>
                            <FormLabel>Password</FormLabel>
                            <FormControl
                                type="password"
                                placeholder="password"
                                name="password"
                                disabled={
                                    !this.state.isChangePassword ? true : false
                                }
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={3}>
                        <FormGroup>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl
                                type="password"
                                placeholder="password"
                                name="confirm_password"
                                disabled={
                                    !this.state.isChangePassword ? true : false
                                }
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

export default connect(MapStateToProps)(AccountInfo);
