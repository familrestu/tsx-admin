import React, { Component } from 'react';
import Overlay from 'components/Overlay';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

class Modal extends Component<AppState & typeof MapDispatch> {
    render() {
        if (this.props.ModalState) {
            if (this.props.ModalState.isOpened && this.props.ModalState.path) {
                let X;
                if (this.props.ModalState.isGlobal === 'Yes' || this.props.ModalState.isGlobal === 1) {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    X = require(`../screens${this.props.ModalState.path}`);
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    X = require(`../screens/${this.props.UserState.currentApp}${this.props.ModalState.path}`);
                }

                return (
                    <Overlay>
                        <div className="modal-content shadow" id="modal-content">
                            <div className="modal-header" id="modal-header">
                                <div className="modal-left" id="modal-left"></div>
                                <div className="modal-right" id="modal-right">
                                    <i className="fas fa-times pointer" onClick={() => this.props.CloseModal()}></i>
                                </div>
                            </div>
                            <div className="modal-body" id="modal-body">
                                <X.default modal="modal" />
                            </div>
                            {/* <div className="modal-footer" id="modal-footer"></div> */}
                        </div>
                    </Overlay>
                );
            } else {
                return <React.Fragment />;
            }
        } else {
            return <React.Fragment />;
        }
    }
}

const MapStateToProps = (state: AppState) => ({
    ModalState: state.ModalState,
    UserState: state.UserState,
});

const MapDispatch = {
    CloseModal: () => ({ type: 'CLOSEMODAL' }),
};

export default connect(MapStateToProps, MapDispatch)(Modal);
