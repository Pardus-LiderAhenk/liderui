import { getLiderWs, connectLiderWs, disconnectLiderWs } from "@/libs/liderws";

const state = () => ({
  connected: false,
  username: null,
  userList: [],
  messages: [],
  taskMessages: [],
  lastError: null,
  userStatus: "offline",
});

const getters = {
  isConnected: (s) => s.connected,
  getUsername: (s) => s.username,
  getUserList: (s) => s.userList,
  getMessages: (s) => s.messages,
  getTaskMessages: (s) => s.taskMessages,
  getLastError: (s) => s.lastError,
  getUserStatus: (s) => s.userStatus,
  getOnlineUsers: (s) => s.userList.filter((user) => user.status === "online"),
  getOfflineUsers: (s) =>
    s.userList.filter((user) => user.status === "offline"),
};

const mutations = {
  SET_CONNECTED(s, connected) {
    s.connected = connected;
  },
  SET_USERNAME(s, username) {
    s.username = username;
  },
  SET_USER_LIST(s, userList) {
    s.userList = userList;
  },
  ADD_MESSAGE(s, message) {
    s.messages.push({
      ...message,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
    });
    if (s.messages.length > 100) {
      s.messages.shift();
    }
  },
  ADD_TASK_MESSAGE(s, message) {
    s.taskMessages.push({
      ...message,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
    });
    if (s.taskMessages.length > 50) {
      s.taskMessages.shift();
    }
  },
  CLEAR_TASK_MESSAGES(s) {
    s.taskMessages = [];
  },
  SET_LAST_ERROR(s, error) {
    s.lastError = error;
  },
  SET_USER_STATUS(s, status) {
    s.userStatus = status;
  },
  CLEAR_MESSAGES(s) {
    s.messages = [];
  },
};

const actions = {
  async connect({ commit, dispatch, rootState }) {
    try {
      const username = rootState.globalModule.user?.uid;
      if (!username) {
        return;
      }

      const ws = connectLiderWs(username, {
        onConnected: () => {
          commit("SET_CONNECTED", true);
          commit("SET_USERNAME", username);
          commit("SET_LAST_ERROR", null);
        },
        onError: (err) => {
          commit(
            "SET_LAST_ERROR",
            err?.message || "WebSocket connection failed",
          );
          commit("SET_CONNECTED", false);
        },
      });

      ws.subscribe((message) => {
        if (message.channel === "users") {
          commit("SET_USER_LIST", message.users || []);
        } else if (message.channel === "global") {
          commit("ADD_MESSAGE", message);
        } else if (message.channel === "task") {
          commit("ADD_TASK_MESSAGE", message);
        } else {
          commit("ADD_MESSAGE", message);
        }
      });

      if (typeof ws.updateUserStatus === "function") {
        ws.updateUserStatus("online");
      }
      if (typeof ws.requestUserList === "function") {
        ws.requestUserList();
      }
    } catch (error) {
      console.error("LiderWs: Connection error:", error);
      commit("SET_LAST_ERROR", error?.message || "WebSocket connection failed");
      commit("SET_CONNECTED", false);
    }
  },

  async disconnect({ commit }) {
    try {
      disconnectLiderWs();
      commit("SET_CONNECTED", false);
      commit("SET_USERNAME", null);
      commit("SET_USER_STATUS", "offline");
    } catch (error) {
      console.error("LiderWs: Disconnect error:", error);
    }
  },

  async sendMessage({ commit, state }, { channel, message }) {
    try {
      const ws = getLiderWs();
      if (ws.isConnected()) {
        ws.sendMessage(channel, {
          ...message,
          sender: state.username,
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new Error("WebSocket not connected");
      }
    } catch (error) {
      console.error("LiderWs: Send message error:", error);
      commit("SET_LAST_ERROR", error.message);
    }
  },

  async updateUserStatus({ commit, state }, status) {
    try {
      const ws = getLiderWs();
      if (ws.isConnected()) {
        ws.updateUserStatus(status);
        commit("SET_USER_STATUS", status);
      }
    } catch (error) {
      console.error("LiderWs: Update status error:", error);
      commit("SET_LAST_ERROR", error.message);
    }
  },

  async requestUserList({ commit }) {
    try {
      const ws = getLiderWs();
      if (ws.isConnected()) {
        ws.requestUserList();
      }
    } catch (error) {
      console.error("LiderWs: Request user list error:", error);
      commit("SET_LAST_ERROR", error.message);
    }
  },

  clearMessages({ commit }) {
    commit("CLEAR_MESSAGES");
  },

  clearTaskMessages({ commit }) {
    commit("CLEAR_TASK_MESSAGES");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
