<template>
  <div>
    <service-management class="plugin-card" v-if="serviceManagementState" :pluginTask="pluginTaskServiceManagement"></service-management>
  </div>
</template>

<script>
/**
 * Service Management Page. This page include all service plugins
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import ServiceManagement from "@/views/ComputerManagement/Plugins/Task/Service/ServiceManagement.vue";
import { taskService } from '../../../../../services/Task/TaskService.js'

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
    this.pluginTaskList();
  },

  methods: {

    async pluginTaskList(){
      const{response,error} = await taskService.pluginTaskList();
      if(error){
        return "error";
      }
      else{
        if(response.status == 200){
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index];
            if (element.page == "service-list") {
              this.pluginTaskServiceManagement = element;
              this.serviceManagementState = element.state;
            }
          }
        }
        else if(response.status == 417){
          return "error";

          }
        }        
    }
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
