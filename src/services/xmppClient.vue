<template>
  <p id="xmppStatus">!!!</p>
  <button @click="checkXmppStatus">Check</button>
  <h1>asdasdsad</h1>
</template>

<script>
import axios from "axios";
import XMPP from "./xmppClient.js";

export default {
  data() {
    return {
      connection: null,
      isXmppConnected: false,
    };
  },

 
  props: {
    response: Object,
  },

  mounted: function () {
    axios
      .post(process.env.VUE_APP_URL + "/api/messaging/get-messaging-server-info", { })
      .then(
        (response) => {
            console.log(response)
            XMPP.loginToMessagingService(response)
        },
        (error) => {
          console.log("XMPP service is not running");
        }
      );
  },

  methods: {
    checkXmppStatus: function () {
       this.isXmppConnected = XMPP.isConnected()
    }
  },
};
</script>

<style></style>
