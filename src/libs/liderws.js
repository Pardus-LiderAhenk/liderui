import SockJS from "sockjs-client";
import Stomp from "stompjs";

class LiderWs {
  constructor() {
    this.stompClient = null;
    this.socket = null;
    this.subscribers = new Set();
    this.username = null;
  }

  /**
   * @param {string} username - User identifier for task channel subscription
   * @param {{ onConnected?: () => void, onError?: (err: Error) => void }} [callbacks] - Optional callbacks
   */
  connect = (username, callbacks = {}) => {
    const { onConnected, onError } = callbacks;

    if (
      this.stompClient &&
      this.stompClient.connected &&
      this.username === username
    ) {
      onConnected?.();
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token || !token.trim()) {
      const err = new Error(
        "WebSocket requires authentication. No token found.",
      );
      err.code = "WS_AUTH_REQUIRED";
      this._notifyError(err);
      onError?.(err);
      return;
    }

    this.username = username;

    this.socket = new SockJS("/liderws");
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.debug = () => {};

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    this.stompClient.connect(
      headers,
      (frame) => {
        const subscription = this.stompClient.subscribe(
          `/liderws/task/${username}`,
          (message) => {
            try {
              const data = JSON.parse(message.body);
              this.subscribers.forEach((subscriber) =>
                subscriber({ ...data, channel: "task" }),
              );
            } catch (error) {
              console.error(
                "LiderWs: Error parsing task message:",
                message.body,
              );
            }
          },
        );

        this._lastSubscription = subscription;
        onConnected?.();
      },
      (error) => {
        console.error("LiderWs: Connection error:", error?.message || error);
        const err =
          error instanceof Error
            ? error
            : new Error(String(error?.message || error));
        if (
          error?.headers?.message?.includes("401") ||
          error?.message?.toLowerCase?.().includes("unauthorized")
        ) {
          err.code = "WS_UNAUTHORIZED";
        }
        this._notifyError(err);
        onError?.(err);
      },
    );
  };

  _notifyError = (error) => {
    this.subscribers.forEach((subscriber) => {
      if (typeof subscriber.onWsError === "function") {
        subscriber.onWsError(error);
      }
    });
  };

  disconnect = () => {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect();
    }
    if (this.socket) {
      this.socket.close();
    }
    this.stompClient = null;
    this.socket = null;
    this.subscribers.clear();
  };

  subscribe = (callback) => {
    this.subscribers.add(callback);
    return callback;
  };

  unsubscribe = (callback) => {
    this.subscribers.delete(callback);
  };

  isConnected = () => {
    return this.stompClient && this.stompClient.connected;
  };
}

let liderws = null;

export function getLiderWs() {
  if (!liderws) {
    liderws = new LiderWs();
  }
  return liderws;
}

/**
 * @param {string} username
 * @param {{ onConnected?: () => void, onError?: (err: Error) => void }} [callbacks]
 * @returns {ReturnType<typeof getLiderWs>}
 */
export function connectLiderWs(username, callbacks) {
  const ws = getLiderWs();
  ws.connect(username, callbacks);
  return ws;
}

export function disconnectLiderWs() {
  if (liderws) {
    liderws.disconnect();
  }
}
