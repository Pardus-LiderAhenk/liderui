<template>
  <div>
    <remote-access class="plugin-card" v-if="remoteAccessState" :pluginTask="pluginTaskRemoteAccess"></remote-access>
  </div>
</template>

<script>
/**
 * Remote Access Page. 
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import axios from 'axios';
import RemoteAccess from "@/views/ComputerManagement/Plugins/Task/RemoteAccess/RemoteAccess.vue";

export default {
  data() {
    return {
      pluginTaskRemoteAccess: null,
      remoteAccessState: false,
    };
  },
  components: {
    RemoteAccess
  },

  created() {
    axios.post("/getPluginTaskList", {}).then((response) => {
        for (let index = 0; index < response.data.length; index++) {
          const element = response.data[index];
          if (element.page == "remote-access") {
            this.pluginTaskRemoteAccess = element;
            this.remoteAccessState = element.state;
          }
        }
      });
  },
};
</script>

<style scoped>
.plugin-card{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
}
.plugin-card:hover {
  box-shadow: 0 8px 20px 0 rgba(155, 150, 150, 0.2);
} 
</style>
