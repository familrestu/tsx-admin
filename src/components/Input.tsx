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

const onMouseDownHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>, showPassword: boolean, setShowPassword: React.Dispatch<React.SetStateAction<boolean>>) => {
    const target = e.currentTarget.parentElement?.previousElementSibling;
    if (target && !showPassword) {
        target.setAttribute('type', 'text');
        setShowPassword(true);
    }
};

const onMouseUpHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>, showPassword: boolean, setShowPassword: React.Dispatch<React.SetStateAction<boolean>>) => {
    const target = e.currentTarget.parentElement?.previousElementSibling;
    if (target && showPassword) {
        target.setAttribute('type', 'password');
        setShowPassword(false);
    }
};

const onDoubleClickHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>, showPassword: boolean, setShowPassword: React.Dispatch<React.SetStateAction<boolean>>) => {
    const target = e.currentTarget.parentElement?.previousElementSibling;
    if (target) {
        target.setAttribute('type', showPassword ? 'password' : 'text');
        setShowPassword(!showPassword);
    }
};

const Input = (props: any) => {
    const Wrapper = props.row === undefined ? Row : props.row === 'true' ? Row : Fragment;
    const ShowLabel = props.label === undefined ? false : true;
    const [showPassword, setShowPassword] = useState(false);

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
                <Col xs={12} sm={props.size === undefined ? 'auto' : props.size} className="pl-0">
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        <Row>{arrInput}</Row>
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Col>
            </Wrapper>
        );
    } else if ((props.type as string).toUpperCase() === 'BUTTON') {
        return (
            <Wrapper>
                <Col xs={12} sm={props.size === undefined ? 'auto' : props.size}>
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text="&nbsp;" required={props.formrequired} />}
                        <FormControl {...props} />
                    </FormGroup>
                </Col>
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
                <Col xs={12} sm={props.size === undefined ? 'auto' : props.size} className="pl-0">
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        <FormControl {...allProps} as="select">
                            {Option()}
                        </FormControl>
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Col>
            </Wrapper>
        );
    } else if ((props.type as string).toUpperCase() === 'PASSWORD') {
        return (
            <Wrapper>
                <Col xs={12} sm={props.size === undefined ? 'auto' : props.size} className="pl-0">
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        <FormControl {...props} />
                        <div className="form-icon">
                            <i
                                className={`pointer fas ${!showPassword ? 'fa-eye' : 'fa-eye-slash'} text-grey`}
                                onMouseDown={(e) => onMouseDownHandler(e, showPassword, setShowPassword)}
                                onMouseUp={(e) => onMouseUpHandler(e, showPassword, setShowPassword)}
                                onDoubleClick={(e) => onDoubleClickHandler(e, showPassword, setShowPassword)}
                            ></i>
                        </div>
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Col>
            </Wrapper>
        );
    } else if ((props.type as string).toUpperCase() === 'DATE') {
        return (
            <Wrapper>
                <Col xs={12} sm={props.size === undefined ? 'auto' : props.size} className="pl-0">
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        {/* <FormControl {...props} /> */}
                        <DatePicker {...props} />
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Col>
            </Wrapper>
        );
    } else {
        return (
            <Wrapper>
                <Col xs={12} sm={props.size === undefined ? 'auto' : props.size} className="pl-0">
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        <FormControl {...props} />
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Col>
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

let DatePickerRef: HTMLButtonElement;
const DatePicker = (props: any) => {
    const [datePickerOpened, setToggleDatePicker] = useState(false);

    const Selector = (props: any) => {
        return (
            <InputGroup.Append>
                <Button
                    onClick={() => setToggleDatePicker(!datePickerOpened)}
                    size={props.size}
                    ref={(ref: HTMLButtonElement) => {
                        DatePickerRef = ref;
                    }}
                >
                    <i className="fas fa-calendar-day"></i>
                </Button>
                {datePickerOpened && (
                    <InputPortal sourceElement={DatePickerRef}>
                        <Calendar />
                    </InputPortal>
                )}
            </InputGroup.Append>
        );
    };

    return (
        <InputGroup>
            <FormControl
                {...props}
                type="text"
                placeholder="dd/mm/yyyy"
                // onBlur={(e: React.FocusEvent<HTMLInputElement>) => this.ToggleSearch(e)}
                // onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => this.OnKeyPressSearchHandler(e)}
            />
            <Selector {...props} />
        </InputGroup>
    );
};

export { DatePicker };

export default Input;
