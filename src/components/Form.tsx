import React from 'react';
import moment from 'moment';
import { AxiosError, AxiosResponse } from 'axios';
import { connect, ConnectedProps } from 'react-redux';
import { AppState } from 'redux/store';
import { useSelector } from 'react-redux';
import { post } from 'libs/fetch';
import { KTPFormat, NPWPFormat } from 'libs/form';

import { GetAccessMode, GetCurrentPath } from 'libs/access';

const FormInput = () => {
    const PageState = useSelector((state: AppState) => state.PageState);
    const ModalState = useSelector((state: AppState) => state.ModalState);
    const TabState = useSelector((state: AppState) => state.TabState);
    const accessmode = GetAccessMode(PageState, ModalState, TabState);
    const path = GetCurrentPath(PageState, ModalState, TabState);

    return (
        <React.Fragment>
            <input type="hidden" name="x_accessmode" defaultValue={accessmode ? accessmode : 0} />
            <input type="hidden" name="x_path" defaultValue={path ? path : ''} />
            <input type="hidden" name="x_timestamp" defaultValue={moment().format('DD/MM/YYYY HH:mm:ss').toString()} />
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

    onSubmitSuccessCallBack?: (res: AxiosResponse) => void;
    onSubmitErrorCallBack?: (err: AxiosError) => void;
    params?: { [key: string]: string | number | Date | string[] | number[] } | { [key: string]: string | number | Date | string[] | number[] }[];
    children?: React.ReactNode;
};

type FormState = {
    formID: string;
    isLoaded: boolean;
    formData: { [key: string]: any } | null;
    isSubmiting: boolean;
};

type MapStateToPropsType = {
    UserState: AppState['UserState'];
    PageState: AppState['PageState'];
    ModalState: AppState['ModalState'];
    TabState: AppState['TabState'];
};

type Props = PropsFormRedux & FormProps & MapStateToPropsType;

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
    };

    GetFormData() {
        if (this.props.datasource) {
            if (this._Form) {
                this._Form.classList.add('loading');
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
                        if (this.props.onSubmitSuccessCallBack) {
                            this.props.onSubmitSuccessCallBack(res);
                        }

                        const formData = res.data;
                        delete formData.status;

                        // console.log(JSON.stringify(this.state.formData) !== JSON.stringify(formData));

                        if (JSON.stringify(this.state.formData) !== JSON.stringify(formData)) {
                            this.setState({ isLoaded: true, formData: formData }, () => {
                                this.SetFormData();
                            });
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
                this._Form.action = this.props.action;
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
                    // console.log(res);

                    if (this._Form && !res.data.status) {
                        alert(res.data.message);
                        this._Form.classList.remove('loading');
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
        if (this.state.formID === '') {
            let formID = this._Form?.closest('#tab-pane')?.getAttribute('tab-container-name');
            formID = formID ? `form-${formID}` : '';
            formID = this.props.ModalState && this.props.ModalState.isOpened ? `${formID}-modal` : formID;
            this.setState({ formID });
        }
    }

    componentDidMount() {
        this._Mounted = true;
        this.GetFormData();
        this.SetFormID();
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
        // console.log(this._Form?.parentElement?.parentElement?.parentElement);

        const GroupElement: { [key: string]: JSX.Element[] } = {};
        const CurrentGroupNum: { [key: string]: number } = {};
        const GroupTotal: { [key: string]: number } = this.GetGroupTotal();
        return (
            <form
                ref={(ref) => (this._Form = ref)}
                id={`${this.state.formID} ${this.props.id ? `${this.props.id}` : ''}`.trim()}
                className={`form ${this.state.formID} ${this.props.className ? `${this.props.className}` : ''}`.trim()}
                encType={this.props.encType}
                // action={this.props.action}
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

                            GroupElement[child.props.groups].push(<React.Fragment key={`form-${index}`}>{React.cloneElement(child, { accessmode, isLoggedIn })}</React.Fragment>);
                            CurrentGroupNum[child.props.groups]++;

                            if (CurrentGroupNum[child.props.groups] === GroupTotal[child.props.groups]) {
                                return <div className="row">{GroupElement[child.props.groups]}</div>;
                            } else {
                                return <React.Fragment />;
                            }
                        } else {
                            return React.cloneElement(<React.Fragment>{child}</React.Fragment>, { accessmode, isLoggedIn });
                        }
                    } else {
                        return <React.Fragment />;
                    }
                })}
                {this._Mounted && <FormInput />}
            </form>
        );
    }
}

const MapStateToProps = (state: MapStateToPropsType) => ({
    UserState: state.UserState,
    PageState: state.PageState,
    ModalState: state.ModalState,
    TabState: state.TabState,
});

const connector = connect(MapStateToProps);
type PropsFormRedux = ConnectedProps<typeof connector>;

export default connector(Form);
