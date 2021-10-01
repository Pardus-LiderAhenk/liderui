<template>
  <div>
    <br>
    <service-management class="plugin-card" v-if="serviceManagementState" :pluginTask="pluginTaskServiceManagement"></service-management>
  </div>
</template>

<script>
/**
 * Service Management Page. This page include all service plugins
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import axios from 'axios';
import ServiceManagement from "@/views/ComputerManagement/Plugins/Task/Service/ServiceManagement.vue";

export default {
  data() {
    return {
      pluginTaskServiceManagement: null,
      serviceManagementState: false,
    };
  },
  components: {
    ServiceManagement
  },

  created() {
    axios
      .post(
        process.env.VUE_APP_URL + "/getPluginTaskList",
        {},
      )
      .then((response) => {
        for (let index = 0; index < response.data.length; index++) {
          const element = response.data[index];
          if (element.page == "service-list") {
            this.pluginTaskServiceManagement = element;
            this.serviceManagementState = element.state;
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
