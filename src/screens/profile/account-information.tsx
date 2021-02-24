import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

import Form from 'components/Form';
import Input from 'components/Input';
import { ButtonGroup, Save, Reset, Cancel } from 'components/Button';

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
        /* if (document.getElementById('form-accountinfo')) {
            (document.getElementById('form-accountinfo') as HTMLFormElement).reset();
        } */
    }

    render() {
        const { UserState } = this.props;

        return (
            <Form datasource={UserState} action="changepassword" id="form-accountinfo">
                <Input type="text" label="Username" size="4" placeholder="username" name="username" readOnly groups="username" />
                <Input
                    label="&nbsp;"
                    type="button"
                    size={2}
                    name="button"
                    className="btn btn-primary"
                    onClick={() => this.changePasswordHandler()}
                    defaultValue={this.state.isChangePassword ? 'Cancel' : 'Change Password'}
                    groups="username"
                />

                <Input type="password" label="Password" placeholder="password" name="password" disabled={!this.state.isChangePassword ? true : false} size="3" groups="password" />
                <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    name="confirm_password"
                    disabled={!this.state.isChangePassword ? true : false}
                    size="3"
                    groups="password"
                />

                <ButtonGroup>
                    <Save />
                    <Reset />
                    <Cancel />
                </ButtonGroup>
            </Form>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

export default connect(MapStateToProps)(AccountInfo);
