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
    onSubmitSuccessCallBack?: () => void;
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
                    const element = arrInputs[i];

                    const tagName = element.tagName;
                    const elementName = element.getAttribute('name');
                    const elementType = element.getAttribute('type');

                    /* (element as HTMLInputElement).setAttribute(
                        'actualValue',
                        datasource[elementName] === undefined
                            ? ''
                            : datasource[elementName],
                    ); */

                    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                        if (elementType === 'text' || elementType === 'email' || elementType === 'date') {
                            if (elementName !== null && datasource !== null) {
                                if ((element as HTMLInputElement).getAttribute('ktp-value')) {
                                    (element as HTMLInputElement).defaultValue = KTPFormat(datasource[elementName]);

                                    (element as HTMLInputElement).addEventListener('blur', (e: Event) => {
                                        (element as HTMLInputElement).value = KTPFormat((e.currentTarget as HTMLInputElement).value);
                                    });
                                    (element as HTMLInputElement).addEventListener('focus', (e: Event) => {
                                        (element as HTMLInputElement).value = (e.currentTarget as HTMLInputElement).value.toString().replaceAll('-', '');
                                    });
                                } else if ((element as HTMLInputElement).getAttribute('npwp-value')) {
                                    (element as HTMLInputElement).defaultValue = NPWPFormat(datasource[elementName]);
                                    (element as HTMLInputElement).addEventListener('blur', (e: Event) => {
                                        (element as HTMLInputElement).value = NPWPFormat((e.currentTarget as HTMLInputElement).value);
                                    });
                                    (element as HTMLInputElement).addEventListener('focus', (e: Event) => {
                                        (element as HTMLInputElement).value = (e.currentTarget as HTMLInputElement).value.toString().replaceAll('.', '').replaceAll('-', '');
                                    });
                                } else {
                                    (element as HTMLInputElement).defaultValue = datasource[elementName] === undefined ? '' : datasource[elementName];
                                }
                            }

                            // console.log(element);
                        } else if (elementType === 'checkbox' || elementType === 'radio') {
                            const elementValue = (element as HTMLInputElement).value;

                            if (elementName !== null && datasource !== null) {
                                (element as HTMLInputElement).defaultChecked = elementValue === (datasource[elementName] as string).toString();
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
                .post(this.props.action, formData)
                .then((res: any) => {
                    if (res) {
                        alert('succkess');

                        if (this.props.onSubmitSuccessCallBack) {
                            this.props.onSubmitSuccessCallBack();
                        }
                    } else {
                        alert(res.data.message);
                        if (this.props.onSubmitErrorCallBack) {
                            this.props.onSubmitErrorCallBack();
                        }
                    }
                })
                .catch((err) => {
                    // console.log(err);
                    alert(err.message);
                    if (this.props.onSubmitSuccessCallBack) {
                        this.props.onSubmitSuccessCallBack();
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
        console.log(this.props.children);
        return (
            <form
                ref={(ref) => (this.form = ref)}
                id={this.props.id}
                className={`p-4${this.props.className ? ` ${this.props.className}` : ''}`}
                encType={this.props.encType}
                action={this.props.action}
                onSubmit={(e: React.FormEvent) => this.FormSubmitHandler(e)}
            >
                {this.props.children}
                {this.props.buttonGroup === undefined ||
                    (this.props.buttonGroup && (
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
                    ))}
            </form>
        );
    }
}

export default Form;
