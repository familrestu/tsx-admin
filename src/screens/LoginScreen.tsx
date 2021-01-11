import React from 'react';
import { Row, Col, FormGroup, Button } from 'react-bootstrap';
import Input from 'components/Input';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { NavLink } from 'react-router-dom';
import { ReactComponent as LoginSVG } from 'assets/svg/login.svg';
import Form from 'components/Form';
import packagejson from '../../package.json';

type LoginScreenState = {
    useAccountCode: boolean;
};

class LoginScreen extends React.Component<AppState & typeof MapDispatch, LoginScreenState> {
    state = {
        useAccountCode: false,
    };

    Login(res: any) {
        if (res.data) {
            this.props.Login(res.data);
            if (res.data.loginStatus) {
                // window.location.reload();
            }
        }
    }

    render() {
        return (
            <div className="login-container">
                <div className="left-container">
                    <LoginSVG />
                </div>

                <div className="right-container">
                    <Form className="p-4 flex-1" buttonGroup={false} action="system/application/Login" onSubmitSuccessCallBack={(res) => this.Login(res)}>
                        <Row>
                            <Col>
                                <h2>Welcome</h2>
                            </Col>
                        </Row>
                        {this.state.useAccountCode ? (
                            <React.Fragment>
                                <Input type="text" label="Account Code" size="12" placeholder="accountcode" name="accountcode" defaultValue="ersys" />
                                <Input type="text" label="Username" size="12" placeholder="username" name="username" defaultValue="dev" />
                            </React.Fragment>
                        ) : (
                            <Input type="email" label="Email" size="12" placeholder="example@companyemail.com" name="email" defaultValue="dev@ersys.com" />
                        )}
                        <Input type="password" label="Password" size="12" placeholder="Password" name="password" defaultValue="password" />

                        <Input
                            type="checkbox"
                            name="is_accountcode"
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
    Login: (data: any) => ({ type: 'LOGIN', data }),
};

export default connect(MapStateToProps, MapDispatch)(LoginScreen);
