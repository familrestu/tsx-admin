import React, { Fragment } from 'react';
import CSS from 'csstype';
import { TablePropsType, TableStateType } from 'components/Table';
import Navlink from 'components/Navlink';

type ToolbarPropsType = {
    access?: 1 | 2 | 3 | 4 | 'read' | 'write' | 'update' | 'delete';
    datasource?: TablePropsType['datasource'];
    ClearFilter?: () => void;
    children?: React.ReactNode;
};

const Toolbar = (props: ToolbarPropsType & TableStateType) => {
    return (
        <Fragment>
            {props.arrSearchData && props.arrSearchData.length > 0 && (
                <Button
                    type="custom"
                    title="Clear Filter"
                    onClick={() => {
                        if (props.ClearFilter) {
                            props.ClearFilter();
                        }
                    }}
                >
                    <i className="fas fa-filter"></i>
                    <i className="fas fa-times-circle position-absolute" style={{ right: '.25rem', bottom: '.25rem', fontSize: '.75rem' }}></i>
                </Button>
            )}
            {React.Children.map(props.children, (child, index) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { key: `child-cloned-toolbar-button-${index}`, arrTableData: props.arrTableData, datasource: props.datasource });
                }
            })}
        </Fragment>
    );
};

type ToolbarButtonPropsType = {
    type: 'excel' | 'pdf' | 'preview' | 'custom' | 'add';
    title?: string;
    link?: string;
    icon?: string;
    style?: CSS.Properties;
    onClick?: () => void;
    children?: React.ReactNode;
};

const Button = (props: ToolbarButtonPropsType) => {
    let icon = '';
    let title = '';

    if (props.type.toUpperCase() === 'EXCEL') {
        title = 'Export to Ms Excel';
        icon = 'fas fa-file-excel';
    } else if (props.type.toUpperCase() === 'PDF') {
        title = 'Export to PDF';
        icon = 'fas fa-file-pdf';
    } else if (props.type.toUpperCase() === 'PREVIEW') {
        title = 'Print Preview';
        icon = 'fas fa-print';
    } else if (props.type.toUpperCase() === 'ADD') {
        title = 'Add';
        icon = 'fas fa-plus';
    }

    if (props.title !== undefined) {
        title = props.title;
    }

    if (props.icon !== undefined) {
        icon = props.icon;
    }

    const ChildrenElement = (
        <Fragment>
            <i className={icon}></i>
            {props.children}
        </Fragment>
    );

    const ClickEventHandler = () => {
        if (props.onClick) {
            props.onClick();
        } else {
            if (props.type.toUpperCase() === 'EXCEL') {
                console.log(props);
            } else if (props.type.toUpperCase() === 'PDF') {
                console.log(props);
            } else if (props.type.toUpperCase() === 'PREVIEW') {
                console.log(props);
            }
        }
    };
    if (props.link === undefined) {
        return (
            <button className="btn btn-primary" title={title} onClick={() => ClickEventHandler()} style={{ position: 'relative', ...props.style }}>
                {ChildrenElement}
            </button>
        );
    } else {
        return (
            <Navlink className="btn btn-primary" title={title} to={props.link} navtype="">
                {ChildrenElement}
            </Navlink>
        );
    }
};

export { Toolbar, Button };
