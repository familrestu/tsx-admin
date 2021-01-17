import React from 'react';
import { KTPFormat, NPWPFormat } from 'libs/form';
import { Row, Col, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { AxiosError, AxiosResponse } from 'axios';
import { post } from 'libs/fetch';
import Alert from 'components/Alert';

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
    onSubmitSuccessCallBack?: (res: any) => void;
    onSubmitErrorCallBack?: () => void;
    children?: React.ReactNode;
};

type FormState = {
    isLoaded: boolean;
    datasource: string | null;
    isSubmiting: boolean;
    isError: boolean;
};

class Form extends React.Component<FormProps, FormState> {
    form: HTMLFormElement | null | undefined;

    state = {
        isLoaded: false,
        datasource: null,
        isSubmiting: false,
        isError: false,
    };

    FormDataHandler() {
        const { datasource } = this.props;

        if (typeof datasource !== 'undefined') {
            /* if datasource is an object, set is as local datasource state */
            if (typeof datasource === 'object') {
                this.setState({ isLoaded: true, datasource: datasource });
            } else if (typeof datasource === 'string') {
                const pathDsn = datasource as string;
                if (pathDsn.substr(0, 4) === 'http' || pathDsn.substr(0, 5) === 'https') {
                    console.log('lets fetch data');
                }
            }
        }
    }

    SetFormData() {
        if (this.state.datasource !== null) {
            const datasource = this.state.datasource;
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
                            if (elementName !== null && datasource !== null && datasource[elementName]) {
                                if (element.getAttribute('ktp-value')) {
                                    element.defaultValue = KTPFormat(datasource[elementName]);

                                    element.addEventListener('blur', (e: Event) => {
                                        element.value = KTPFormat((e.currentTarget as HTMLInputElement).value);
                                    });
                                    element.addEventListener('focus', (e: Event) => {
                                        element.value = (e.currentTarget as HTMLInputElement).value.toString().replaceAll('-', '');
                                    });
                                } else if (element.getAttribute('npwp-value')) {
                                    element.defaultValue = NPWPFormat(datasource[elementName]);
                                    element.addEventListener('blur', (e: Event) => {
                                        element.value = NPWPFormat((e.currentTarget as HTMLInputElement).value);
                                    });
                                    element.addEventListener('focus', (e: Event) => {
                                        element.value = (e.currentTarget as HTMLInputElement).value.toString().replaceAll('.', '').replaceAll('-', '');
                                    });
                                } else {
                                    element.defaultValue = datasource[elementName] === undefined ? '' : datasource[elementName];
                                }
                            }
                        } else if (elementType === 'checkbox' || elementType === 'radio') {
                            const elementValue = element.value;

                            if (elementName !== null && datasource !== null && datasource[elementName]) {
                                element.defaultChecked = elementValue === (datasource[elementName] as string).toString();
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

            form.classList.add('loading');

            const onSuccessPost = (res: AxiosResponse) => {
                if (res) {
                    if (this.props.onSubmitSuccessCallBack) {
                        this.props.onSubmitSuccessCallBack(res);
                    }
                    /* on success didnt remove class loading on form */
                    // form.classList.remove('loading');
                }
            };

            const onErrorPost = (err: AxiosError) => {
                if (this.props.onSubmitErrorCallBack) {
                    this.props.onSubmitErrorCallBack();
                } else {
                    this.setState({ isError: true });
                }

                form.classList.remove('loading');
                console.error(err);
            };

            post(
                tempFormData,
                this.props.action,
                { withCredentials: true },
                (res: AxiosResponse) => onSuccessPost(res),
                (err: AxiosError) => onErrorPost(err),
            );
        }
    }

    componentDidMount() {
        this.FormDataHandler();
    }

    componentDidUpdate() {
        if (this.state.isLoaded) {
            this.SetFormData();
        }
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
                {this.state.isError && <Alert header="Oops..." body="Something wrong" close={() => this.setState({ isError: false })}></Alert>}
            </React.Fragment>
        );
    }
}

export default Form;
