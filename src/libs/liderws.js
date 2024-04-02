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
        this.stompClient.connect({}, (frame) => {
            this.stompClient.subscribe('/liderws/task', (task) => {
                console.log('Web socker mesaj geldi', JSON.parse(task.body));
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
        console.log('Subscribe olunduuuu')
        this.subscribers.add(subscriber);
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
