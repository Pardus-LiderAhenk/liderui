import { createStore } from "vuex";
import computerManagement from './modules/computerManagement';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {computerManagement,},
  plugins:[vuexLocal.plugin]
});