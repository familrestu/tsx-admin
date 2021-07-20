import React from 'react';
import moment from 'moment';
import { AxiosError, AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { useSelector } from 'react-redux';
import { get, post } from 'libs/fetch';
import { KTPFormat, NPWPFormat } from 'libs/form';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { GetAccessMode, GetCurrentPath } from 'libs/access';
import { Alert, Confirm } from 'components/DialogBox';

const FormInput = () => {
    const PageState = useSelector((state: AppState) => state.PageState);
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const TabState = useSelector((state: AppState) => state.TabState);
    const accessmode = GetAccessMode(PageState, ModalState, TabState);
    const path = GetCurrentPath(PageState, ModalState, TabState);

    return (
        <React.Fragment>
            <input type="hidden" name="x_accessmode" defaultValue={accessmode ? accessmode : 0} x-form="gen" />
            <input type="hidden" name="x_path" defaultValue={path ? path : ''} x-form="gen" />
            <input type="hidden" name="x_timestamp" defaultValue={moment().format('DD/MM/YYYY HH:mm:ss').toString()} x-form="gen" />
        </React.Fragment>
    );
};

type FormProps = {
    id?: string;
    className?: string;
    datasource?: string;
    action?: string;
    encType?: string;
    workFlow?: boolean;
    submitCallBack?: (res?: AxiosResponse) => void;
    errorCallBack?: (err?: AxiosError | AxiosResponse) => void;
    children?: React.ReactNode;
};

export type FormState = {
    formID: string;
    isLoaded: boolean;
    formData: { [key: string]: any } | null;
    isSubmiting: boolean;
    showAlert: boolean;
    showConfirm: boolean;
    dialogBoxMessage: string;
    dialogBoxAction: string | undefined;
};

type MapStateToPropsType = {
    UserState: AppState['UserState'];
    PageState: AppState['PageState'];
    ModalState: AppState['ModalState'];
    TabState: AppState['TabState'];
    TriggerState: AppState['TriggerState'];
};

type Props = FormProps & MapStateToPropsType & typeof MapDispatch & RouteComponentProps;

class Form extends React.Component<Props, FormState> {
    _Form: HTMLFormElement | null | undefined;
    _CurrentPath: string = window.location.pathname;
    _PrevPath: string | undefined;
    _Mounted: boolean | undefined;

    state = {
        formID: '',
        isLoaded: false,
        formData: null,
        isSubmiting: false,
        showAlert: false,
        showConfirm: false,
        dialogBoxMessage: '',
        dialogBoxAction: '',
    };

    GetFormData() {
        if (this.props.datasource) {
            if (this._Form) {
                this._Form.classList.add('loading');
                // console.log(this._Form);
            }

            /* if datasource is an object, set is as local datasource state */
            if (typeof this.props.datasource === 'object') {
                this.setState({ isLoaded: true, formData: this.props.datasource }, () => {
                    this.SetFormData();
                });
                /* if datasource is a string, fetch it  */
            } else if (typeof this.props.datasource === 'string') {
                const onSuccessPost = (res: AxiosResponse) => {
                    if (res) {
                        if (this.props.submitCallBack) {
                            this.props.submitCallBack(res);
                        }

                        const formData = res.data;
                        delete formData.status;

                        if (JSON.stringify(this.state.formData) !== JSON.stringify(formData)) {
                            this.setState({ isLoaded: true, formData: formData }, () => {
                                this.SetFormData();
                            });
                        }
                    }
                };

                const onErrorPost = (err: AxiosError | AxiosResponse) => {
                    if (this.props.errorCallBack) {
                        this.props.errorCallBack(err);
                    }

                    if (this._Form) {
                        this._Form.classList.remove('loading');
                        console.error(err);
                    }
                };

                post(
                    this.props.ModalState.isOpened ? this.props.ModalState.modalParams : this.props.match.params,
                    this.props.datasource,
                    null,
                    (res) => onSuccessPost(res),
                    (err) => onErrorPost(err),
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
                    if (element.getAttribute('x-form') === null) {
                        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                            if (elementType === 'text' || elementType === 'email' || elementType === 'date' || elementType === 'hidden') {
                                if (elementName !== null && formData !== null) {
                                    const inputType = element.getAttribute('input-type');
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

                                        if (elementType === 'hidden') {
                                            formValue = formData[`${elementName}`.replaceAll('_hidden', '')];
                                        }

                                        element.defaultValue = formValue === undefined ? '' : formValue;

                                        /* setelah di set value nya, baru getdata */
                                        if (inputType && inputType === 'search') {
                                            const inputDatasource = element.getAttribute('datasource');
                                            if (inputDatasource) {
                                                element.classList.add('loading');
                                                formValue = formData[`${elementName}`.replaceAll('_label', '')];
                                                let isSearchSet = false;
                                                get(inputDatasource, null, (res) => {
                                                    const { data } = res;
                                                    for (let l = 0; l < data.searchData.length; l++) {
                                                        const searchData = data.searchData[l];

                                                        if (`${searchData.value}` === `${formValue}`) {
                                                            element.value = searchData.label;
                                                            element.classList.remove('loading');
                                                            isSearchSet = true;
                                                            break;
                                                        }
                                                    }
                                                });

                                                /* jika sampai sini, maka tidak berhasil set value nya */
                                                if (!isSearchSet) {
                                                    element.classList.remove('loading');
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if (elementType === 'checkbox' || elementType === 'radio') {
                                const elementValue = element.value;
                                if (elementValue && elementName !== null && formData !== null) {
                                    if (formData[elementName]) {
                                        element.checked = elementValue.toString() === `${formData[elementName]}`.toString();
                                    }
                                }
                            }
                        } else if (tagName === 'SELECT') {
                            if (elementName !== null && formData !== null) {
                                for (let i = 0; i < element.children.length; i++) {
                                    const options = element.children[i] as HTMLOptionElement;
                                    const arrFormData = `${formData[elementName]}`.split(',');
                                    for (let j = 0; j < arrFormData.length; j++) {
                                        const formdatavalue = arrFormData[j];
                                        if (options.value === formdatavalue) {
                                            options.selected = true;
                                        }
                                    }
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
        if (this.props.action && this._Form) {
            e.preventDefault();
            this._Form.classList.add('loading');
            this._Form.action = this.props.action;

            const form = e.currentTarget as HTMLFormElement;
            const arrInputs = form.querySelectorAll('input, select, textarea');
            const tempFormData: { [key: string]: string | number | Date | null } = {};

            /* validate required */
            for (let i = 0; i < arrInputs.length; i++) {
                const element = arrInputs[i] as HTMLInputElement;
                const tagName = element.tagName;
                const elementType = element.getAttribute('type');
                const formRequired = element.getAttribute('form-required');
                const formLabel = element.getAttribute('form-label');

                if (formRequired === 'true') {
                    if (tagName.toUpperCase() === 'SELECT') {
                        for (let i = 0; i < element.children.length; i++) {
                            const options = element.children[i] as HTMLOptionElement;

                            if (options.selected && options.value === 'none') {
                                this.ToggleAlert(true, `Field ${formLabel} is required!`);
                                element.focus();
                                this._Form.classList.remove('loading');
                                return false;
                            }
                        }
                    } else {
                        if (elementType === 'radio' || elementType === 'checkbox') {
                            console.log(element);
                        } else {
                            if (element.value === '') {
                                this.ToggleAlert(true, `Field ${formLabel} is required!`);
                                element.focus();
                                this._Form.classList.remove('loading');
                                return false;
                            }
                        }
                    }
                }
            }

            /* push to tempformData */
            for (let i = 0; i < arrInputs.length; i++) {
                const element = arrInputs[i] as HTMLInputElement;
                const elementType = element.getAttribute('type');
                let value: string | number | Date = element.value;

                if (!isNaN(parseInt(value))) {
                    value = parseInt(value);
                }

                if (elementType !== null && (elementType === 'checkbox' || elementType === 'radio')) {
                    tempFormData[element.name] = '';
                    if (element.checked) {
                        tempFormData[element.name] = value;
                    }
                } else {
                    tempFormData[element.name] = value;
                }
            }

            const onSuccessPost = (res: AxiosResponse) => {
                if (res) {
                    if (this.props.submitCallBack) {
                        this.props.submitCallBack(res);
                    }

                    if (this._Form && !res.data.status) {
                        this._Form.classList.remove('loading');
                    }

                    if (this._Form) {
                        if (res.data && res.data.status) {
                            /* show alert based on return from server */
                            if (res.data.alert !== undefined && res.data.alert) {
                                this.ToggleAlert(true, res.data.message);
                            }
                        }
                    }
                }
            };

            const onErrorPost = (err: AxiosError | AxiosResponse) => {
                if (this.props.errorCallBack) {
                    this.props.errorCallBack(err);
                }

                const error: any = err;

                if (this._Form) {
                    if (error.data && !error.data.status) {
                        this.ToggleAlert(true, error.data.message);
                    }
                    this._Form.classList.remove('loading');
                }
            };

            post(
                tempFormData,
                this.props.action,
                null,
                (res) => onSuccessPost(res),
                (err) => onErrorPost(err),
            );
        }
    }

    GetGroupTotal(): { [key: string]: number } {
        const obj: { [key: string]: number } = {};

        React.Children.map(this.props.children, (child) => {
            if (React.isValidElement(child)) {
                if (child.props.groups !== undefined) {
                    if (obj[child.props.groups] === undefined) {
                        obj[child.props.groups] = 0;
                    }

                    obj[child.props.groups]++;
                }
            }
        });

        return obj;
    }

    SetFormID() {
        if (this.state.formID === '' && this._Form) {
            let formID = this._Form.closest('#tab-pane')?.getAttribute('tab-container-name');
            if (formID) {
                formID = formID ? `form-${formID}` : '';
                formID = this.props.ModalState && this.props.ModalState.isOpened ? `${formID}-modal` : formID;
                this.setState({ formID });
            }
        }
    }

    ToggleAlert(show: boolean, message: string) {
        this.setState(
            (prevState) => {
                return { ...prevState, showAlert: show, dialogBoxMessage: message };
            },
            () => this.CloseModal(show),
        );
    }

    ToggleConfirm(show: boolean, message: string, action?: string) {
        this.setState((prevState) => {
            return { ...prevState, showConfirm: show, dialogBoxMessage: message, dialogBoxAction: action };
        });
    }

    CloseModal(show: boolean) {
        if (this.props.ModalState.isOpened) {
            /* re-fetch table, if table is exists and it's modal */
            if (document.getElementById('table') && !show) {
                this.props.SETTRIGGER('FetchTable');
                this.props.CLOSEMODAL();
            }
        }
    }

    componentDidMount() {
        this._Mounted = true;
        this.SetFormID();
        this.GetFormData();
    }

    componentDidUpdate() {
        this._PrevPath = this._CurrentPath;
        this._CurrentPath = window.location.pathname;
        if (this._PrevPath !== this._CurrentPath) {
            this.GetFormData();
        }
    }

    componentWillUnmount() {
        this._Mounted = false;
    }

    render() {
        const GroupElement: { [key: string]: JSX.Element[] } = {};
        const CurrentGroupNum: { [key: string]: number } = {};
        const GroupTotal: { [key: string]: number } = this.GetGroupTotal();

        return (
            <form
                ref={(ref) => (this._Form = ref)}
                id={`${this.state.formID} ${this.props.id ? `${this.props.id}` : ''}`.trim()}
                className={`form ${this.state.formID} ${this.props.className ? `${this.props.className}` : ''}`.trim()}
                encType={this.props.encType}
                onSubmit={(e: React.FormEvent) => this.FormSubmitHandler(e)}
            >
                {React.Children.map(this.props.children, (child, index) => {
                    if (React.isValidElement(child)) {
                        const { PageState, ModalState, TabState, UserState } = this.props;
                        const accessmode = PageState && ModalState && TabState ? GetAccessMode(PageState, ModalState, TabState) : 0;
                        const isLoggedIn = UserState.isLoggedIn;

                        if (child.props.groups !== undefined) {
                            if (GroupElement[child.props.groups] === undefined) {
                                GroupElement[child.props.groups] = [];
                            }

                            if (CurrentGroupNum[child.props.groups] === undefined) {
                                CurrentGroupNum[child.props.groups] = 0;
                            }

                            GroupElement[child.props.groups].push(
                                <React.Fragment key={`form-${index}`}>
                                    {React.cloneElement(child, {
                                        accessmode,
                                        isLoggedIn,
                                    })}
                                </React.Fragment>,
                            );
                            CurrentGroupNum[child.props.groups]++;

                            if (CurrentGroupNum[child.props.groups] === GroupTotal[child.props.groups]) {
                                return <div className="row">{GroupElement[child.props.groups]}</div>;
                            } else {
                                return <React.Fragment />;
                            }
                        } else {
                            return React.cloneElement(child, {
                                accessmode,
                                isLoggedIn,
                                formData: this.state.formData,
                                ToggleConfirm: (show: boolean, message: string, action?: string) => this.ToggleConfirm(show, message, action),
                            });
                        }
                    } else {
                        return <React.Fragment />;
                    }
                })}

                {this._Mounted && <FormInput />}

                {this.state.showAlert && (
                    <Alert
                        message={this.state.dialogBoxMessage}
                        closeDialogBox={() => {
                            this.ToggleAlert(false, '');
                        }}
                    />
                )}

                {this.state.showConfirm && (
                    <Confirm
                        message={this.state.dialogBoxMessage}
                        action={this.state.dialogBoxAction}
                        closeDialogBox={() => {
                            this.setState((prevState) => {
                                return { ...prevState, showConfirm: false, dialogBoxMessage: '', dialogBoxAction: '' };
                            });
                        }}
                    />
                )}
            </form>
        );
    }
}

const MapStateToProps = (state: MapStateToPropsType) => ({
    UserState: state.UserState,
    PageState: state.PageState,
    ModalState: state.ModalState,
    TabState: state.TabState,
    TriggerState: state.TriggerState,
});

const MapDispatch = {
    SETTRIGGER: (eventName: string) => ({ type: 'SETTRIGGER', eventName }),
    CLOSEMODAL: () => ({ type: 'CLOSEMODAL' }),
};

const connector = connect(MapStateToProps, MapDispatch);
const FormWithRouter = withRouter(connector(Form));

export default FormWithRouter;
