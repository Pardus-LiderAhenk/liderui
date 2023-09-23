<template>
  <div>
    <execute-script class="plugin-card" 
      v-if="executeScriptState && isExistPrivilege('ROLE_SCRIPT')" 
      :pluginTask="pluginTaskExecuteScript">
    </execute-script>
  </div>
</template>

<script>
/**
 * Service Management Page. This page include all service plugins
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import ExecuteScript from "@/views/ComputerManagement/Plugins/Task/Script/ExecuteScript.vue";
import { taskService } from '../../../../../../services/Task/TaskService.js';
import {roleManagement} from "../../../../../../services/Roles/RoleManagement"

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
    this.pluginTaskList();
  },

  methods: {
    isExistPrivilege(role){
      return roleManagement.isExistRole(role)
    },

    async pluginTaskList(){
      const{response,error} = await  taskService.pluginTaskList();
      if(error){
        return "error";
      }
      else{
        if(response.status == 200){
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index];
            if (element.page == "execute-script") {
              this.pluginTaskExecuteScript = element;
              this.executeScriptState = element.state;
            }
          }
        }
        else if(response.status == 417){
          return "error";
        }
      }

    }
  }
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
