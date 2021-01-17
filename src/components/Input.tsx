import React, { Component, Fragment, useState } from 'react';
import { FormControl, Row, Col, FormGroup, FormLabel, FormCheck, FormText, InputGroup, Button } from 'react-bootstrap';
import Calendar from 'components/Calendar';
import ReactDOM from 'react-dom';

const Label = (props: any) => {
    if (props.required) {
        return (
            <div className="d-flex">
                <FormLabel>{props.text}</FormLabel>
                <span className="text-danger ml-1 bold">*</span>
            </div>
        );
    } else {
        return <FormLabel>{props.text}</FormLabel>;
    }
};

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

const AddDateSeparator = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (e.key !== 'Backspace' && (value.length === 2 || value.length === 5)) {
        if (value[value.length] !== '/') {
            e.currentTarget.value = value + '/';
        }
    } else if (e.key === 'Backspace' && value[value.length] === '/') {
        e.currentTarget.value = value.substring(0, value.length - 1);
    }
};

const Input = (props: any) => {
    const Wrapper = props.row === undefined ? Row : props.row === 'true' ? Row : Fragment;
    const ShowLabel = props.label === undefined ? false : true;

    const Columns = (props: any) => {
        return (
            <Col sm={props.size === undefined ? 'auto' : 12} md={props.size === undefined ? 'auto' : props.size * 1.5} lg={props.size === undefined ? 'auto' : props.size} className="pl-0">
                {props.children}
            </Col>
        );
    };

    if ((props.type as string).toUpperCase() === 'RADIO' || (props.type as string).toUpperCase() === 'CHECKBOX') {
        const arrInput = [];
        const arrData = props.data.split(',');

        for (let i = 0; i < arrData.length; i++) {
            const elementLabel = arrData[i].split('=')[0];
            const elementValue = arrData[i].split('=')[1];
            const id = (elementLabel as string).toLowerCase().replaceAll(' ', '');

            arrInput.push(
                <FormCheck
                    key={`${id}-${i}`}
                    inline
                    id={id}
                    type={props.type}
                    label={elementLabel}
                    name={props.name}
                    value={elementValue}
                    className={props.labelSize}
                    defaultChecked={props.defaultChecked}
                    onClick={props.onClick}
                />,
            );
        }

        return (
            <Wrapper>
                <Columns {...props}>
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        <Row>{arrInput}</Row>
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Columns>
            </Wrapper>
        );
    } else if ((props.type as string).toUpperCase() === 'BUTTON') {
        return (
            <Wrapper>
                <Columns {...props}>
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text="&nbsp;" required={props.formrequired} />}
                        <FormControl {...props} />
                    </FormGroup>
                </Columns>
            </Wrapper>
        );
    } else if ((props.type as string).toUpperCase() === 'SELECT') {
        const Option = () => {
            const arrOpt: React.ReactElement[] = [];

            if (props.data) {
                const data = (props.data as string).split(',');
                for (let i = 0; i < data.length; i++) {
                    const optValue = (data[i] as string).split('=')[0];
                    const optLabel = (data[i] as string).split('=')[1];

                    arrOpt.push(
                        <option key={`option-${i}`} value={optValue}>
                            {optLabel}
                        </option>,
                    );
                }
            }

            return arrOpt;
        };

        const allProps = { ...props };
        delete allProps['data'];

        return (
            <Wrapper>
                <Columns {...props}>
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        <FormControl {...allProps} as="select">
                            {Option()}
                        </FormControl>
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Columns>
            </Wrapper>
        );
    } else if ((props.type as string).toUpperCase() === 'PASSWORD') {
        return (
            <Wrapper>
                <Columns {...props}>
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        <FormControl {...props} />
                        <div className="form-icon">
                            <i
                                // className={`pointer fas ${!showPassword ? 'fa-eye' : 'fa-eye-slash'} text-grey`}
                                className={`pointer fas fa-eye text-grey`}
                                onMouseDown={(e) => onMouseDownHandler(e)}
                                onMouseUp={(e) => onMouseUpHandler(e)}
                                onDoubleClick={(e) => onDoubleClickHandler(e)}
                            ></i>
                        </div>
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Columns>
            </Wrapper>
        );
    } else if ((props.type as string).toUpperCase() === 'DATE') {
        return (
            <Wrapper>
                <Columns {...props}>
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        <DatePicker {...props} />
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Columns>
            </Wrapper>
        );
    } else if ((props.type as string).toUpperCase() === 'TIME') {
        return (
            <Wrapper>
                <Columns {...props}>
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        <FormControl {...props} type="text" placeholder="--:--" />
                        <div className="form-icon">
                            <i className="fas fa-clock"></i>
                        </div>
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Columns>
            </Wrapper>
        );
    } else {
        return (
            <Wrapper>
                <Columns {...props}>
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        <FormControl {...props} />
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Columns>
            </Wrapper>
        );
    }
};

type InputPortalPropsType = {
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
    sourceElement?: HTMLButtonElement | null | undefined;
};

class InputPortal extends Component<InputPortalPropsType> {
    element: HTMLDivElement;
    bodyElement: HTMLElement | null;

    constructor(props: InputPortalPropsType) {
        super(props);

        this.bodyElement = document.getElementById('body-content');

        /* create new element, to append to body element */
        this.element = document.createElement('div');
        this.element.classList.add('input-portal');
        this.element.classList.add('shadow');
        this.element.id = 'input-portal';

        // console.log(this.props.sourceElement);

        if (this.props.sourceElement) {
            const inputGroupPos = this.props.sourceElement.parentElement?.parentElement?.getBoundingClientRect();

            // console.log(inputGroupPos);
            const bodyElementPos = this.bodyElement?.getBoundingClientRect();

            if (inputGroupPos && bodyElementPos) {
                this.element.style.left = `${inputGroupPos.left - bodyElementPos.left}px`;
                this.element.style.top = `${inputGroupPos.top - bodyElementPos.top}px`;
            }
        }
    }

    componentDidMount() {
        if (this.bodyElement) {
            this.bodyElement.appendChild(this.element);
        }
    }

    componentWillUnmount() {
        if (this.bodyElement) {
            this.bodyElement.removeChild(this.element);
        }
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.element);
    }
}

let DatePickerIconRef: HTMLButtonElement;
let DatePickerInputRef: HTMLInputElement;

const DatePicker = (props: any) => {
    const [datePickerOpened, setToggleDatePicker] = useState(false);

    const Selector = (props: any) => {
        return (
            <InputGroup.Append>
                <Button
                    id="datepicker-icon"
                    onClick={() => setToggleDatePicker(!datePickerOpened)}
                    size={props.size}
                    ref={(ref: HTMLButtonElement) => {
                        DatePickerIconRef = ref;
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.currentTarget.setAttribute('keep-focus', '1');
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.currentTarget.removeAttribute('keep-focus');
                    }}
                    // keep-focus="1"
                >
                    <i className="fas fa-calendar-day"></i>
                </Button>
                {datePickerOpened && (
                    <InputPortal sourceElement={DatePickerIconRef}>
                        <Calendar DatePickerInputRef={DatePickerInputRef} setToggleDatePicker={() => setToggleDatePicker(false)} />
                    </InputPortal>
                )}
            </InputGroup.Append>
        );
    };

    const newProps = {
        ...props,
    };

    delete newProps.ToggleSearch;
    delete newProps.OnKeyPressSearchHandler;
    delete newProps.autoFocus;

    /* not complete */
    const CheckDate = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.currentTarget.value.length === 10) {
            const date = parseInt(e.currentTarget.value.substring(0, 2));
            const month = parseInt(e.currentTarget.value.substring(3, 5));
            const year = parseInt(e.currentTarget.value.substring(6, 10));

            const dates = new Date(`${year}-${month}-${date}`);
            if (dates.toString().toUpperCase() === 'INVALID DATE') {
                console.log(dates);
                e.currentTarget.parentElement?.classList.add('danger');
            }
        }
    };

    const KeyUpHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        AddDateSeparator(e);
        CheckDate(e);
    };

    const KeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // console.log(e.key);
        if (e.key.match(/^[0-9]|Backspace|ArrowLeft|ArrowRight|Enter/) === null) {
            e.preventDefault();
        } else {
            AddDateSeparator(e);

            if (typeof props.OnKeyPressSearchHandler !== 'undefined' && e.key === 'Enter') {
                // setToggleDatePicker(false);
                props.OnKeyPressSearchHandler(e);
            }
        }
    };

    return (
        <InputGroup>
            <FormControl
                {...newProps}
                type="text"
                placeholder="dd/mm/yyyy"
                ref={(ref: HTMLInputElement) => {
                    DatePickerInputRef = ref;
                }}
                autoFocus={props.autoFocus !== undefined ? props.autoFocus : false}
                onBlur={() => {
                    if (props.ToggleSearch !== undefined) {
                        props.ToggleSearch();
                    }
                    // setToggleDatePicker(false);
                }}
                data-type="date"
                onFocus={() => setToggleDatePicker(true)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => KeyDownHandler(e)}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => KeyUpHandler(e)}
                maxLength={10}
            />
            <Selector {...props} />
        </InputGroup>
    );
};

export { DatePicker };

export default Input;
