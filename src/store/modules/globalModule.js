import axios from 'axios';

const state = {
    selectedLiderNode: null,
    status: '',
	token: localStorage.getItem('token') || '',
    user: {}
}

const getters = {
    selectedLiderNode: state => state.selectedLiderNode,
    getUser: state => state.user
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
    },
    login({ commit }, user) {
        return new Promise((resolve, reject) => {
            axios.post(process.env.VUE_APP_URL + "/api/auth/signin", user).then(
                (response) => {
                    localStorage.setItem("auth_token", response.data.token);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                    axios.post("/liderConsole/profile", {}).then((userresponse) => {
                        commit('auth_success', {token:response.data.token,user:userresponse.data});
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
    },
    update_user_lang(state, lang) {
        if (state.user) {
            state.user.attributesMultiValues.preferredLanguage[0] = lang;
        }
    }
}

export default { state, getters, actions, mutations }