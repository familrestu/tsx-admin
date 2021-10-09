import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const post = (data: any, link: string | undefined, config: AxiosRequestConfig | null, onSucess?: (res: AxiosResponse) => void, onError?: (err: AxiosError | AxiosResponse) => void) => {
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
        .then((res: any) => {
            if (onSucess) {
                if (res.data.status) {
                    onSucess(res);
                } else {
                    if (onError) onError(res);
                }
            }
        })
        .catch((err: any) => {
            if (onError) {
                onError(err);
            }

            if (process.env.NODE_ENV === 'development') {
                console.error(err.message);
            }

            if (link !== '/system/application.logError' && err.message.toUpperCase() !== 'NETWORK ERROR') {
                logToServer(err, apiPath, config);
            }
        });
};

export const get = (link: string | undefined, config: AxiosRequestConfig | null, onSucess?: (res: AxiosResponse) => void, onError?: (err: AxiosError | AxiosResponse) => void) => {
    let apiPath = '';
    if (process.env.REACT_APP_API_PATH) {
        apiPath = `${process.env.REACT_APP_API_PATH}/${link}`.replace(/([^:]\/)\/+/g, '$1');
    }

    if (window.location.host.indexOf('localhost:3000') < 0) {
        apiPath = apiPath.replaceAll('localhost:5000', window.location.host.replaceAll(':3000', ':5000'));
    }

    let axiosConfig: AxiosRequestConfig = {
        withCredentials: true,
    };

    if (config !== null) {
        axiosConfig = {
            ...axiosConfig,
            ...config /* always put client config after, so previous config will be overriden */,
        };
    }

    axios
        .get(apiPath, axiosConfig)
        .then((res: any) => {
            if (onSucess) {
                if (res.data.status) {
                    onSucess(res);
                } else {
                    if (onError) onError(res);
                }
            }
        })
        .catch((err: any) => {
            if (onError) {
                onError(err);
            }

            if (process.env.NODE_ENV === 'development') {
                console.error(err.message);
            }

            if (link !== '/system/application.logError' && err.message.toUpperCase() !== 'NETWORK ERROR') {
                logToServer(err, apiPath, config);
            }
        });
};

const logToServer = (err: AxiosError, link: string, config: AxiosRequestConfig | null) => {
    post(
        {
            err,
            link,
            config,
        },
        '/system/application.logError',
        { withCredentials: true },
    );
};
