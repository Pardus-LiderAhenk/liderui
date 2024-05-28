import SockJS from "sockjs-client";
import Stomp from "stompjs";


class LiderWs {
    constructor() {
        this.stompClient = null;
        this.socket = null;
        this.subscribers = new Set();
    }

    connect = () => {
        this.socket = new SockJS('/liderws');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.debug = () => {};
        this.stompClient.connect({}, (frame) => {
            this.stompClient.subscribe('/liderws/task', (task) => {
                this.subscribers.forEach(subscriber => subscriber(JSON.parse(task.body)));
            });
          });
    }

    disconnect = () => {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
            this.stompClient = null;
        }
    }

    subscribe = (subscriber) => {
        this.subscribers.add(subscriber);
        return subscriber;
    }

    unsubscribe = (subscriber) => {
        this.subscribers.delete(subscriber);
    }

    isConnected = () => {
        return this.stompClient !== null;
    }

}


let liderws = null;

export function getLiderWs() {
    if (!liderws) {
        liderws = new LiderWs();
    }
    return liderws;
  }
