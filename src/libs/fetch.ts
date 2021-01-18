import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const post = (data: any, link: string, config: AxiosRequestConfig, onSucess: (res: AxiosResponse) => void, onError: (err: AxiosError) => void) => {
    let apiPath = '';
    if (process.env.REACT_APP_API_PATH) {
        apiPath = `${process.env.REACT_APP_API_PATH}/${link}`.replace(/([^:]\/)\/+/g, '$1');
    }

    axios
        .post(apiPath, data, config)
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

export const get = (link: string, config: AxiosRequestConfig, onSucess?: (res: AxiosResponse) => void, onError?: (err: AxiosError) => void) => {
    let apiPath = '';
    if (process.env.REACT_APP_API_PATH) {
        apiPath = `${process.env.REACT_APP_API_PATH}/${link}`.replace(/([^:]\/)\/+/g, '$1');
    }

    axios
        .get(apiPath, config)
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
