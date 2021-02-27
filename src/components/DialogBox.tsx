import React from 'react';

type AlertPropsType = {
    message: string;
};

const Alert = (props: AlertPropsType) => {
    return <div>ola</div>;
};

type ConfirmPropsType = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

const Confirm = (props: ConfirmPropsType) => {
    return <div></div>;
};

export { Alert, Confirm };
