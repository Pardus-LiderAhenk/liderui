import axios from 'axios';
import strophe from '@/services/strophe.js';
import router from '../../router';
import { getLiderWs } from '@/libs/liderws';


const state = {
    selectedLiderNode: null,
    selectedComputerGroupNode: null,
    selectedNodeType: null,
    status: '',
    token: localStorage.getItem('token') || '',
    user: {},
}



const getters = {
    selectedLiderNode: state => state.selectedLiderNode,
    selectedComputerGroupNode: state => state.selectedComputerGroupNode,
    selectedNodeType: state => state.selectedNodeType,
    getUser: state => state.user
}

const actions = {
    setSelectedLiderNode({ commit }, node) {
        commit("setSelectedLiderNode", node);
    },
    setSelectedComputerGroupNode({ commit }, node) {
        commit("setSelectedComputerGroupNode", node);
    },
    setSelectedNodeType({ commit }, node) {
        commit("setSelectedNodeType", node);
    },
    logout({ commit }, user) {
        return new Promise((resolve, reject) => {
            axios.post(process.env.VUE_APP_URL + "/api/auth/logout", user).then(
                (response) => {
                    if (response) {
                        commit('logout')
                        localStorage.removeItem('vuex')
                        localStorage.removeItem('auth_token')
                        localStorage.removeItem('_secure__ls__metadata')
                        delete axios.defaults.headers.common['Authorization']
                        // strophe.getInstance().disconnect();
                        getLiderWs().disconnect();
                        router.push('/login')
                        resolve()
                    }
                    else {
                        reject("Error");
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        })
    },
    login({ commit }, user) {
        return new Promise((resolve, reject) => {
            axios.post(process.env.VUE_APP_URL + "/api/auth/signin", user).then(
                (response) => {
                    if (response) {
                        let token = response.data.token;
                        localStorage.setItem("auth_token", token);
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                        axios.post("/api/lider-console/profile", {}).then((userresponse) => {
                            commit('auth_success', { token: token, user: userresponse.data });
                            resolve(userresponse);
                        });
                        getLiderWs().connect();
                    } else {
                        reject("Error");
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        })
    },
    updateUserLang({ commit }, lang) {
        commit('update_user_lang', lang);
    }
}

const mutations = {
    setSelectedLiderNode: (state, node) => (state.selectedLiderNode = node),
    setSelectedComputerGroupNode: (state, node) => (state.selectedComputerGroupNode = node),
    setSelectedNodeType: (state, node) => (state.selectedNodeType = node),
    auth_request(state) {
        state.status = 'loading'
    },
    auth_success(state, { token, user }) {
        state.status = 'success';
        state.token = token;
        state.user = user;
    },
    auth_error(state) {
        state.status = 'error'
    },
    logout(state) {
        state.status = ''
        state.token = ''
        state.user = {}
        state.selectedLiderNode = null
        state.selectedComputerGroupNode = null
        state.selectedNodeType = null
    },
    update_user_lang(state, lang) {
        if (state.user) {
            if (!state.user.attributesMultiValues) {
                state.user.attributesMultiValues = {};
            }
            if (!state.user.attributesMultiValues.preferredLanguage) {
                state.user.attributesMultiValues.preferredLanguage = [lang];
            } else {
                state.user.attributesMultiValues.preferredLanguage[0] = lang;
            }
        }
    },
}

export default { state, getters, actions, mutations }