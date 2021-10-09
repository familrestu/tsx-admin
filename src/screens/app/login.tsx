import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { ReactComponent as LoginSVG } from 'assets/svg/login.svg';
import Input from 'components/Input';
import Form from 'components/Form';
import { ButtonGroup } from 'components/Button';
import packagejson from '../../../package.json';

type LoginScreenState = {
    useAccountCode: boolean;
};

class LoginScreen extends React.Component<AppState & typeof MapDispatch, LoginScreenState> {
    state = {
        useAccountCode: false,
    };

    Login(res?: any) {
        if (res && res.data) {
            // this.props.Login(res.data);
            if (res.data.loginStatus) {
                /* for debug purpose */
                if (res.data.debug) {
                    console.log(res);
                    window.setTimeout(() => {
                        window.location.href = window.location.href;
                    }, 3000);
                } else {
                    /* always hard reload - depreacted */
                    window.location.href = window.location.href;
                }
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
                    <Form action="/system/authorization.login" submitCallBack={(res) => this.Login(res)}>
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
                            name="useAccountcode"
                            data="Login with account code=Y"
                            defaultValue={this.state.useAccountCode ? 'Y' : ''}
                            onClick={() =>
                                this.setState((prevState) => {
                                    return { ...prevState, useAccountCode: !prevState.useAccountCode };
                                })
                            }
                        />
                        <ButtonGroup>
                            <button type="submit" className="btn btn-primary">
                                Sign In
                            </button>
                        </ButtonGroup>
                        <div className="row mt-4">
                            <Col className="text-center small text-grey">Web app version {packagejson.version}</Col>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

const MapDispatch = {
    Login: (data: any) => ({ type: 'LOGIN', data }),
};

export default connect(null, MapDispatch)(LoginScreen);
