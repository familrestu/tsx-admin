import React from 'react';
import Overlay from 'components/Overlay';
import { post } from 'libs/fetch';

type AlertPropsType = {
    message: string;
    alertStatus: boolean | null;
    closeDialogBox: () => void;
    CloseModal?: () => void;
};

const Alert = (props: AlertPropsType) => {
    return (
        <Overlay className="dialog overlay-alert" id="overlay-alert-dialog" closeDialogBox={props.closeDialogBox}>
            <div
                className="modal-content shadow hidden dialogbox"
                id="modal-content"
                ref={(ref) => {
                    window.setTimeout(() => {
                        if (ref) {
                            ref.classList.remove('hidden');
                        }
                    }, 250);
                }}
            >
                <div className="modal-body" id="modal-body">
                    <p>{props.message}</p>
                </div>
                <div className="modal-footer justify-content-center pt-0" id="modal-footer">
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            if (props.alertStatus !== null && props.alertStatus) {
                                const arrModal = document.querySelectorAll('.modal-content');

                                for (let i = 0; i < arrModal.length; i++) {
                                    const element = arrModal[i];
                                    element.classList.add('hidden');
                                }
                            }
                            window.setTimeout(() => {
                                props.closeDialogBox();
                            }, 250);
                        }}
                    >
                        Ok
                    </button>
                </div>
            </div>
        </Overlay>
    );
};

type ConfirmPropsType = {
    message: string;
    formData: { [key: string]: any } | null;
    action?: string;
    CloseModal?: () => void;
    showAlert?: (message: string) => void;
    closeDialogBox: () => void;
};

const Confirm = (props: ConfirmPropsType) => {
    // console.log(props);
    return (
        <Overlay className="dialog overlay-alert" id="overlay-alert-dialog" closeDialogBox={props.closeDialogBox}>
            <div
                className="modal-content shadow hidden dialogbox"
                id="modal-content"
                ref={(ref) => {
                    window.setTimeout(() => {
                        if (ref) {
                            ref.classList.remove('hidden');
                        }
                    }, 250);
                }}
            >
                <div className="modal-body" id="modal-body">
                    <p>{props.message}</p>
                </div>
                <div className="modal-footer justify-content-center pt-0" id="modal-footer">
                    <div>
                        <button className="btn btn-primary" onClick={() => props.closeDialogBox()}>
                            No
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (props.action) {
                                    post(
                                        props.formData,
                                        props.action,
                                        null,
                                        (res) => {
                                            props.closeDialogBox();
                                            if (props.showAlert) {
                                                props.showAlert(res.data.message);
                                            }
                                        },
                                        (err: any) => {
                                            if (props.showAlert) {
                                                props.showAlert(err.data.message);
                                            }
                                        },
                                    );
                                }
                            }}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </Overlay>
    );
};

export { Alert, Confirm };
