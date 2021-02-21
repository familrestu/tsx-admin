import React from 'react';
import ReactDOM from 'react-dom';
import { Col, Button } from 'react-bootstrap';
import { useHistory, withRouter, RouteComponentProps } from 'react-router-dom';

import moment from 'moment';
import { AxiosError, AxiosResponse } from 'axios';

// import Alert from 'components/Alert';
import { connect, useSelector, useDispatch } from 'react-redux';
import { AppState } from 'redux/store';

import { post } from 'libs/fetch';
import { KTPFormat, NPWPFormat } from 'libs/form';

const CancelButton = (props: { isModal: boolean; onClick: () => void }) => {
    const history = useHistory();

    return (
        <Button
            variant="secondary"
            className="btn btn-default mr-2"
            onClick={() => {
                if (props.isModal !== undefined && props.isModal && props.onClick) {
                    props.onClick();
                } else {
                    history.goBack();
                }
            }}
        >
            {props.isModal !== undefined && props.isModal ? 'Close' : 'Cancel'}
        </Button>
    );
};

const ButtonDeleteHandler = () => {
    if (window.confirm('Are you sure want to delete this data?')) {
        console.log('yes');
    }
};

type ButtonGroupPropsType = {
    datasource?: string;
    action?: string;
    workFlow?: boolean;
};

const ButtonGroupTemp = (props: ButtonGroupPropsType & RouteComponentProps) => {
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const MenuAuthState = useSelector((state: AppState) => state.MenuAuthState);
    const dispatch = useDispatch();
    const arrAuth = MenuAuthState.filter((a) => {
        return a.link === (ModalState.isOpened ? ModalState.path : props.match.path);
    });
    const AccessMode = arrAuth.length > 0 ? arrAuth[0].accessmode : 0;
    // console.log(AccessMode);

    // 0 = Read
    // 1 = Write
    // 2 = Update
    // 3 = Delete

    return (
        <div className="form-button-group">
            <Col>
                {!props.datasource && AccessMode >= 1 && (
                    <Button variant="primary" className="mr-2" type="submit">
                        Submit
                    </Button>
                )}
                {props.datasource && AccessMode >= 2 && (
                    <Button variant="primary" className="mr-2" type="submit">
                        Update
                    </Button>
                )}
                {((!props.datasource && AccessMode >= 1) || (props.datasource && AccessMode >= 2)) && (
                    <Button variant="secondary" type="reset" className="mr-2">
                        Reset
                    </Button>
                )}
            </Col>

            <Col className="d-flex justify-content-end">
                <CancelButton isModal={ModalState && ModalState.isOpened ? true : false} onClick={() => dispatch({ type: 'CLOSEMODAL' })} />
                {AccessMode >= 3 && (
                    <Button variant="danger" type="button" onClick={() => ButtonDeleteHandler()}>
                        Delete
                    </Button>
                )}
            </Col>
        </div>
    );
};

const ButtonGroup = withRouter(ButtonGroupTemp);

type FormProps = {
    id?: string;
    className?: string;
    datasource?: string;
    action?: string;
    encType?: string;

    workFlow?: boolean;
    buttonGroup?: boolean;

    onSubmitSuccessCallBack?: (res: AxiosResponse) => void;
    onSubmitErrorCallBack?: (err: AxiosError) => void;
    params?: { [key: string]: string | number | Date | string[] | number[] } | { [key: string]: string | number | Date | string[] | number[] }[];
    children?: React.ReactNode;
};

type FormState = {
    isLoaded: boolean;
    formData: { [key: string]: any } | null;
    isSubmiting: boolean;
};

class Form extends React.Component<FormProps & AppState, FormState> {
    _Form: HTMLFormElement | null | undefined;
    _CurrentPath: string = window.location.pathname;
    _PrevPath: string | undefined;

    state = {
        isLoaded: false,
        formData: null,
        isSubmiting: false,
    };

    GetFormData() {
        if (this.props.datasource) {
            if (this._Form) {
                this._Form.classList.add('loading');
            }

            /* if datasource is an object, set is as local datasource state */
            if (typeof this.props.datasource === 'object') {
                this.setState({ isLoaded: true, formData: this.props.datasource }, () => this.SetFormData());
                /* if datasource is a string, fetch it  */
            } else if (typeof this.props.datasource === 'string') {
                const onSuccessPost = (res: AxiosResponse) => {
                    if (res) {
                        if (this.props.onSubmitSuccessCallBack) {
                            this.props.onSubmitSuccessCallBack(res);
                        }

                        const formData = res.data;
                        delete formData.status;

                        // console.log(JSON.stringify(this.state.formData) !== JSON.stringify(formData));

                        if (JSON.stringify(this.state.formData) !== JSON.stringify(formData)) {
                            this.setState({ isLoaded: true, formData: formData }, () => this.SetFormData());
                        }
                    }
                };

                const onErrorPost = (err: AxiosError) => {
                    if (this.props.onSubmitErrorCallBack) {
                        this.props.onSubmitErrorCallBack(err);
                    }

                    if (this._Form) {
                        this._Form.classList.remove('loading');
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
                    this.props.params ? this.props.params : null,
                    path,
                    null,
                    (res: AxiosResponse) => onSuccessPost(res),
                    (err: AxiosError) => onErrorPost(err),
                );
            }
        }
    }

    SetFormData() {
        if (this.state.formData !== null) {
            const formData = this.state.formData;
            if (this._Form !== null && this._Form !== undefined) {
                // find all input inside this form
                const arrInputs = this._Form.querySelectorAll('input, textarea, select');

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

                if (this._Form) {
                    this._Form.classList.remove('loading');
                }
            }
        }
    }

    FormSubmitHandler(e: React.FormEvent) {
        if (this.props.action) {
            e.preventDefault();

            if (this._Form) {
                this._Form.classList.add('loading');
            }

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
                }

                if (this._Form) {
                    this._Form.classList.remove('loading');
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

    SetButtonGroupModal() {
        if (this.props.ModalState && this.props.ModalState.isOpened) {
            const modalFooter = document.getElementById('modal-footer');

            if (modalFooter) {
                ReactDOM.render(<ButtonGroup datasource={this.props.datasource} />, modalFooter);
            }
        }
    }

    componentDidMount() {
        this.GetFormData();
    }

    componentDidUpdate() {
        this._PrevPath = this._CurrentPath;
        this._CurrentPath = window.location.pathname;
        if (this._PrevPath !== this._CurrentPath) {
            this.GetFormData();
        }
    }

    render() {
        return (
            <form
                ref={(ref) => (this._Form = ref)}
                id={`${this.props.id ? `${this.props.id}` : ''}`.trim()}
                className={`form ${this.props.className ? `${this.props.className}` : ''}`.trim()}
                encType={this.props.encType}
                action={this.props.action}
                onSubmit={(e: React.FormEvent) => this.FormSubmitHandler(e)}
            >
                {this.props.children}
                {/* {(this.props.buttonGroup === undefined || this.props.buttonGroup) && <ButtonGroup datasource={this.props.datasource} action={this.props.action} workFlow={this.props.workFlow} />} */}
            </form>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    ModalState: state.ModalState,
    // MenuAuthState: state.MenuAuthState,
});

export default connect(MapStateToProps)(Form);
