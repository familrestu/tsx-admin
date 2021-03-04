import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const post = (data: any, link: string, config: AxiosRequestConfig | null, onSucess: (res: AxiosResponse) => void, onError: (err: AxiosError) => void) => {
    let apiPath = '';
    if (process.env.REACT_APP_API_PATH) {
        apiPath = `${process.env.REACT_APP_API_PATH}/${link}`.replace(/([^:]\/)\/+/g, '$1');
    }

    if (window.location.host.indexOf('localhost:3000') < 0) {
        apiPath = apiPath.replaceAll('localhost:5000', window.location.host.replaceAll(':3000', ':5000'));
    }

    let axiosConfig: AxiosRequestConfig = { withCredentials: true };
    if (config !== null) {
        axiosConfig = {
            ...axiosConfig,
            ...config /* always put client config after, so previous config will be overriden */,
        };
    }

    axios
        .post(apiPath, data, axiosConfig)
        .then((res: AxiosResponse) => {
            if (onSucess) {
                onSucess(res);
            }
        })
        .catch((err: AxiosError) => {
            if (onError) {
                onError(err);
            }
        });
};

export const get = (link: string, config: AxiosRequestConfig | null, onSucess?: (res: AxiosResponse) => void, onError?: (err: AxiosError) => void) => {
    let apiPath = '';
    if (process.env.REACT_APP_API_PATH) {
        apiPath = `${process.env.REACT_APP_API_PATH}/${link}`.replace(/([^:]\/)\/+/g, '$1');
    }

    if (window.location.host.indexOf('localhost:3000') < 0) {
        apiPath = apiPath.replaceAll('localhost:5000', window.location.host.replaceAll(':3000', ':5000'));
    }

    let axiosConfig: AxiosRequestConfig = { withCredentials: true };
    if (config !== null) {
        axiosConfig = {
            ...axiosConfig,
            ...config /* always put client config after, so previous config will be overriden */,
        };
    }

    axios
        .get(apiPath, axiosConfig)
        .then((res: AxiosResponse) => {
            if (onSucess) {
                onSucess(res);
            }
        })
        .catch((err: AxiosError) => {
            if (onError) {
                onError(err);
            }
        });
};
