//state tanımlama
const state = {
    remoteConnections: [],
}

//state okuma
const getters = {
    remoteConnections: state => state.remoteConnections,
}

const actions = {
    addRemoteConnections({ commit }, connectionInfo) {
        commit("remoteConnections", connectionInfo);
    },
    removeConnectionInfo({ commit }, connectionInfo) {
        commit("removeConnectionInfo", connectionInfo);
    },
    clearRemoteConnections({commit}) {
        commit("clearRemoteConnections");
    }
}

const mutations = {
    remoteConnections: (state, connectionInfo) => {
        state.remoteConnections.push(connectionInfo);
    },
    removeConnectionInfo: (state, connectionInfo)  => {
        let connections = [...state.remoteConnections];
        connections = connections.filter(item => connectionInfo.dn != item.dn && connectionInfo.protocol == item.protocol);
        state.remoteConnections = connections;
    },
    clearRemoteConnections: state => (state.remoteConnections = []),
}

export default { state, getters, actions, mutations }