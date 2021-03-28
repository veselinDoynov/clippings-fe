import axios from 'axios';
import apiList from './api.service.list';

const ApiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const AuthPrefix = 'Bearer ';

const api = axios.create({
    baseURL: ApiBaseUrl,
    headers: {
        Accept: 'application/json',
        Pragma: 'no-cache',
        'Content-Type': 'application/json',
    },
    transformRequest: data => JSON.stringify(data),
    timeout: 10 * 60 * 1000,
    responseType: 'json',
});

api.list = (...args) => apiList(api, ...args);

api.upload = (url, formData) => api.post(url, formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    transformRequest: data => data
});

api.interceptors.request.use(
    async (config) => {
        const token = window.sessionStorage.getItem('token');
        const headers = {
            Authorization: `${AuthPrefix}${token}`,
        };
        return {
            ...config,
            headers: {
                ...config.headers,
                ...(token && headers)
            },
        };
    }, Promise.reject
);

api.interceptors.response.use(
    (response) => {
        const contentType = response.headers['content-type'];
        if (contentType !== 'application/json') {
            const disposition = response.headers['content-disposition'] || '';
            const name = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);

            return {
                file: response.data,
                filename: name && name.length > 1 ? name[1] : 'download.txt'
            };
        }

        const $code = response.status;
        const { method: $method, url: $path } = response.config;

        if (response.data) {
            const { data } = response;
            const res = {
                ...data,
                $code: data.code || $code,
                $method,
                $path
            };
            return res;
        }

        return (response);
    },
    async (error) => {
        const response = error.response || {};
        const responseError = response.data;
        const $code = response.status;
        const originalRequest = error.config;
        const { method: $method, url: $path } = originalRequest;

        let err = { $code, $method, $path };
        
        if (!$code) {
            err = { $path: '/', $code: 418 };
        }

        if (error.message) {
            err.message = error.message;
            err.description = error.description || '';
        }
        if (responseError) {
            if (responseError.messages) {
                err.message = Object.values(responseError.messages).join(' ');
            } else if (responseError.message) {
                err.message = responseError.message;
            } else {
                err.message = responseError.error;
            }
        }

        if (!err.message) {
            err.message = 'Unknown error';
            err.description = 'Unknown error';
        }

        return Promise.reject(err);
    }
);

export default api;
