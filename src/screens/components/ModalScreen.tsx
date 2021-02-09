import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Page from 'components/Page';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { ModalStateType } from 'redux/reducers/ModalState';

class ModalScreen extends Component<AppState & typeof MapDispatch> {
    render() {
        /* seharusnya, open nya ini link aja, bukan component path */
        /* dan di parameter ke-2 nya dibuat adalah parameter yang dikirim kesana */
        /* jadi semisalnya, ada link, didalam modal, harusnya, cari component path nya, berdasarkan link nya */
        /* jika page tersebut menggunakan params dari router, maka pastikan untuk menggail params dari state nya si modal */
        return (
            <Page breadCrumb="Components|Modal">
                <Button onClick={() => this.props.OpenModal('/profile')}>Open Modal</Button>
            </Page>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

const MapDispatch = {
    OpenModal: (path: ModalStateType['path'], modalParams?: ModalStateType['modalParams']) => ({ type: 'OPENMODAL', path, modalParams }),
};

export default connect(MapStateToProps, MapDispatch)(ModalScreen);
