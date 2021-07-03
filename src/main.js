import { createApp, reactive } from 'vue';
import router from './router';
import App from './App.vue';
// import CodeHighlight from './AppCodeHighlight';
import store from './store/store.js';
import axios from 'axios';
import ElementPlus from 'element-plus';
import i18n from './plugins/i18n';
import './services/strophe';
import "element-plus/lib/theme-chalk/index.css";
import PrimeVue from './plugins/primevue';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import BasePlugin from '@/views/ComputerManagement/Plugins/BasePlugin/BasePlugin.vue';
import BaseScheduled from '@/views/ComputerManagement/Plugins/Scheduled/BaseScheduled.vue';

router.beforeEach(function(to, from, next) {
    window.scrollTo(0, 0);
    next();
});

const app = createApp(App);

app.config.globalProperties.$appState = reactive({ inputStyle: 'outlined' });
app.component("base-plugin", BasePlugin);
app.component("base-scheduled", BaseScheduled);
app.use(PrimeVue);
app.use(router);
app.use(store);
app.use(ElementPlus);
app.use(i18n);


axios.defaults.baseURL = process.env.VUE_APP_URL;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('auth_token');
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(function(config) {

    if (config.url == '/api/auth/signin') {
        config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    console.log('Config', config);
    return config;
}, function(error) {
    return Promise.reject(error);
});


app.mount('#app');