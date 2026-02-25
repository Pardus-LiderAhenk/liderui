import { createStore } from "vuex";
import computerManagement from './modules/computerManagement';
import globalModule from './modules/globalModule';
import remoteManagement from "./modules/remoteManagement";
import liderws from './modules/liderws'; 
import createPersistedState from 'vuex-persistedstate';
import SecureLS from 'secure-ls';


const ls = new SecureLS({
    isCompression: false,
    encodingType: 'aes',
    encryptionKey: process.env.VUE_APP_STORE_KEY
});

const vuexLocal = createPersistedState({
    storage: {
        getItem: (key) => {
            try {
                return ls.get(key);
            } catch (error) {
                console.warn('Error reading from secure storage, falling back to localStorage:', error);
                try {
                    console.error('corrupted key is ===========================', key);
                    ls.remove(key);

                } catch (e) {
                     console.error('storege error is ===', e);
                }
                return null;
            }
        },
        setItem: (key, value) => {
            try {
                ls.set(key, value);
            } catch (error) {
                console.warn('Error writing to secure storage, falling back to localStorage:', error);
                localStorage.setItem(key, value);
            }
        },
        removeItem: (key) => {
            try {
                ls.remove(key);
            } catch (error) {
                console.warn('Error removing from secure storage, falling back to localStorage:', error);
            }
            localStorage.removeItem(key);
        },
    },
});

export default createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: { computerManagement, globalModule, remoteManagement,liderws },
    plugins: [vuexLocal]
});

