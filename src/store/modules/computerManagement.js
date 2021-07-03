//state tanımlama
const state = {
    selectedAgent: null,
    selectedAgentInfo: null
}

//state okuma
const getters = {
    selectedAgent: state => state.selectedAgent,
    selectedAgentInfo: state => state.selectedAgentInfo
}

const actions = {
    setSelectedAgent({ commit }, agent) {
        commit("setSelectedAgent", agent)
    },

    setSelectedAgentInfo({ commit }, agent) {
        commit("setSelectedAgentInfo", agent)
    },
}

const mutations = {
    setSelectedAgent: (state, agent) => (state.selectedAgent = agent),
    setSelectedAgentInfo: (state, agentInfo) => (state.selectedAgentInfo = agentInfo)
}

export default { state, getters, actions, mutations }