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


axios.interceptors.response.use(
    (response) => {
        if (typeof response.data === 'string' || response.data instanceof String) {
            if (response.data.startsWith("<!DOCTYPE html>" || response.data == "logout")) {
                store.dispatch("logout").then(() => this.$router.push("/login") ).catch(err => console.log(err))
            }
        }
        if(response.status === 401) {
            store.dispatch("logout").then(() => this.$router.push("/login") ).catch(err => console.log(err))
        }
        return response;
    },
    (error) => {
        if (error.response.status === 404 && error.response.data.path == "/index.html") {
            store.dispatch("logout").then(() => this.$router.push("/login")).catch(err => console.log(err))
            
        }
        if (error.response.status === 400) {
            store.dispatch("logout").then(() => this.$router.push("/login")).catch(err => console.log(err))
        }
        return Promise.reject(error);
    }
 );


app.mount('#app');