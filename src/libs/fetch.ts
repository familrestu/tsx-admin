import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const post = (data: any, link: string, config: AxiosRequestConfig, onSucess: (res: AxiosResponse) => void, onError: (err: AxiosError) => void) => {
    axios
        .post(`${process.env.REACT_APP_API_PATH}/${link}`, data, config)
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

export const get = (link: string, config: AxiosRequestConfig, onSucess: (res: AxiosResponse) => void, onError: (err: AxiosError) => void) => {
    axios
        .get(`${process.env.REACT_APP_API_PATH}/${link}`, config)
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
