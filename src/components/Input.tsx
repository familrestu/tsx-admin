import React, { Fragment, useRef, useState } from 'react';
import { Row, Col, FormCheck, ColProps, InputGroup } from 'react-bootstrap';
import { get, post } from 'libs/fetch';
import { FormState } from 'components/Form';
import CSS from 'csstype';

const ShowPasswordHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.currentTarget.parentElement?.previousElementSibling;
    if (target) {
        target.setAttribute('type', 'text');
        e.currentTarget.classList.remove('fa-eye');
        e.currentTarget.classList.add('fa-eye-slash');
    }
};

const HidePasswordHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.currentTarget.parentElement?.previousElementSibling;
    if (target) {
        target.setAttribute('type', 'password');
        e.currentTarget.classList.add('fa-eye');
        e.currentTarget.classList.remove('fa-eye-slash');
    }
};

const TogglePasswordHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.currentTarget.parentElement?.previousElementSibling;
    if (target) {
        if (target.getAttribute('type') === 'password') {
            target.setAttribute('type', 'text');
            e.currentTarget.classList.remove('fa-eye');
            e.currentTarget.classList.add('fa-eye-slash');
        } else {
            target.setAttribute('type', 'password');
            e.currentTarget.classList.add('fa-eye');
            e.currentTarget.classList.remove('fa-eye-slash');
        }
    }
};

type InputPropsType = {
    name: string;
    type:
        | 'switch'
        | 'radio'
        | 'checkbox'
        | 'select'
        | 'button'
        | 'password'
        | 'date'
        | 'time'
        | 'text'
        | 'email'
        | 'textarea'
        | 'suggest'
        | 'filter'
        | 'label'
        | 'file'
        | 'search'
        | 'hidden'
        | 'filter';
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
    datasource?: string /* fetch data */;
    formData?: FormState['formData'];
    style?: CSS.Properties;

    onClick?: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, MouseEvent>) => void;
    onDoubleClick?: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, MouseEvent>) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;

    searchClickHandler?: (data: { [key: string]: any }) => void;

    ToggleConfirm?: (show: boolean, message: string) => void;
};

type ColumnPropsType = { size?: InputPropsType['size']; children: React.ReactNode };

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

let selectedChildren = 0;

const Input = (props: InputPropsType) => {
    /* search Hooks */
    const [loadSearch, setLoadsearch] = useState(false);
    const [arrSearchData, setArrSearchData] = useState<{ label: string; value: any }[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    /* i did this so user wont hardcode accessmode into Input components */
    const TempProps: InputPropsType & { accessmode?: number; loggedIn?: boolean } = props;
    const { accessmode, loggedIn } = TempProps;

    const Wrapper = props.groups === undefined ? Row : Fragment;
    let Element = <Fragment />;

    const Events: { [key: string]: (e: any) => void } = {
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
        'form-name': `inp_${props.name}`,
        'form-required': props.required === undefined ? 'false' : `${props.required}`,
        'form-label': props.label,
        ...props.attributes,
    };

    const setInputSearchValue = (label: string, value: string, data?: any) => {
        if (inputRef.current) {
            inputRef.current.value = label;

            if (inputRef.current.parentElement && inputRef.current.parentElement.parentElement) {
                (inputRef.current.parentElement.parentElement.lastChild as HTMLInputElement).value = value;
            }
            window.setTimeout(() => {
                setLoadsearch(false);
                selectedChildren = 0;
            }, 100);

            if (props.searchClickHandler) {
                if (data) {
                    props.searchClickHandler(data);
                }
            }
        }
    };

    /*
        overide readonly based on access.
        only access greater than equal to 1 allowed to write
        0 = Read
        1 = Write
        2 = Update
        3 = Delete
    */
    if (accessmode !== undefined && accessmode < 1 && loggedIn) {
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

    if (props.showif !== undefined && !props.showif) {
        Element = <Fragment />;
    } else {
        /* untuk set attribute datasource, agar saat setFormData di form, akan cari dulu valuenya */
        if (props.datasource) {
            Attr['datasource'] = props.datasource;
        }

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
                            id={`${props.name}-${id}`}
                            className={`inp_${props.name} ${props.className ? props.className : ''}`.trim()}
                            type={type}
                            label={elementLabel}
                            name={props.name}
                            value={elementValue}
                            defaultChecked={props.defaultValue === elementValue}
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
                                    {props.required !== undefined && props.required && <span className="text-danger ms-1 bold">*</span>}
                                </React.Fragment>
                            )}
                            {/* <div className="row">{arrInput}</div> */}
                            <div className="form-inline">{arrInput}</div>
                            {props.textInfo && (
                                <small id={`form-help-${props.name}`} className="form-text text-muted">
                                    {props.textInfo}
                                </small>
                            )}
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
                                    {props.required !== undefined && props.required && <span className="text-danger ms-1 bold">*</span>}
                                </React.Fragment>
                            )}
                            <select
                                id={`inp_${props.name}`}
                                className={`form-control inp_${props.name} ${props.className ? props.className : ''}`.trim()}
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
                            {props.textInfo && (
                                <small id={`form-help-${props.name}`} className="form-text text-muted">
                                    {props.textInfo}
                                </small>
                            )}
                        </div>
                    </Columns>
                </Wrapper>
            );
        } else if (props.type.toUpperCase() === 'FILTER') {
            Element = (
                <Wrapper>
                    <Columns size={12}>
                        {/* khusus filter, sizenya selalu 12 */}
                        <div className="form-group">
                            {props.label !== undefined && (
                                <React.Fragment>
                                    <label className="form-label">{props.label}</label>
                                    {props.required !== undefined && props.required && <span className="text-danger ms-1 bold">*</span>}
                                </React.Fragment>
                            )}
                            <div className="row">
                                <div className="col col-5">
                                    <select
                                        id={`inp_${props.name}`}
                                        className={`form-control inp_${props.name} ${props.className ? props.className : ''}`.trim()}
                                        name={props.name}
                                        style={props.style}
                                        defaultValue={props.defaultValue}
                                        multiple
                                        size={10}
                                        {...Events}
                                        {...Attr}
                                    ></select>
                                </div>
                                <div className="col col-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <button type="button" className="btn btn-light m-2">
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                    <button type="button" className="btn btn-light m-2">
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                </div>
                                <div className="col col-5">
                                    <select
                                        id={`inp_${props.name}`}
                                        className={`form-control inp_${props.name} ${props.className ? props.className : ''}`.trim()}
                                        name={props.name}
                                        style={props.style}
                                        multiple
                                        size={10}
                                        defaultValue={props.defaultValue}
                                        {...Events}
                                        {...Attr}
                                    ></select>
                                </div>
                                <input type="hidden" name={`selected_${props.name}`} />
                            </div>
                        </div>
                    </Columns>
                </Wrapper>
            );
        } else {
            let InpElement = <Fragment />;
            if (props.type.toUpperCase() === 'TEXTAREA') {
                InpElement = (
                    <textarea
                        id={`inp_${props.name}`}
                        name={props.name}
                        className={`form-control inp_${props.name} ${props.className ? props.className : ''}`.trim()}
                        rows={props.rows}
                        maxLength={props.maxLength}
                        style={{ ...props.style, resize: 'none' }}
                        {...Events}
                        {...Attr}
                    >
                        {props.defaultValue}
                    </textarea>
                );
            } else {
                let type = props.type;
                let className = 'form-control';
                let name = props.name;

                if (props.type.toUpperCase() === 'LABEL') {
                    type = 'text';
                    className = 'form-control-plaintext';
                } else if (props.type.toUpperCase() === 'SEARCH') {
                    let searchTimeout: number;
                    type = 'text';
                    name = `${props.name}_label`;

                    Events.onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
                        setLoadsearch(true);
                        const value = e.currentTarget.value;

                        if (props.datasource) {
                            post({ value }, props.datasource, null, (res) => {
                                const { data } = res;
                                setArrSearchData(data.searchData);
                            });
                        }
                    };
                    Events.onBlur = () => {
                        const searchContainer = document.getElementById('input-search-container');
                        if (searchContainer) {
                            const keepFocus = searchContainer.getAttribute('keep-focus');
                            if (keepFocus !== '1') {
                                setLoadsearch(false);
                                selectedChildren = 0;
                            }
                        }
                    };
                    Events.onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
                        const value = e.currentTarget.value;

                        if (e.key === 'ArrowUp' || (e.key === 'ArrowDown' && !loadSearch)) {
                            setLoadsearch(true);
                        }

                        if (e.key === 'ArrowUp') {
                            if (selectedChildren - 1 < 1) {
                                selectedChildren = arrSearchData.length;
                            } else {
                                selectedChildren--;
                            }
                        } else if (e.key === 'ArrowDown') {
                            if (selectedChildren + 1 > arrSearchData.length) {
                                selectedChildren = 1;
                            } else {
                                selectedChildren++;
                            }
                        }

                        const child = document.getElementById(`${props.name}-${selectedChildren}`);

                        if (child) {
                            if (child.parentElement) {
                                const childRect = child.getBoundingClientRect();
                                const childBottom = childRect.bottom;
                                const childTop = childRect.top;
                                const parentClientRect = child.parentElement.getBoundingClientRect();
                                const parentBottom = parentClientRect.bottom;
                                const parentTop = parentClientRect.top;

                                if (selectedChildren > 1 && selectedChildren < arrSearchData.length) {
                                    if (childBottom > parentBottom) {
                                        child.parentElement.scrollTop += childRect.height;
                                    }

                                    if (childTop < parentTop) {
                                        child.parentElement.scrollTop -= childRect.height;
                                    }
                                } else if (selectedChildren === 1) {
                                    child.parentElement.scrollTop = 0;
                                } else {
                                    child.parentElement.scrollTop = parentBottom;
                                }

                                for (let x = 0; x < child.parentElement.children.length; x++) {
                                    const element = child.parentElement.children[x];
                                    element.classList.remove('active');
                                }
                            }

                            child.classList.add('active');
                        }

                        if (props.datasource && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
                            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                                if (child) {
                                    setInputSearchValue(`${child.getAttribute('search-label')}`, `${child.getAttribute('search-value')}`);
                                }
                            } else {
                                window.clearTimeout(searchTimeout);
                                searchTimeout = window.setTimeout(() => {
                                    if (value !== '') {
                                        post({ value }, props.datasource, null, (res) => {
                                            const { data } = res;
                                            setArrSearchData(data.searchData);
                                        });
                                    } else {
                                        get(props.datasource, null, (res) => {
                                            const { data } = res;
                                            setArrSearchData(data.searchData);
                                        });
                                    }
                                }, 100);
                            }
                        }
                    };

                    Attr['input-type'] = 'search';
                } else if (props.type.toUpperCase() === 'HIDDEN') {
                    name = `${name}_hidden`;
                }

                InpElement = (
                    <input
                        ref={inputRef}
                        id={`inp_${props.name}`}
                        className={`${className} inp_${props.name} ${props.className ? props.className : ''}`.trim()}
                        type={type}
                        name={name}
                        defaultValue={
                            props.defaultValue !== undefined
                                ? props.defaultValue
                                : props.formData !== undefined && props.formData !== null && props.formData[name] !== undefined && props.formData[name] !== null
                                ? props.formData[name]
                                : ''
                        }
                        placeholder={props.placeholder}
                        maxLength={props.maxLength}
                        style={props.style}
                        autoComplete="no"
                        {...Events}
                        {...Attr}
                    />
                );

                if (props.type.toUpperCase() === 'SEARCH') {
                    InpElement = (
                        <InputGroup>
                            {InpElement}
                            <div className="input-group-text">
                                <i className="fas fa-search" />
                            </div>
                        </InputGroup>
                    );
                }
            }

            const SearchDropDown = (props: { name: InputPropsType['name'] }) => {
                return (
                    <div
                        className="input-search-container dropdown-menu show"
                        id="input-search-container"
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                            const target = e.currentTarget;
                            target.setAttribute('keep-focus', '1');
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                            const target = e.currentTarget;
                            target.removeAttribute('keep-focus');
                        }}
                    >
                        {arrSearchData.length === 0 ? (
                            <div className="dropdown-item">Loading...</div>
                        ) : (
                            arrSearchData.map((item, index) => {
                                return (
                                    <div
                                        key={`input-search-item-${props.name}-${index}`}
                                        id={`${props.name}-${index + 1}`}
                                        search-number={index + 1}
                                        className="dropdown-item pointer"
                                        search-label={item.label}
                                        search-value={item.value}
                                        onClick={() => setInputSearchValue(item.label, item.value, item)}
                                    >
                                        {item.label}
                                    </div>
                                );
                            })
                        )}
                    </div>
                );
            };

            if (props.type.toUpperCase() === 'HIDDEN') {
                Element = <Fragment>{InpElement}</Fragment>;
            } else {
                Element = (
                    <Wrapper>
                        <Columns size={props.size}>
                            <div className="form-group">
                                {props.label !== undefined && (
                                    <React.Fragment>
                                        <label className="form-label">{props.label}</label>
                                        {props.required !== undefined && props.required && <span className="text-danger ms-1 bold">*</span>}
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
                                            onMouseDown={(e) => ShowPasswordHandler(e)}
                                            onMouseUp={(e) => HidePasswordHandler(e)}
                                            onDoubleClick={(e) => TogglePasswordHandler(e)}
                                        ></i>
                                    </div>
                                )}
                                {props.type.toUpperCase() === 'SEARCH' && loadSearch && props.datasource && <SearchDropDown name={props.name} />}
                                {props.type.toUpperCase() === 'SEARCH' && <input type="hidden" name={props.name} />}
                            </div>
                        </Columns>
                    </Wrapper>
                );
            }
        }
    }

    return Element;
};

export default Input;
