import React, { Component } from 'react';
import Overlay from 'components/Overlay';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { ModalStateType } from 'redux/reducers/ModalState';

class Modal extends Component<AppState & typeof MapDispatch> {
    SetModalAccess() {
        if (this.props.ModalState !== undefined && this.props.UserState !== undefined && this.props.MenuAuthState !== undefined) {
            if (this.props.ModalState.isOpened && this.props.ModalState.path) {
                const path = this.props.ModalState.path;
                const Component = this.props.MenuAuthState.filter((item) => {
                    return item.link === path;
                });
                if (!this.props.ModalState.accessmode) {
                    this.props.SetAccess(Component[0].accessmode);
                }
            }
        }
    }

    componentDidUpdate() {
        this.SetModalAccess();
    }

    render() {
        if (this.props.ModalState !== undefined && this.props.UserState !== undefined && this.props.MenuAuthState !== undefined) {
            if (this.props.ModalState.isOpened && this.props.ModalState.path) {
                // console.log(this)
                const path = this.props.ModalState.path;
                const Component = this.props.MenuAuthState.filter((item) => {
                    return item.link === path;
                });

                let X;
                try {
                    if (Component[0].isGlobal === 'Yes' || Component[0].isGlobal === 1) {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        X = require(`screens/app${Component[0].componentPath}`);
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        X = require(`screens/${this.props.UserState.current_app}${Component[0].componentPath}`);
                    }
                } catch (error) {
                    console.log(error.message);
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    X = require(`screens/app/pagenotfound`);
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
    SetAccess: (accessmode: ModalStateType['accessmode']) => ({ type: 'SETMODALACCESS', accessmode }),
};

export default connect(MapStateToProps, MapDispatch)(Modal);
