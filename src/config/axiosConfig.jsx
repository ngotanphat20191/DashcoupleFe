import axios from "axios";

axios.defaults.headers.common['Content-Type'] = 'application/json';

let cachedToken = null;

const getAuthToken = () => {
  if (!cachedToken) {
    cachedToken = localStorage.getItem("token");
  }
  return cachedToken;
};

export const clearTokenCache = () => {
  cachedToken = null;
};

const API_BASE = 'http://localhost:8080/api';
const USER_API = `${API_BASE}/user`;
const ADMIN_API = `http://localhost:8082/api/admin`;
const PAYMENT_API = 'http://localhost:10000/api/payment';
const MATCHES_API = 'http://localhost:8083/api/user';

export const loginSignUpAxios = axios.create({
    baseURL: API_BASE,
});

export const loginAdminSignUpAxios = axios.create({
    baseURL: ADMIN_API,
});

export const baseAxios = axios.create({
    baseURL: USER_API,
});

export const adminAxios = axios.create({
    baseURL: ADMIN_API,
});

export const paymentAxios = axios.create({
    baseURL: PAYMENT_API,
});
export const matchesAxios = axios.create({
    baseURL: MATCHES_API,
});
const addAuthToken = (config) => {
    const token = getAuthToken();
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
};

const handleResponseError = (error) => {
    if (error.response && error.response.status === 401) {
        clearTokenCache();
    }
    return Promise.reject(error);
};

baseAxios.interceptors.request.use(addAuthToken, error => Promise.reject(error));
adminAxios.interceptors.request.use(addAuthToken, error => Promise.reject(error));
paymentAxios.interceptors.request.use(addAuthToken, error => Promise.reject(error));
matchesAxios.interceptors.request.use(addAuthToken, error => Promise.reject(error));

baseAxios.interceptors.response.use(response => response, handleResponseError);
adminAxios.interceptors.response.use(response => response, handleResponseError);
paymentAxios.interceptors.response.use(response => response, handleResponseError);
matchesAxios.interceptors.response.use(response => response, handleResponseError);

export const createCancelToken = () => {
    return axios.CancelToken.source();
};
