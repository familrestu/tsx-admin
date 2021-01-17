import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const post = (data: any, link: string, config: AxiosRequestConfig, onSucess: (res: AxiosResponse) => void, onError: (err: AxiosError) => void) => {
    if (process.env.REACT_APP_API_PATH) {
        axios
            .post(`${process.env.REACT_APP_API_PATH.replaceAll('/', '')}/${link}`, data, config)
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
    }
};

export const get = (link: string, config: AxiosRequestConfig, onSucess: (res: AxiosResponse) => void, onError: (err: AxiosError) => void) => {
    if (process.env.REACT_APP_API_PATH) {
        axios
            .get(`${process.env.REACT_APP_API_PATH.replaceAll('/', '')}/${link}`, config)
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
    }
};
