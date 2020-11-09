import React from 'react';
import { Row, Col, FormGroup, Button } from 'react-bootstrap';
import Input from 'components/Input';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import packagejson from '../../package.json';

import { NavLink } from 'react-router-dom';

import { ReactComponent as LoginSVG } from 'assets/svg/login.svg';
import Form from 'components/Form';

type LoginScreenState = {
    useAccountCode: boolean;
};

class LoginScreen extends React.Component<AppState & typeof MapDispatch, LoginScreenState> {
    state = {
        useAccountCode: false,
    };

    render() {
        return (
            <div className="login-container d-flex flex-row">
                <div className="left-container shadow">
                    <LoginSVG />
                </div>

                <div className="right-container p-4 d-flex align-items-center">
                    <Form className="p-4 flex-1" buttonGroup={false} action="core/login" onSubmitSuccessCallBack={this.props.Login}>
                        <Row>
                            <Col>
                                <h2>Welcome</h2>
                            </Col>
                        </Row>
                        {this.state.useAccountCode ? (
                            <React.Fragment>
                                <Input type="text" label="Account Code" size="12" placeholder="accountcode" name="accountcode" />
                                <Input type="text" label="Username" size="12" placeholder="username" name="username" />
                            </React.Fragment>
                        ) : (
                            <Input type="email" label="Email" size="12" placeholder="example@companyemail.com" name="email" />
                        )}
                        <Input type="password" label="Password" size="12" placeholder="Password" name="password" />

                        <Input
                            type="checkbox"
                            name="accountcode"
                            data="Login with account code=Y"
                            size="auto"
                            labelSize="small"
                            defaultChecked={this.state.useAccountCode}
                            onClick={() =>
                                this.setState((prevState) => {
                                    return { ...prevState, useAccountCode: !prevState.useAccountCode };
                                })
                            }
                        />
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Button variant="primary" className="mr-2" type="submit">
                                        Sign in
                                    </Button>
                                </FormGroup>
                            </Col>
                            <Col sm="auto">
                                <FormGroup>
                                    <NavLink className="btn-link small" to="/forgotpassword">
                                        Forgot Password ?
                                    </NavLink>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center small text-grey">Web app version {packagejson.version}</Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

const MapDispatch = {
    Login: () => ({ type: 'LOGIN' }),
};

export default connect(MapStateToProps, MapDispatch)(LoginScreen);
