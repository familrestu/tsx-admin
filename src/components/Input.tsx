import React, { Fragment } from 'react';
import CSS from 'csstype';
import { Row, Col, FormCheck, ColProps } from 'react-bootstrap';

const onMouseDownHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.currentTarget.parentElement?.previousElementSibling;
    if (target) {
        target.setAttribute('type', 'text');
        e.currentTarget.classList.remove('fa-eye');
        e.currentTarget.classList.add('fa-eye-slash');
        // setShowPassword(true);
    }
};

const onMouseUpHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.currentTarget.parentElement?.previousElementSibling;
    if (target) {
        target.setAttribute('type', 'password');
        e.currentTarget.classList.add('fa-eye');
        e.currentTarget.classList.remove('fa-eye-slash');
        // setShowPassword(false);
    }
};

const onDoubleClickHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.currentTarget.parentElement?.previousElementSibling;
    if (target) {
        // console.log(target?.getAttribute('type'));
        if (target.getAttribute('type') === 'password') {
            target.setAttribute('type', 'text');
            e.currentTarget.classList.remove('fa-eye');
            e.currentTarget.classList.add('fa-eye-slash');
        } else {
            target.setAttribute('type', 'password');
            e.currentTarget.classList.add('fa-eye');
            e.currentTarget.classList.remove('fa-eye-slash');
        }
        // target.setAttribute('type', showPassword ? 'password' : 'text');
        // setShowPassword(!showPassword);
    }
};

type InputPropsType = {
    name: string;
    type: 'switch' | 'radio' | 'checkbox' | 'select' | 'button' | 'password' | 'date' | 'time' | 'text' | 'email' | 'textarea' | 'suggest' | 'filter' | 'label' | 'file';
    className?: string;
    id?: string;
    label?: string;
    size?: ColProps['md'] /* ambil colprops yang md saja */;
    placeholder?: string;

    value?: string;
    defaultValue?: string;
    defaultChecked?: boolean;

    maxLength?: number;
    rows?: number /* textarea row */;

    textInfo?: string /* untuk informasi pada form input nya */;
    data?: string /* select | checkbox | radio */;
    groups?: string /* grouping element */;
    attributes?: { [key: string]: string } /* custom attributes */;

    multiple?: boolean /* select */;
    readOnly?: boolean;
    disabled?: boolean;
    required?: boolean;
    showif?: boolean /* true = showing */;

    style?: CSS.Properties;

    onClick?: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, MouseEvent>) => void;
    onDoubleClick?: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, MouseEvent>) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

type ColumnPropsType = { size?: InputPropsType['size']; children: React.ReactNode };

const Input = (props: InputPropsType) => {
    /* i did this so user wont hardcode accessmode into Input components */
    const TempProps: InputPropsType & { accessmode?: number } = props;
    const { accessmode } = TempProps;

    const Wrapper = props.groups === undefined ? Row : Fragment;
    let Element = <Fragment />;

    const Events = {
        onClick: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, MouseEvent>) => {
            if (props.onClick) {
                props.onClick(e);
            }
        },
        onDoubleClick: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, MouseEvent>) => {
            if (props.onDoubleClick) {
                props.onDoubleClick(e);
            }
        },
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            if (props.onChange) {
                props.onChange(e);
            }
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            if (props.onBlur) {
                props.onBlur(e);
            }
        },
    };

    const Attr: { [key: string]: string | boolean | undefined } = {
        readOnly: props.readOnly,
        disabled: props.disabled,
        'form-name': `inp-${props.name}`,
        'form-required': props.required === undefined ? 'false' : `${props.required}`,
        ...props.attributes,
    };

    /*
        overide readonly based on access.
        only access greater than equal to 1 allowed to write
        0 = Read
        1 = Write
        2 = Update
        3 = Delete
    */
    if (accessmode !== undefined && accessmode < 1) {
        Attr.readOnly = true;
        Attr.disabled = true;

        /* remove events */
        Events.onBlur = () => {
            console.log('event removed due to access');
        };
        Events.onChange = () => {
            console.log('event removed due to access');
        };
        Events.onClick = () => {
            console.log('event removed due to access');
        };
        Events.onDoubleClick = () => {
            console.log('event removed due to access');
        };
    }

    const Columns = (props: ColumnPropsType) => {
        return (
            <Col
                sm={props.size === undefined ? 'auto' : 12}
                md={props.size === undefined ? 'auto' : Math.floor((props.size as number) * 1.5)}
                lg={props.size === undefined ? 'auto' : props.size}
                className="pl-0"
            >
                {props.children}
            </Col>
        );
    };

    if (props.showif !== undefined && !props.showif) {
        Element = <Fragment />;
    } else {
        if (props.type.toUpperCase() === 'SWITCH' || props.type.toUpperCase() === 'RADIO' || props.type.toUpperCase() === 'CHECKBOX') {
            const arrInput = [];
            if (props.data) {
                const arrData = props.data.split(',');

                for (let i = 0; i < arrData.length; i++) {
                    const elementLabel = arrData[i].split('=')[0];
                    const elementValue = arrData[i].split('=')[1];
                    const id = elementLabel.toLowerCase().replaceAll(' ', '');
                    const type: any = props.type;

                    arrInput.push(
                        <FormCheck
                            key={`${id}-${i}`}
                            id={id}
                            className={`inp-${props.name} ${props.className ? props.className : ''}`.trim()}
                            type={type}
                            label={elementLabel}
                            name={props.name}
                            value={elementValue}
                            defaultChecked={props.defaultChecked}
                            inline
                            style={props.style}
                            {...Events}
                            {...Attr}
                        />,
                    );
                }
            }

            Element = (
                <Wrapper>
                    <Columns size={props.size}>
                        <div className="form-group">
                            {props.label !== undefined && (
                                <React.Fragment>
                                    <label className="form-label">{props.label}</label>
                                    {props.required !== undefined && props.required && <span className="text-danger ml-1 bold">*</span>}
                                </React.Fragment>
                            )}
                            <div className="row">{arrInput}</div>
                        </div>
                    </Columns>
                </Wrapper>
            );
        } else if (props.type.toUpperCase() === 'SELECT') {
            const arrOpt: React.ReactElement[] = [];

            if (props.data !== undefined) {
                const data = props.data.split(',');
                for (let i = 0; i < data.length; i++) {
                    const optValue = data[i].split('=')[0];
                    const optLabel = data[i].split('=')[1];

                    arrOpt.push(
                        <option key={`option-${i}`} value={optValue}>
                            {optLabel}
                        </option>,
                    );
                }
            }

            if (props.multiple !== undefined) Attr.multiple = props.multiple.toString();
            if (props.rows !== undefined) Attr.size = props.rows.toString();

            Element = (
                <Wrapper>
                    <Columns size={props.size}>
                        <div className="form-group">
                            {props.label !== undefined && (
                                <React.Fragment>
                                    <label className="form-label">{props.label}</label>
                                    {props.required !== undefined && props.required && <span className="text-danger ml-1 bold">*</span>}
                                </React.Fragment>
                            )}
                            <select
                                id={`inp-${props.name}`}
                                className={`form-control inp-${props.name} ${props.className ? props.className : ''}`.trim()}
                                name={props.name}
                                style={props.style}
                                // defaultChecked={props.defaultChecked}
                                defaultValue={props.defaultValue}
                                {...Events}
                                {...Attr}
                            >
                                {props.rows === undefined && <option value="none">-Select-</option>}
                                {arrOpt}
                            </select>
                        </div>
                    </Columns>
                </Wrapper>
            );
        } else {
            let InpElement = <Fragment />;
            if (props.type.toUpperCase() === 'TEXTAREA') {
                InpElement = (
                    <textarea
                        id={`inp-${props.name}`}
                        name={props.name}
                        className={`form-control inp-${props.name} ${props.className ? props.className : ''}`.trim()}
                        rows={props.rows}
                        maxLength={props.maxLength}
                        style={props.style}
                        {...Events}
                        {...Attr}
                    >
                        {props.defaultValue}
                    </textarea>
                );
            } else {
                let type = props.type;
                let className = 'form-control';

                if (props.type.toUpperCase() === 'LABEL') {
                    type = 'text';
                    className = 'form-control-plaintext';
                }

                InpElement = (
                    <input
                        id={`inp-${props.name}`}
                        className={`${className} inp-${props.name} ${props.className ? props.className : ''}`.trim()}
                        type={type}
                        name={props.name}
                        defaultValue={props.defaultValue}
                        placeholder={props.placeholder}
                        maxLength={props.maxLength}
                        style={props.style}
                        {...Events}
                        {...Attr}
                    />
                );
            }

            Element = (
                <Wrapper>
                    <Columns size={props.size}>
                        <div className="form-group">
                            {props.label !== undefined && (
                                <React.Fragment>
                                    <label className="form-label">{props.label}</label>
                                    {props.required !== undefined && props.required && <span className="text-danger ml-1 bold">*</span>}
                                </React.Fragment>
                            )}
                            {InpElement}
                            {props.textInfo && (
                                <small id={`form-help-${props.name}`} className="form-text text-muted">
                                    {props.textInfo}
                                </small>
                            )}
                            {props.type.toUpperCase() === 'PASSWORD' && (
                                <div className="form-icon">
                                    <i
                                        className="fas fa-eye text-grey"
                                        onMouseDown={(e) => onMouseDownHandler(e)}
                                        onMouseUp={(e) => onMouseUpHandler(e)}
                                        onDoubleClick={(e) => onDoubleClickHandler(e)}
                                    ></i>
                                </div>
                            )}
                        </div>
                    </Columns>
                </Wrapper>
            );
        }
    }

    return Element;
};

export default Input;
