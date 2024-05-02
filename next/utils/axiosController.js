import axios from 'axios';
import { RESOURCE_BASE } from 'config/app';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { reAuth } from '../store/auth/actions';


const LOGIN_URLS = [
    '.*\\/admin\\/profile\\/cart\\/.*',
];

class AxiosController {
    setStoreInstance(storeInstance) {
        this.storeInstance = storeInstance;
    }
    setBaseUrl = () => axios.defaults.baseURL = RESOURCE_BASE + '/api';
    getAxiosInstace = () => axios;
    deleteToken = () => {
        destroyCookie(null, 'coffeeToken', {
            maxAge: 0,
            path: '/',
        });
        delete axios.defaults.headers.common['OAuth'];
    };

    saveToken = tokenData => {
        setCookie(null, 'coffeeToken', tokenData.token,{
            maxAge: 3000,
            path: '/',
        });
        if (tokenData.token) {
            axios.defaults.headers.common['OAuth'] = `Bearer ${tokenData.token}`;
        } else {
            delete axios.defaults.headers.common['OAuth'];
        }
    };
    setAuthHeader = (coffeeToken) => {
        if (coffeeToken && !process.browser) {
            axios.defaults.headers.common['OAuth'] = `Bearer ${coffeeToken}`;
        } else if (coffeeToken==='noAuth') {
            delete axios.defaults.headers.common['OAuth'];
        } else {
            const cookies = parseCookies();
            if (cookies.coffeeToken) {
                axios.defaults.headers.common['OAuth'] = `Bearer ${cookies.coffeeToken}`;
            }
        }
    };

    getReAuth(authenticate) {
        if (!this.reAuth) {
            this.reAuth = { authenticate };
            this.reAuth.promise = new Promise((waitReauth, throwReauth) => {
                this.reAuth.waitReauth = waitReauth;
                this.reAuth.throwReauth = throwReauth;
                this.storeInstance.dispatch(reAuth({ authenticate }));
            });
            this.reAuth.promise
                .finally(() => {
                    this.reAuth = null;
                    this.storeInstance.dispatch(reAuth({ }));
                });
        }
        return this.reAuth;
    }

    isLoginApi (url = '') {
        return LOGIN_URLS.map(ignore => !!new RegExp(ignore).exec(url))
            .find(match => match);
    }

    reAuthInterceptor () {
        axios.interceptors.response.use(
            response => {
                return response;
            },
            async error => {
                let authenticate;
                if (error.request) {
                    authenticate = error.request.getResponseHeader('OAuthenticate');
                }
                if (!error.response || error.response.status !== 401 || this.isLoginApi(error.config.url) || !authenticate) {
                    return Promise.reject(error);
                }

                let reAuth = this.getReAuth(authenticate);

                return reAuth.promise
                    .then(() => {
                        delete error.config.headers.OAuth;
                        return axios.request(error.config);
                    })
                    .catch(() => {
                        error.cancelled = true;
                        return Promise.reject(error);
                    });
            });
    }

    constructor() {
        this.setBaseUrl();
        if(process.browser) {
            this.reAuthInterceptor();
        }
    }
}

export const axiosController = new AxiosController();
