import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Page from 'components/Page';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { ModalStateType } from 'redux/reducers/ModalState';

class ModalScreen extends Component<AppState & typeof MapDispatch> {
    render() {
        return (
            <Page breadCrumb="Components|Modal">
                <Button onClick={() => this.props.OpenModal('/components/TableScreen', 'Yes')}>Open Modal</Button>
            </Page>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

const MapDispatch = {
    OpenModal: (path: ModalStateType['path'], isGlobal: ModalStateType['isGlobal']) => ({ type: 'OPENMODAL', path, isGlobal }),
};

export default connect(MapStateToProps, MapDispatch)(ModalScreen);
