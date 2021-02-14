import React, { Component } from 'react';
import Overlay from 'components/Overlay';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

/**
 * Modal Components
 * Render page based on ModalState
 * @param {string} ModalState.path find path based on MenuAuthState
 * @param {object} ModalState.params if opened page recieve params like React Router, put that here
 *
 * @example
 *
 * <Modal />
 */
class Modal extends Component<AppState & typeof MapDispatch> {
    render() {
        if (this.props.ModalState !== undefined && this.props.UserState !== undefined && this.props.MenuAuthState !== undefined) {
            if (this.props.ModalState.isOpened && this.props.ModalState.path) {
                // console.log(this)
                const path = this.props.ModalState.path;
                const Component = this.props.MenuAuthState.filter((item) => {
                    return item.link === path;
                });

                // console.log(Component, path);

                let X;
                try {
                    if (Component[0].isGlobal === 'Yes' || Component[0].isGlobal === 1) {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        X = require(`../screens${Component[0].componentPath}`);
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        X = require(`../screens/${this.props.UserState.current_app}${Component[0].componentPath}`);
                    }
                } catch (error) {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    console.log(error.message);
                    X = require(`../screens/PageNotFoundScreen`);
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
    MenuAuthState: state.MenuAuthState,
});

const MapDispatch = {
    CloseModal: () => ({ type: 'CLOSEMODAL' }),
};

export default connect(MapStateToProps, MapDispatch)(Modal);
