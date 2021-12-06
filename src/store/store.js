import { createStore } from "vuex";
import computerManagement from './modules/computerManagement';
import globalModule from './modules/globalModule';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {computerManagement,globalModule,},
  plugins:[vuexLocal.plugin]
});