import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'redux/store';
import { useHistory } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import { GetAccessMode } from 'libs/access';
import { post } from 'libs/fetch';
import { FormState } from 'components/Form';

const setIdBasedOnParent = (ref: HTMLButtonElement | null) => {
    if (ref) {
        const tabPane = ref.closest('#tab-pane');
        const tabContainerName = tabPane ? tabPane.getAttribute('tab-container-name') : '';
        ref.id = `${ref.id}-${tabContainerName}`;
    }
};

const isShowing = (showif: boolean | undefined, minaccess: number, PageState: AppState['PageState'], ModalState: AppState['ModalState'], TabState: AppState['TabState']) => {
    let show = false;
    const accessmode = GetAccessMode(PageState, ModalState, TabState);

    if (showif !== undefined && !showif) {
        show = false;
    } else {
        if (accessmode !== null && accessmode !== undefined && accessmode >= minaccess && accessmode <= 3) {
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
    const PageState = useSelector((state: { PageState: AppState['PageState'] }) => state.PageState);
    const ModalState = useSelector((state: { ModalState: AppState['ModalState'] }) => state.ModalState);
    const TabState = useSelector((state: { TabState: AppState['TabState'] }) => state.TabState);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(isShowing(props.showif, 1, PageState, ModalState, TabState));
    }, [PageState.accessmode, ModalState.accessmode, TabState.accessmode]);

    if (show) {
        return (
            <button
                type="submit"
                btn-type="add"
                ref={(ref) => setIdBasedOnParent(ref)}
                id={`${props.id ? props.id : 'btn-add'}`}
                className={`btn btn-primary ${props.className ? props.className : ''}`.trim()}
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
    const PageState = useSelector((state: AppState) => state.PageState);
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const TabState = useSelector((state: AppState) => state.TabState);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(isShowing(props.showif, 1, PageState, ModalState, TabState));
        return () => {
            if (show) setShow(false);
        };
    }, [PageState.accessmode, ModalState.accessmode, TabState.accessmode]);

    if (show) {
        return (
            <button
                type="reset"
                btn-type="reset"
                ref={(ref) => setIdBasedOnParent(ref)}
                id={`${props.id ? props.id : 'btn-reset'}`}
                className={`btn btn-secondary ${props.className ? props.className : ''}`.trim()}
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    if (props.onClick) {
                        props.onClick(e);
                    }
                }}
            >
                Reset
            </button>
        );
    } else {
        return <React.Fragment />;
    }
};

const Save = (props: ButtonPropsType) => {
    const PageState = useSelector((state: AppState) => state.PageState);
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const TabState = useSelector((state: AppState) => state.TabState);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(isShowing(props.showif, 2, PageState, ModalState, TabState));
    }, [PageState.accessmode, ModalState.accessmode, TabState.accessmode]);

    if (show) {
        return (
            <button
                type="submit"
                btn-type="save"
                ref={(ref) => setIdBasedOnParent(ref)}
                id={`${props.id ? props.id : 'btn-save'}`}
                className={`btn btn-primary ${props.className ? props.className : ''}`.trim()}
                /* onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    if (props.onClick) {
                        props.onClick(e);
                    }
                }} */
            >
                {props.label ? props.label : 'Save'}
            </button>
        );
    } else {
        return <React.Fragment />;
    }
};

type ButtonDeletePropsType = {
    action: string;
    formData?: FormState['formData'];
};

const Delete = (props: ButtonPropsType & ButtonDeletePropsType) => {
    const PageState = useSelector((state: AppState) => state.PageState);
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const TabState = useSelector((state: AppState) => state.TabState);
    const [show, setShow] = useState(false);

    // console.log(props);

    useEffect(() => {
        setShow(isShowing(props.showif, 3, PageState, ModalState, TabState));
    }, [PageState.accessmode, ModalState.accessmode, TabState.accessmode]);

    if (show) {
        return (
            <button
                type="button"
                btn-type="delete"
                ref={(ref) => setIdBasedOnParent(ref)}
                id={`${props.id ? props.id : 'btn-delete'}`}
                className={`btn btn-danger ${props.className ? props.className : ''}`.trim()}
                onClick={() => {
                    if (window.confirm('Are you sure want to delete this data?')) {
                        post(props.formData, props.action, null, (res) => {
                            // window.alert('gampangan gini');
                        });
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
    const dispatch = useDispatch();

    return (
        <button
            type="button"
            btn-type="cancel"
            ref={(ref) => setIdBasedOnParent(ref)}
            id={`${props.id ? props.id : 'btn-cancel'}`}
            className={`btn btn-secondary ${props.className ? props.className : ''}`.trim()}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                if (props.onClick) {
                    props.onClick(e);
                }

                if (ModalState !== undefined && ModalState.isOpened) {
                    e.currentTarget.closest('#modal-content')?.classList.add('hidden');
                    window.setTimeout(() => {
                        dispatch({ type: 'CLOSEMODAL' });
                    }, 250);
                } else {
                    history.goBack();
                }
            }}
        >
            {ModalState !== undefined && ModalState.isOpened ? 'Close' : 'Cancel'}
        </button>
    );
};

type ButtonGroupsPropsType = {
    children?: any;
    formData?: FormState['formData'];
};

const ButtonGroup = (props: ButtonGroupsPropsType) => {
    const LeftElement: JSX.Element[] = [];
    const RightElement: JSX.Element[] = [];

    React.Children.map(props.children, (child, index) => {
        if (React.isValidElement(child)) {
            const tempChild: any = child;
            if (tempChild.type.name === 'Delete' || tempChild.type.name === 'Cancel') {
                RightElement.push(React.cloneElement(child as React.ReactElement<any>, { key: `button-form-right-${index}`, formData: props.formData }));
            } else {
                LeftElement.push(React.cloneElement(child as React.ReactElement<any>, { key: `button-form-left-${index}`, formData: props.formData }));
            }
        }
    });

    return (
        <Row className="form-button-group">
            <Col className="left-group">{LeftElement}</Col>
            <Col className="right-group">{RightElement}</Col>
        </Row>
    );
};

export { Submit, Reset, Save, Delete, Cancel, ButtonGroup };
