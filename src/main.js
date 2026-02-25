import { createApp, reactive } from 'vue';
import router from './router';
import App from './App.vue';
import store from './store/store.js';
import axios from 'axios';
import ElementPlus from 'element-plus';
import i18n from './plugins/i18n';
import XmppClientManager  from './services/strophe';
import "element-plus/lib/theme-chalk/index.css";
import PrimeVue from './plugins/primevue';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import BasePlugin from '@/views/ComputerManagement/Plugins/BasePlugin/BasePlugin.vue';
import BaseScheduled from '@/views/ComputerManagement/Plugins/Scheduled/BaseScheduled.vue';
import TreeComponent from '@/components/Tree/TreeComponent.vue';

router.beforeEach(function(to, from, next) {
    window.scrollTo(0, 0);
    next();
});

const app = createApp(App);
app.config.globalProperties.$appState = reactive({ inputStyle: 'outlined' });
app.component("base-plugin", BasePlugin);
app.component("base-scheduled", BaseScheduled);
app.component("tree-component", TreeComponent);
app.use(PrimeVue);
app.use(router);
app.use(store);
app.use(ElementPlus);
app.use(i18n);

axios.defaults.baseURL = process.env.VUE_APP_URL;
let authToken = localStorage.getItem('auth_token');

if (authToken) {
   authToken = localStorage.getItem('auth_token');
}
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(function(config) {
    if (config.url == '/api/auth/signin') {
        config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config;
}, function(error) {
    return Promise.reject(error);
});
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

const retryOriginalRequest = (originalRequest, token) => {
    const config = {
        ...originalRequest,
        headers: {
            ...originalRequest.headers,
            'Authorization': 'Bearer ' + token
        }
    };

    delete config._retry;
    
    return axios(config);
};

axios.interceptors.response.use(
    (response) => {
        if (typeof response.data === 'string' || response.data instanceof String) {
            if (response.data.startsWith("<!DOCTYPE html>" || response.data == "logout")) {
                const currentUser = store.getters.getUser;
                store.dispatch("logout", { username: currentUser?.uid }).then(() => this.$router.push("/login") ).catch(err => console.log(err))
            }
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/api/auth/refresh-token')) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    return retryOriginalRequest(originalRequest, token);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(
                    `${process.env.VUE_APP_URL}/api/auth/refresh-token?refreshToken=${refreshToken}`
                );

                if (response.data.token) {
                    localStorage.removeItem('auth_token');
                    localStorage.setItem('auth_token', response.data.token);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;

                    processQueue(null, response.data.token);


                    return retryOriginalRequest(originalRequest, response.data.token);
                }
            } catch (refreshError) {

                processQueue(refreshError, null);
                const currentUser = store.getters.getUser;
                store.dispatch("logout", { username: currentUser?.uid }).then(() => this.$router.push("/login")).catch(err => console.log(err));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response.status === 404 && error.response.data.path == "/index.html") {
            const currentUser = store.getters.getUser;
            store.dispatch("logout", { username: currentUser?.uid }).then(() => this.$router.push("/login")).catch(err => console.log(err))
        }
        if (error.response.status === 400) {
            const currentUser = store.getters.getUser;
            store.dispatch("logout", { username: currentUser?.uid }).then(() => this.$router.push("/login")).catch(err => console.log(err))
        }
        return Promise.reject(error);
    }
);

app.mount('#app');