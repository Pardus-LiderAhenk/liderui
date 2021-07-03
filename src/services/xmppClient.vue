<template>
  <p id="xmppStatus">!!!</p>
  <button @click="checkXmppStatus">Check</button>
</template>

<script>
import axios from "axios";
import XMPP from "./xmppClient.js";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      connection: null,
      isXmppConnected: false,
    };
  },

  setup() {
    const toast = useToast();
    return {
      toast,
    };
  },

  props: {
    response: Object,
  },

  mounted: function () {
    axios
      .post(process.env.VUE_APP_URL + "/api/messaging/getMessagingServerInfo", { })
      .then(
        (response) => {
            console.log(response)
            XMPP.loginToMessagingService(response)
        },
        (error) => {
          this.toast.error("");
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
