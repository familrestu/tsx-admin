import React, { Component } from 'react';
import Overlay from 'components/Overlay';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { ModalStateType } from 'redux/reducers/ModalState';

class Modal extends Component<MapStateToPropsType & typeof MapDispatch> {
    _ModalTimeout: number | undefined;

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

    ShowModal() {
        const modalContent = document.getElementById('modal-content');
        if (modalContent) {
            this._ModalTimeout = window.setTimeout(() => {
                modalContent.classList.remove('hidden');
            }, 0);
        }
    }

    componentDidUpdate() {
        this.SetModalAccess();
        if (this.props.ModalState.isOpened && this.props.ModalState.path) {
            this.ShowModal();
        }
    }

    componentWillUnmount() {
        window.clearTimeout(this._ModalTimeout);
    }

    render() {
        if (this.props.ModalState.isOpened && this.props.ModalState.path) {
            // this.ShowModal();
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
            } catch {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                X = require(`screens/app/pagenotfound`);
            }

            return (
                <Overlay>
                    <div className="modal-content shadow hidden" id="modal-content">
                        <div className="modal-header" id="modal-header">
                            <div className="modal-left" id="modal-left"></div>
                            <div className="modal-right" id="modal-right">
                                <i
                                    className="fas fa-times pointer"
                                    onClick={() => {
                                        const modalContent = document.getElementById('modal-content');
                                        if (modalContent) {
                                            modalContent.classList.add('hidden');
                                            window.setTimeout(() => {
                                                this.props.CloseModal();
                                            }, 250);
                                        }
                                    }}
                                ></i>
                            </div>
                        </div>
                        <div className="modal-body" id="modal-body">
                            <X.default modal="modal" />
                        </div>
                    </div>
                </Overlay>
            );
        } else {
            return <React.Fragment />;
        }
    }
}

type MapStateToPropsType = {
    ModalState: AppState['ModalState'];
    UserState: AppState['UserState'];
    MenuAuthState: AppState['MenuAuthState'];
};

const MapStateToProps = (state: MapStateToPropsType) => ({
    ModalState: state.ModalState,
    UserState: state.UserState,
    MenuAuthState: state.MenuAuthState,
});

const MapDispatch = {
    CloseModal: () => ({ type: 'CLOSEMODAL' }),
    SetAccess: (accessmode: ModalStateType['accessmode']) => ({ type: 'SETMODALACCESS', accessmode }),
};

export default connect(MapStateToProps, MapDispatch)(Modal);
