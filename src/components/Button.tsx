import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { AppState } from 'redux/store';

const isShowing = (showif: boolean | undefined, minaccess: number, PageState: AppState['PageState'], ModalState: AppState['ModalState'], TabState: AppState['TabState']) => {
    let accessmode = null;
    let show = true;

    if (TabState.accessmode !== null) {
        accessmode = TabState.accessmode;
    } else if (ModalState.accessmode !== null && ModalState.isOpened) {
        accessmode = ModalState.accessmode;
    } else {
        accessmode = PageState.accessmode;
    }

    if (showif !== undefined && !showif) {
        show = false;
    } else {
        if (accessmode !== null && accessmode !== undefined && accessmode <= minaccess) {
            show = true;
        } else {
            show = false;
        }
    }

    return show;
};

type ButtonPropsType = {
    id?: string;
    className?: string;
    label?: string;
    showif?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const Submit = (props: ButtonPropsType) => {
    const PageState = useSelector((state: AppState) => state.PageState);
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const TabState = useSelector((state: AppState) => state.TabState);
    const show = isShowing(props.showif, 1, PageState, ModalState, TabState);

    if (show) {
        return (
            <button
                type="submit"
                id={`btn btn-default ${props.id ? props.id : ''}`.trim()}
                className={`btn btn-default ${props.className ? props.className : ''}`.trim()}
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    if (props.onClick) {
                        props.onClick(e);
                    }
                }}
            >
                {props.label ? props.label : 'Add'}
            </button>
        );
    } else {
        return <React.Fragment />;
    }
};

const Reset = (props: ButtonPropsType) => {
    return <button type="button">{props.label ? props.label : 'Reset'}</button>;
};

const Save = (props: ButtonPropsType) => {
    const PageState = useSelector((state: AppState) => state.PageState);
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const TabState = useSelector((state: AppState) => state.TabState);
    const show = isShowing(props.showif, 2, PageState, ModalState, TabState);

    if (show) {
        return (
            <button
                type="submit"
                id={`btn btn-default ${props.id ? props.id : ''}`.trim()}
                className={`btn btn-default ${props.className ? props.className : ''}`.trim()}
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    if (props.onClick) {
                        props.onClick(e);
                    }
                }}
            >
                {props.label ? props.label : 'Save'}
            </button>
        );
    } else {
        return <React.Fragment />;
    }
};

const Delete = (props: ButtonPropsType) => {
    const PageState = useSelector((state: AppState) => state.PageState);
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const TabState = useSelector((state: AppState) => state.TabState);
    const show = isShowing(props.showif, 3, PageState, ModalState, TabState);

    if (show) {
        return (
            <button
                type="button"
                id={`btn btn-default ${props.id ? props.id : ''}`.trim()}
                className={`btn btn-default ${props.className ? props.className : ''}`.trim()}
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    if (props.onClick) {
                        props.onClick(e);
                    }
                }}
            >
                {props.label ? props.label : 'Delete'}
            </button>
        );
    } else {
        return <React.Fragment />;
    }
};

const Cancel = (props: ButtonPropsType) => {
    const history = useHistory();
    const ModalState = useSelector((state: AppState) => state.ModalState);

    return (
        <button
            type="button"
            id={`btn btn-default ${props.id ? props.id : ''}`.trim()}
            className={`btn btn-default ${props.className ? props.className : ''}`.trim()}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                if (ModalState !== undefined && ModalState.isOpened && props.onClick) {
                    props.onClick(e);
                } else {
                    history.goBack();
                }
            }}
        >
            {ModalState !== undefined && ModalState.isOpened ? 'Close' : 'Cancel'}
        </button>
    );
};

export { Submit, Reset, Save, Delete, Cancel };
