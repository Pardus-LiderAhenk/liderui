<template>
  <div>
    <div class="p-grid">
      <div class="p-col-12 p-md-6 p-lg-5">
        <member-of-agent-group class="plugin-card"></member-of-agent-group>
        <session-and-power-management v-if="sessionAndPowerState" 
        class="plugin-card" 
        :pluginTask="pluginTaskSessionPowerManagement">
        </session-and-power-management>
        <manage-root v-if="manageRootState" class="plugin-card" :pluginTask="pluginTaskManageRoot"></manage-root>
        <ldap-login v-if="ldapLoginState" class="plugin-card" :pluginTask="pluginTaskLdapLogin"></ldap-login>
        <usb-management v-if="usbManagementState" class="plugin-card" :pluginTask="pluginTaskUsbManagement"></usb-management>
      </div>
      <div class="p-col-12 p-md-6 p-lg-7">
        <file-transfer v-if="fileTransferState" class="plugin-card" :pluginTask="pluginTaskFileTransfer"></file-transfer>
        <conky v-if="conkyState" class="plugin-card" :pluginTask="pluginTaskConky"></conky>
        <xmessage v-if="xmessageState" class="plugin-card" :pluginTask="pluginTaskXmessage"></xmessage>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * System Management Page. This page include all system plugins
 * @see {@link http://www.liderahenk.org/}
 * 
 */
import axios from 'axios';

import MemberOfAgentGroup from "@/views/ComputerManagement/ComputerGroupManagement/Plugins/Task/System/MemberOfAgentGroup.vue";
import SessionAndPowerManagement from "@/views/ComputerManagement/Plugins/Task/System/SessionAndPowerManagement.vue";
import ManageRoot from "@/views/ComputerManagement/Plugins/Task/System/ManageRoot.vue";
import FileTransfer from "@/views/ComputerManagement/Plugins/Task/System/FileTransfer.vue";
import LdapLogin from "@/views/ComputerManagement/Plugins/Task/System/LdapLogin.vue";
import Conky from "@/views/ComputerManagement/Plugins/Task/System/Conky.vue";
import Xmessage from "@/views/ComputerManagement/Plugins/Task/System/Xmessage.vue";
import UsbManagement from "@/views/ComputerManagement/Plugins/Task/Security/UsbManagement.vue";

export default {
  data() {
    return {
      pluginTaskSessionPowerManagement: null,
      pluginTaskManageRoot: null,
      pluginTaskConky: null,
      pluginTaskLdapLogin: null,
      pluginTaskXmessage: null,
      pluginTaskFileTransfer: null,
      pluginTaskUsbManagement: null,

      sessionAndPowerState: false,
      manageRootState: false,
      conkyState: false,
      ldapLoginState: false,
      xmessageState: false,
      fileTransferState: false,
      usbManagementState: false,
    };
  },
  components: {
    MemberOfAgentGroup,
    SessionAndPowerManagement,
    ManageRoot,
    FileTransfer,
    LdapLogin,
    Conky,
    Xmessage,
    UsbManagement
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
          if (element.page == "end-sessions") {
            this.pluginTaskSessionPowerManagement = element;
            this.sessionAndPowerState = element.state;
          }
          if (element.page == "conky") {
            this.pluginTaskConky = element;
            this.conkyState = element.state;
          }
          if (element.page == "ldap-login") {
            this.pluginTaskLdapLogin = element;
            this.ldapLoginState = element.state;
          }
          if (element.page == "xmessage") {
            this.pluginTaskXmessage = element;
            this.xmessageState = element.state;
          }
          if (element.page == "file-transfer") {
            this.pluginTaskFileTransfer = element;
            this.fileTransferState = element.state;
          }
          if (element.page == "manage-root") {
            this.pluginTaskManageRoot = element
            this.manageRootState = element.state;
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
