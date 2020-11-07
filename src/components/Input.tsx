import React, { Fragment, useState } from 'react';
import { FormControl, Row, Col, FormGroup, FormLabel, FormCheck, FormText } from 'react-bootstrap';

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
                <Col xs={12} sm={props.size === undefined ? 'auto' : props.size}>
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
    } else {
        let Icon = null;

        if ((props.type as string).toUpperCase() === 'PASSWORD') {
            Icon = (
                <div className="form-icon">
                    <i
                        className={`pointer fas ${!showPassword ? 'fa-eye' : 'fa-eye-slash'} text-grey`}
                        onMouseDown={(e) => onMouseDownHandler(e, showPassword, setShowPassword)}
                        onMouseUp={(e) => onMouseUpHandler(e, showPassword, setShowPassword)}
                        onDoubleClick={(e) => onDoubleClickHandler(e, showPassword, setShowPassword)}
                    ></i>
                </div>
            );
        }

        return (
            <Wrapper>
                <Col xs={12} sm={props.size === undefined ? 'auto' : props.size}>
                    <FormGroup className="position-relative">
                        {ShowLabel && <Label text={props.label} required={props.formrequired} />}
                        <FormControl {...props} />
                        {Icon}
                        {props.text && <FormText>{props.text}</FormText>}
                    </FormGroup>
                </Col>
            </Wrapper>
        );
    }
};

export default Input;
