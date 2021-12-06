const state = {
    selectedLiderNode: null,
}

const getters = {
    selectedLiderNode: state => state.selectedLiderNode,
}

const actions = {
    setSelectedLiderNode({ commit }, node) {
        commit("setSelectedLiderNode", node);
    },
}

const mutations = {
    setSelectedLiderNode: (state, node) => (state.selectedLiderNode = node),
}

export default { state, getters, actions, mutations }