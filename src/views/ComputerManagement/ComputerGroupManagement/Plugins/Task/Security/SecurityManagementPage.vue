<template>
  <div>
    <div class="p-grid">
      <div class="p-col-12 p-md-6 p-lg-5">
        <usb-management 
          v-if="usbManagementState && isExistPrivilege('ROLE_DEVICE_MANAGEMENT')" 
            class="plugin-card" :pluginTask="pluginTaskUsbManagement">
        </usb-management>
      </div>
      <div class="p-col-12 p-md-6 p-lg-7">
        <usb-rule-management 
          v-if="usbRuleManagementState && isExistPrivilege('ROLE_USB_RULE')" 
          class="plugin-card" :pluginTask="pluginTaskUsbRuleManagement"
          :isGroup="false">
        </usb-rule-management>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Security Management Page. This page include all usb plugins
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import UsbManagement from "@/views/ComputerManagement/Plugins/Task/Security/Usb/UsbManagement.vue";
import UsbRuleManagement from "@/views/ComputerManagement/Plugins/Task/Security/Usb/UsbRuleManagement.vue";
import { taskService } from '../../../../../../services/Task/TaskService.js'
import {roleManagement} from "../../../../../../services/Roles/RoleManagement"


export default {
  data() {
    return {
      pluginTaskNetworkManagement: null,
      pluginTaskUsbManagement: null,
      pluginTaskUsbRuleManagement: null,
      
      networkManagementState: false,
      usbManagementState: false,
      usbRuleManagementState: false,
    };
  },

  components: {
    UsbManagement,
    UsbRuleManagement
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
      else {
        if(response.status == 200){
          for (let index = 0; index < response.data.length; index++) {
          const element = response.data[index];
          if (element.page == "network-manager") {
            this.pluginTaskNetworkManagement = element;
            this.networkManagementState = element.state;
          }
          if (element.page == "usb-management") {
            this.pluginTaskUsbManagement = element;
            this.usbManagementState = element.state;
          }
          if (element.page == "usb-rule-management") {
            this.pluginTaskUsbRuleManagement = element;
            this.usbRuleManagementState = element.state;
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
