import { createStore } from "vuex";
import computerManagement from './modules/computerManagement';
import globalModule from './modules/globalModule';
import VuexPersistence from 'vuex-persist';
import remoteManagement from "./modules/remoteManagement";
import createPersistedState from 'vuex-persistedstate';
import SecureLS from 'secure-ls';

const ls = new SecureLS({isCompression: false});
const vuexLocal = createPersistedState({
  
  storage: {
    getItem: (key) => ls.get(key),
    setItem: (key, value) => ls.set(key, value),
    removeItem: (key) => ls.remove(key),
  },
});

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {computerManagement,globalModule,remoteManagement},
  plugins:[vuexLocal]
});