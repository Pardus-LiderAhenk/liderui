//state tanımlama
const state = {
    selectedAgent: null,
    selectedAgentInfo: null,
    selectedAgentMessages : [],
}

//state okuma
const getters = {
    selectedAgent: state => state.selectedAgent,
    selectedAgentInfo: state => state.selectedAgentInfo,
    selectedAgentMessages: state => state.selectedAgentMessages
}

const actions = {
    setSelectedAgent({ commit }, agent) {
        commit("setSelectedAgent", agent);
        // commit("clearSelectedAgentMessages");
    },

    setSelectedAgentInfo({ commit }, agent) {
        commit("setSelectedAgentInfo", agent);
    },
    addSelectedAgentMessage({ commit }, msg) {
        commit("addSelectedAgentMessage", msg);
    },
    clearSelectedAgentMessages({commit}) {
        commit("clearSelectedAgentMessages");
    }
}

const mutations = {
    setSelectedAgent: (state, agent) => (state.selectedAgent = agent),
    setSelectedAgentInfo: (state, agentInfo) => (state.selectedAgentInfo = agentInfo),
    addSelectedAgentMessage: (state, msg) => {
        state.selectedAgentMessages = state.selectedAgentMessages.filter(val => (val != undefined 
            && val.pluginName != msg.pluginName 
            && val.commandExecution != undefined 
            && val.commandExecution.dn != msg.commandExecution.dn
            && val.commanClsId != msg.commanClsId))
        state.selectedAgentMessages.push(msg)
    },
    clearSelectedAgentMessages: state => (state.selectedAgentMessages = [])
}

export default { state, getters, actions, mutations }