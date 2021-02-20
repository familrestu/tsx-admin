import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

import Form from 'components/Form';
import { Row } from 'react-bootstrap';
import Input from 'components/Input';

type LocalState = {
    isChangePassword: boolean;
};

class AccountInfo extends React.Component<AppState, LocalState> {
    state = {
        isChangePassword: false,
    };

    changePasswordHandler() {
        this.setState({
            isChangePassword: !this.state.isChangePassword,
        });
        if (document.getElementById('form-accountinfo')) {
            (document.getElementById('form-accountinfo') as HTMLFormElement).reset();
        }
    }

    render() {
        const { UserState } = this.props;

        return (
            <Form datasource={UserState} action="changepassword" id="form-accountinfo">
                <Row>
                    <Input type="text" label="Username" size="4" placeholder="username" name="username" row="false" readOnly />
                    <Input
                        label="&nbsp;"
                        type="button"
                        size="auto"
                        className="btn btn-primary"
                        onClick={() => this.changePasswordHandler()}
                        value={this.state.isChangePassword ? 'Cancel' : 'Change Password'}
                        row="false"
                    />
                </Row>

                <Input type="password" label="Password" placeholder="password" name="password" disabled={!this.state.isChangePassword ? true : false} size="3" />
                <Input type="password" label="Confirm Password" placeholder="Confirm Password" name="confirm_password" disabled={!this.state.isChangePassword ? true : false} size="3" />
            </Form>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

export default connect(MapStateToProps)(AccountInfo);
