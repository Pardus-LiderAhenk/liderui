import axios from 'axios';

const state = {
    selectedLiderNode: null,
    status: '',
	token: localStorage.getItem('token') || '',
}

const getters = {
    selectedLiderNode: state => state.selectedLiderNode,
}

const actions = {
    setSelectedLiderNode({ commit }, node) {
        commit("setSelectedLiderNode", node);
    },
    logout({ commit }) {
        return new Promise((resolve, reject) => {
            commit('logout')
            localStorage.removeItem('auth_token')
            delete axios.defaults.headers.common['Authorization']
            resolve()
        })
    }
}

const mutations = {
    setSelectedLiderNode: (state, node) => (state.selectedLiderNode = node),
    auth_request(state) {
        state.status = 'loading'
    },
    auth_success(state, token) {
        state.status = 'success'
        state.token = token
    },
    auth_error(state) {
        state.status = 'error'
    },
    logout(state) {
        state.status = ''
        state.token = ''
    }
}

export default { state, getters, actions, mutations }