<template>
  <div>
    <br>
    <div class="p-grid">
      <div class="p-col-12 p-md-6 p-lg-6">
        <network-management 
        v-if="networkManagementState" class="plugin-card" 
        :pluginTask="pluginTaskNetworkManagement">
        </network-management>
      </div>
      <div class="p-col-12 p-md-6 p-lg-6">
        <usb-management v-if="usbManagementState" class="plugin-card" :pluginTask="pluginTaskUsbManagement"></usb-management>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Package Management Page. This page include all package plugins
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import axios from 'axios';
import NetworkManagement from "@/views/ComputerManagement/Plugins/Task/Security/NetworkManagement/NetworkManagement.vue";
import UsbManagement from "@/views/ComputerManagement/Plugins/Task/Security/UsbManagement.vue";


export default {
  data() {
    return {
      pluginTaskNetworkManagement: null,
      pluginTaskUsbManagement: null,
      
      networkManagementState: false,
      usbManagementState: false,
    };
  },
  components: {
    NetworkManagement,
    UsbManagement
  },

  created() {
    axios.post("/getPluginTaskList",{},).then((response) => {
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
