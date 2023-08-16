import axios from 'axios';
import strophe from '@/services/strophe.js';
import router from '../../router';
import {encryptData, decryptData} from "./encryption"



const state = {
    selectedLiderNode: null,
    selectedComputerGroupNode: null,
    selectedNodeType: null,
    status: '',
	token: localStorage.getItem('token') || '',
    user: {},
}



const getters = {
    selectedLiderNode: state => decryptData(state.selectedLiderNode),
    selectedComputerGroupNode: state => decryptData(state.selectedComputerGroupNode),
    selectedNodeType: state => decryptData(state.selectedNodeType),
    getUser: state => decryptData(state.user)
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
    logout({ commit },user) {
        //logout yapıp yönlendireceğiz aşağıdaki gibi olacak
        return new Promise((resolve, reject) => {
            axios.post(process.env.VUE_APP_URL + "/api/auth/logout", user).then(
                (response) => {
                    if(response){
                        commit('/api/auth/logout')
                        localStorage.removeItem('auth_token')
                        delete axios.defaults.headers.common['Authorization']
                        strophe.getInstance().disconnect();
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
                        let token = encryptData(response.data.token)
                        localStorage.setItem("auth_token", token);
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                        axios.post("/api/lider-console/profile", {}).then((userresponse) => {
                            commit('auth_success', {token:token,user:userresponse.data});
                            if(!strophe.isConnected) {
                                strophe.getInstance().connect();
                            }
                            resolve(userresponse);
                        });
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
    updateUserLang({commit}, lang) {
        commit('update_user_lang', lang);
    }
}

const mutations = {
    setSelectedLiderNode: (state, node) => (state.selectedLiderNode = encryptData(node)),
    setSelectedComputerGroupNode: (state, node) => (state.selectedComputerGroupNode = encryptData(node)),
    setSelectedNodeType: (state, node) => (state.selectedNodeType = encryptData(node)),
    auth_request(state) {
        state.status = 'loading'
    },
    auth_success(state, {token, user}) {
        state.status = 'success';
        state.token = token;
        state.user = encryptData(user);
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