import React, { Fragment } from 'react';
import { TablePropsType, TableStateType } from 'components/Table';
import { AppState } from 'redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

type ToolbarPropsType = {
    datasource?: TablePropsType['datasource'];
    toolbarPosition?: 'left' | 'right';
    children?: React.ReactNode;
};

const Toolbar = (props: ToolbarPropsType & TableStateType) => {
    return (
        <Fragment>
            {React.Children.map(props.children, (child, index) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        key: `child-cloned-toolbar-button-${index}`,
                        arrTableData: props.arrTableData,
                        datasource: props.datasource,
                        toolbarPosition: props.toolbarPosition,
                    });
                }
            })}
        </Fragment>
    );
};

const ExportToExcel = (props: TableStateType) => {
    return (
        <button
            className="btn btn-primary"
            id="btn-export-to-excel"
            onClick={() => {
                console.log(props.arrTableData);
            }}
        >
            <i className="fas fa-file-excel"></i>
        </button>
    );
};

const ExportToPDF = (props: TableStateType) => {
    return (
        <button
            className="btn btn-primary"
            id="btn-export-to-pdf"
            onClick={() => {
                console.log(props.arrTableData);
            }}
        >
            <i className="fas fa-file-pdf"></i>
        </button>
    );
};

const BtnPrintPreview = (props: TableStateType) => {
    return (
        <button
            className="btn btn-primary"
            id="btn-export-to-pdf"
            onClick={() => {
                console.log(props.arrTableData);
            }}
        >
            <i className="fas fa-print"></i>
        </button>
    );
};

type BtnLinkPropsType = {
    link: string;
    icon?: string;
    minaccess?: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete';
    linktype?: string;
    label?: string;
    showif?: boolean;
    position?: 'left' | 'right';
    toolbarPosition?: 'left' | 'right';
};

const BtnLink = (props: TableStateType & BtnLinkPropsType) => {
    const AccessState = useSelector((state: AppState) => state.AccessState);
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const TabState = useSelector((state: AppState) => state.TabState);
    const dispatch = useDispatch();
    let show = false;
    let accessmode: AppState['TabState']['accessmode'] = 0;
    const thisPosition = props.position === undefined ? 'right' : props.position;
    // console.log(props);

    /* automatic not showing btn link if didn't get access */
    for (let x = 0; x < AccessState.length; x++) {
        const Access = AccessState[x];

        if (Access.url === props.link) {
            show = true;
            accessmode = Access.accessmode;
            break;
        } else {
            accessmode = 0;
        }
    }

    if (props.minaccess && props.minaccess >= accessmode) {
        show = false;
    }

    if (props.toolbarPosition !== thisPosition) {
        show = false;
    }

    const Label = props.label === undefined ? <Fragment /> : <span>{props.label}</span>;
    const Icon = props.icon === undefined ? <Fragment /> : <i className={props.icon}></i>;

    if ((props.showif !== undefined && !props.showif) || !show) {
        return <Fragment />;
    } else {
        if (TabState !== undefined && TabState.path !== null && props.linktype && props.linktype !== 'popup') {
            return (
                <button className="btn btn-primary" onClick={() => dispatch({ type: 'OPENTAB', path: props.link, accessmode })}>
                    {Icon}
                    {Label}
                </button>
            );
        } else if ((ModalState !== undefined && ModalState.isOpened && ModalState.path !== null) || (props.linktype && props.linktype === 'popup')) {
            return (
                <button className="btn btn-primary" onClick={() => dispatch({ type: 'OPENMODAL', path: props.link, accessmode })}>
                    {Icon}
                    {Label}
                </button>
            );
        } else {
            return (
                <NavLink className="btn btn-primary" to={props.link}>
                    {Icon}
                    {Label}
                </NavLink>
            );
        }
    }
};

Toolbar.displayName = 'Toolbar';
ExportToExcel.displayName = 'ExportToExcel';
ExportToPDF.displayName = 'ExportToPDF';
BtnPrintPreview.displayName = 'BtnPrintPreview';
BtnLink.displayName = 'BtnLink';

export { Toolbar, ExportToExcel, ExportToPDF, BtnPrintPreview, BtnLink };
