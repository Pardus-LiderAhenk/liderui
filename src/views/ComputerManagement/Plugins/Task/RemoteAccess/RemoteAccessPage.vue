<template>
  <div>
    <remote-access class="plugin-card" 
      v-if="remoteAccessState && isExistPrivilege('ROLE_REMOTE_ACCESS')" 
      :pluginTask="pluginTaskRemoteAccess">
    </remote-access>
  </div>
</template>

<script>
/**
 * Remote Access Page. 
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import RemoteAccess from "@/views/ComputerManagement/Plugins/Task/RemoteAccess/RemoteAccess.vue";
import { taskService } from '../../../../../services/Task/TaskService.js'
import {roleManagement} from "../../../../../services/Roles/RoleManagement"

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
    this.pluginTaskList();
  },

  methods: {
    isExistPrivilege(role){
      return roleManagement.isExistRole(role)
    },

    async pluginTaskList(){
      const{response,error} = await taskService.pluginTaskList();
      if(error){
        this.$toast.add({
          severity:'error', 
          detail: this.$t('computer.plugins.security.error_plugin_task_list'), 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        });
      }
      else{
        if(response.status == 200){
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index];
            if (element.page == "remote-access") {
              this.pluginTaskRemoteAccess = element;
              this.remoteAccessState = element.state;
            }
          }
        }
        else if(response.status == 417){
          this.$toast.add({
            severity:'error', 
            detail: this.$t('computer.plugins.security.error_417_plugin_task_list'), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
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
