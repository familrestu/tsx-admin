import React from 'react';
import { KTPFormat, NPWPFormat } from 'libs/form';
import { Row, Col, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const CancelButton = () => {
    const history = useHistory();

    return (
        <Button variant="secondary" className="btn btn-default mr-2" onClick={() => history.goBack()}>
            Cancel
        </Button>
    );
};

interface FormProps {
    id?: string;
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    datasource?: any;
    action?: string;
    encType?: string;
    buttonGroup?: boolean;
    onSubmitSuccessCallBack?: (res: any) => void;
    onSubmitErrorCallBack?: () => void;
}

type FormState = {
    isLoaded: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    datasource: any;
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
                // tempFormData[element.name] = element.getAttribute('actualValue');

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

            const formData = JSON.stringify(tempFormData);
            axios
                .post(`${process.env.REACT_APP_API_PATH}/${this.props.action}`, JSON.parse(formData), {
                    withCredentials: true,
                })
                .then((res: any) => {
                    if (res) {
                        // alert('succkess');
                        if (this.props.onSubmitSuccessCallBack) {
                            this.props.onSubmitSuccessCallBack(res);
                        }
                    } else {
                        alert(res.data.message);
                        console.log(res.data.error);
                        if (this.props.onSubmitErrorCallBack) {
                            this.props.onSubmitErrorCallBack();
                        }
                    }
                })
                .catch((err) => {
                    // console.log(err);
                    alert(err.message);
                    console.log(err.error);
                    if (this.props.onSubmitSuccessCallBack) {
                        this.props.onSubmitSuccessCallBack(err);
                    }
                });
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
            <form
                ref={(ref) => (this.form = ref)}
                id={this.props.id}
                className={`${this.props.className ? ` ${this.props.className}` : ''}`}
                encType={this.props.encType}
                action={this.props.action}
                onSubmit={(e: React.FormEvent) => this.FormSubmitHandler(e)}
            >
                {this.props.children}
                {(this.props.buttonGroup === undefined || this.props.buttonGroup) && (
                    <Row>
                        <Col sm={6}>
                            <Button variant="primary" className="mr-2">
                                {this.props.datasource ? 'Save' : 'Submit'}
                            </Button>
                            <Button variant="secondary" type="reset" className="mr-2">
                                Reset
                            </Button>
                        </Col>

                        <Col sm={6} className="d-flex justify-content-end">
                            <CancelButton />
                        </Col>
                    </Row>
                )}
            </form>
        );
    }
}

export default Form;
