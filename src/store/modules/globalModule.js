import axios from 'axios';
import router from '../../router';
import {getLiderWs} from '@/libs/liderws';


const state = {
    selectedLiderNode: null,
    selectedComputerGroupNode: null,
    selectedNodeType: null,
    status: '',
	token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refresh_token') || '',
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
    logout({ commit, state }, user = null) {
        return new Promise((resolve, reject) => {

            const username = user?.username || state.user?.username || null;

            let logoutUrl = process.env.VUE_APP_URL + "/api/auth/logout";
            if (username) {
                logoutUrl += `?username=${encodeURIComponent(username)}`;
            }

            axios.post(logoutUrl)
                .then((response) => {
                    commit('logout')
                    localStorage.removeItem('vuex')
                    localStorage.removeItem('auth_token')
                    localStorage.removeItem('refresh_token')
                    localStorage.removeItem('_secure__ls__metadata')
                    delete axios.defaults.headers.common['Authorization']
                    getLiderWs().disconnect();
                    router.push('/login')
                    resolve(response)
                })
                .catch((error) => {
                    // Even if logout request fails, clean up local state
                    commit('logout')
                    localStorage.removeItem('vuex')
                    localStorage.removeItem('auth_token')
                    localStorage.removeItem('refresh_token')
                    localStorage.removeItem('_secure__ls__metadata')
                    delete axios.defaults.headers.common['Authorization']
                    getLiderWs().disconnect();
                    router.push('/login')
                    reject(error);
                });
        })
    },


    login({ commit }, user) {
        return new Promise((resolve, reject) => {
            axios
                .post(process.env.VUE_APP_URL + '/api/auth/signin', user)
                .then((response) => {
                    if (response) {
                        if (response.data.isTwoFactorEnabled) {
                            resolve(response);
                        } else {
                            handleAuthResponse(commit, response)
                            .then(resolve)
                            .catch(reject);
                        }
                    } else {
                        reject('Error during login');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    verifyOTP({ commit }, { loginParams, otpCode }) {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    process.env.VUE_APP_URL + '/api/auth/verify-otp?otp=' + otpCode,
                    loginParams
                )
                .then((response) => {
                    if (response) {
                        handleAuthResponse(commit, response)
                        .then(resolve)
                        .catch(reject);
                    } else {
                        reject('OTP verification failed');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
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
    auth_success(state, {token, refreshToken, user}) {
        state.status = 'success';
        state.token = token;
        state.refreshToken = refreshToken;
        state.user = user;
    },
    auth_error(state) {
        state.status = 'error'
    },
    logout(state) {
        state.status = ''
        state.token = ''
        state.refreshToken = ''
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

const handleAuthResponse = (commit, response) => {
    return new Promise((resolve, reject) => {
        if (response.data.token) {
            let token = response.data.token;
            let refreshToken = response.data.refreshToken;
            localStorage.setItem('auth_token', token);
            localStorage.setItem('refresh_token', refreshToken);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

            axios.post('/api/lider-console/profile').then((userresponse) => {
                commit('auth_success', { token, refreshToken, user: userresponse.data });
                getLiderWs().connect(userresponse.data.uid);
                resolve(userresponse);
            }).catch(reject);
        } else {
            reject('Authentication failed');
        }
    });
};

export default { state, getters, actions, mutations }