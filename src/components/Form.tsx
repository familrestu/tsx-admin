import React from 'react';
import { KTPFormat, NPWPFormat } from 'libs/form';
import { Row, Col, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import moment from 'moment';
import { AxiosError, AxiosResponse } from 'axios';
import { post } from 'libs/fetch';

// import Alert from 'components/Alert';

const CancelButton = () => {
    const history = useHistory();

    return (
        <Button variant="secondary" className="btn btn-default mr-2" onClick={() => history.goBack()}>
            Cancel
        </Button>
    );
};

type FormProps = {
    id?: string;
    className?: string;
    datasource?: string;
    action?: string;
    encType?: string;
    buttonGroup?: boolean;
    onSubmitSuccessCallBack?: (res: AxiosResponse) => void;
    onSubmitErrorCallBack?: (err: AxiosError) => void;
    data?: { [key: string]: string | number | Date | string[] | number[] } | { [key: string]: string | number | Date | string[] | number[] }[];
    children?: React.ReactNode;
};

type FormState = {
    isLoaded: boolean;
    datasource: string | null;
    isSubmiting: boolean;
};

class Form extends React.Component<FormProps, FormState> {
    form: HTMLFormElement | null | undefined;

    state = {
        isLoaded: false,
        datasource: null,
        isSubmiting: false,
    };

    FormDataHandler() {
        if (this.props.datasource) {
            /* if datasource is an object, set is as local datasource state */
            if (typeof this.props.datasource === 'object') {
                this.setState({ isLoaded: true, datasource: this.props.datasource }, () => this.SetFormData());
                /* if datasource is a string, fetch it  */
            } else if (typeof this.props.datasource === 'string') {
                const onSuccessPost = (res: AxiosResponse) => {
                    if (res) {
                        if (this.props.onSubmitSuccessCallBack) {
                            this.props.onSubmitSuccessCallBack(res);
                        }

                        this.setState({ isLoaded: true, datasource: res.data }, () => this.SetFormData());
                    }
                };

                const onErrorPost = (err: AxiosError) => {
                    if (this.props.onSubmitErrorCallBack) {
                        this.props.onSubmitErrorCallBack(err);
                    }

                    if (this.form) {
                        this.form.classList.remove('loading');
                        console.error(err);
                    }
                };

                let path: string;
                if (this.props.datasource.split('/').length < 3) {
                    path = `${this.props.datasource}/FormData`;
                } else {
                    path = `${this.props.datasource}`;
                }

                post(
                    this.props.data ? this.props.data : null,
                    path,
                    null,
                    (res: AxiosResponse) => onSuccessPost(res),
                    (err: AxiosError) => onErrorPost(err),
                );
            }
        }
    }

    SetFormData() {
        if (this.state.datasource !== null) {
            const formData = this.state.datasource;
            if (this.form !== null && this.form !== undefined) {
                // find all input inside this form
                const arrInputs = this.form.querySelectorAll('input, textarea, select');

                for (let i = 0; i < arrInputs.length; i++) {
                    const element = arrInputs[i] as HTMLInputElement;

                    const tagName = element.tagName;
                    const elementName = element.getAttribute('name');
                    const elementType = element.getAttribute('type');

                    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                        if (elementType === 'text' || elementType === 'email' || elementType === 'date') {
                            if (elementName !== null && formData !== null && formData[elementName]) {
                                if (element.getAttribute('ktp-value')) {
                                    element.defaultValue = KTPFormat(formData[elementName]);

                                    element.addEventListener('blur', (e: Event) => {
                                        element.value = KTPFormat((e.currentTarget as HTMLInputElement).value);
                                    });
                                    element.addEventListener('focus', (e: Event) => {
                                        element.value = (e.currentTarget as HTMLInputElement).value.toString().replaceAll('-', '');
                                    });
                                } else if (element.getAttribute('npwp-value')) {
                                    element.defaultValue = NPWPFormat(formData[elementName]);
                                    element.addEventListener('blur', (e: Event) => {
                                        element.value = NPWPFormat((e.currentTarget as HTMLInputElement).value);
                                    });
                                    element.addEventListener('focus', (e: Event) => {
                                        element.value = (e.currentTarget as HTMLInputElement).value.toString().replaceAll('.', '').replaceAll('-', '');
                                    });
                                } else {
                                    let formValue = formData[elementName] as string;
                                    if (element.getAttribute('data-type') === 'date') {
                                        formValue = formValue.toString().replace(/[`~!@#$%^&*()_|+-=?;:'",.<>{}[]]/gi, '/');
                                        formValue = moment(new Date(formValue)).format('DD/MM/YYYY');
                                    }

                                    element.defaultValue = formValue === undefined ? '' : formValue;
                                }
                            }
                        } else if (elementType === 'checkbox' || elementType === 'radio') {
                            const elementValue = element.value;
                            if (elementValue && elementName !== null && formData !== null) {
                                if (formData[elementName]) {
                                    element.defaultChecked = elementValue.toString() === (formData[elementName] as string).toString();
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    FormSubmitHandler(e: React.FormEvent) {
        if (this.props.action) {
            e.preventDefault();

            const form = e.currentTarget as HTMLFormElement;
            const arrInputs = form.querySelectorAll('input, select, textarea');
            const tempFormData: { [key: string]: string | null } = {};

            for (let i = 0; i < arrInputs.length; i++) {
                const element = arrInputs[i] as HTMLInputElement;
                const elementType = element.getAttribute('type');

                if (elementType !== null) {
                    if (elementType === 'checkbox' || elementType === 'radio') {
                        if (element.checked) {
                            tempFormData[element.name] = element.value;
                        }
                    } else {
                        tempFormData[element.name] = element.value;
                    }
                }
            }

            if (this.form) {
                this.form.classList.add('loading');
            }

            const onSuccessPost = (res: AxiosResponse) => {
                if (res) {
                    if (this.props.onSubmitSuccessCallBack) {
                        this.props.onSubmitSuccessCallBack(res);
                    }
                }
            };

            const onErrorPost = (err: AxiosError) => {
                if (this.props.onSubmitErrorCallBack) {
                    this.props.onSubmitErrorCallBack(err);
                } else {
                    // this.setState({ isError: true });
                }

                if (this.form) {
                    this.form.classList.remove('loading');
                }
            };

            post(
                tempFormData,
                this.props.action,
                null,
                (res: AxiosResponse) => onSuccessPost(res),
                (err: AxiosError) => onErrorPost(err),
            );
        }
    }

    componentDidMount() {
        this.FormDataHandler();
    }

    render() {
        return (
            <React.Fragment>
                <form
                    ref={(ref) => (this.form = ref)}
                    id={`${this.props.id ? `${this.props.id}` : ''}`.trim()}
                    className={`form ${this.props.className ? `${this.props.className}` : ''}`.trim()}
                    encType={this.props.encType}
                    action={this.props.action}
                    onSubmit={(e: React.FormEvent) => this.FormSubmitHandler(e)}
                >
                    {this.props.children}
                    {(this.props.buttonGroup === undefined || this.props.buttonGroup) && (
                        <Row>
                            <Col xs={6}>
                                <Button variant="primary" className="mr-2" type="submit">
                                    {this.props.datasource ? 'Save' : 'Submit'}
                                </Button>
                                <Button variant="secondary" type="reset" className="mr-2">
                                    Reset
                                </Button>
                            </Col>

                            <Col xs={6} className="d-flex justify-content-end">
                                <CancelButton />
                            </Col>
                        </Row>
                    )}
                </form>
                {/* {this.state.isError && <Alert header="Oops..." body="Something wrong" close={() => this.setState({ isError: false })}></Alert>} */}
            </React.Fragment>
        );
    }
}

export default Form;
