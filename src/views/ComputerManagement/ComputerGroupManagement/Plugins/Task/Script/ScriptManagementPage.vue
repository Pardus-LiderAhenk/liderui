<template>
  <div>
    <execute-script class="plugin-card" v-if="executeScriptState" :pluginTask="pluginTaskExecuteScript"></execute-script>
  </div>
</template>

<script>
/**
 * Service Management Page. This page include all service plugins
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import axios from 'axios';
import ExecuteScript from "@/views/ComputerManagement/Plugins/Task/Script/ExecuteScript.vue";

export default {
  data() {
    return {
      pluginTaskExecuteScript: null,
      executeScriptState: false,
    };
  },
  components: {
    ExecuteScript
  },

  created() {
    axios.post("/api/get-plugin-task-list", {}).then((response) => {
        for (let index = 0; index < response.data.length; index++) {
          const element = response.data[index];
          if (element.page == "execute-script") {
            this.pluginTaskExecuteScript = element;
            this.executeScriptState = element.state;
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
