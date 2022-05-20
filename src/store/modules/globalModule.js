import axios from 'axios';
import strophe from '@/services/strophe.js';

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
    logout({ commit }) {
        return new Promise((resolve, reject) => {
            commit('logout')
            localStorage.removeItem('auth_token')
            delete axios.defaults.headers.common['Authorization']
            strophe.getInstance().disconnect();
            resolve()
        })
    },
    login({ commit }, user) {
        return new Promise((resolve, reject) => {
            axios.post(process.env.VUE_APP_URL + "/api/auth/signin", user).then(
                (response) => {
                    localStorage.setItem("auth_token", response.data.token);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                    axios.post("/liderConsole/profile", {}).then((userresponse) => {
                        commit('auth_success', {token:response.data.token,user:userresponse.data});
                        if(!strophe.isConnected) {
                            strophe.getInstance().connect();
                        }
                        resolve(userresponse);
                    });

                },
                (error) => {
                    reject(error);
                }
                );
        })
    },
    updateUserLang({commit}, lang) {
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
    auth_success(state, {token, user}) {
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
            state.user.attributesMultiValues.preferredLanguage[0] = lang;
        }
    },
}

export default { state, getters, actions, mutations }