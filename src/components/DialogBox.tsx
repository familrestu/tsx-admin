import React from 'react';
import Overlay from 'components/Overlay';

type AlertPropsType = {
    message: string;
    closeDialogBox: () => void;
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
                    <button className="btn btn-primary" onClick={() => props.closeDialogBox()}>
                        Ok
                    </button>
                </div>
            </div>
        </Overlay>
    );
};

type ConfirmPropsType = {
    message: string;
    onConfirm: () => void;
    closeDialogBox: () => void;
};

const Confirm = (props: ConfirmPropsType) => {
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
                        <button className="btn btn-primary" onClick={() => console.log('process')}>
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </Overlay>
    );
};

export { Alert, Confirm };
