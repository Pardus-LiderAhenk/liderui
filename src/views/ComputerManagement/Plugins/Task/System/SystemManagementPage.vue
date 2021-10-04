<template>
  <div>
    <br>
    <div class="p-grid">
      <div class="p-col-5">
        <agent-info class="plugin-card" :pluginTask="pluginTaskResourceUsage"></agent-info>
        <session-and-power-management v-if="sessionAndPowerState" class="plugin-card" :pluginTask="pluginTaskSessionPowerManagement"></session-and-power-management>
        <manage-root v-if="manageRootState" class="plugin-card" :pluginTask="pluginTaskManageRoot"></manage-root>
        <!-- <remote-access v-if="remoteAccessState" class="plugin-card" :pluginTask="pluginTaskRemoteAccess"></remote-access>-->
        <local-user v-if="localUserState" class="plugin-card" :pluginTask="pluginTaskLocalUser"></local-user>
        <ldap-login v-if="ldapLoginState" class="plugin-card" :pluginTask="pluginTaskLdapLogin"></ldap-login>
        <xmessage v-if="xmessageState" class="plugin-card" :pluginTask="pluginTaskXmessage"></xmessage>
      </div>
      <div class="p-col-7">
        <resource-usage v-if="resourceUsageState" class="plugin-card" :pluginTask="pluginTaskResourceUsage"></resource-usage>
        <file-management v-if="fileManagementState" class="plugin-card" :pluginTask="pluginTaskFileManagement"></file-management>
       <file-transfer v-if="fileTransferState" class="plugin-card" :pluginTask="pluginTaskFileTransfer"></file-transfer>
       <conky v-if="conkyState" class="plugin-card" :pluginTask="pluginTaskConky"></conky>
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

import AgentInfo from "@/views/ComputerManagement/Plugins/Task/System/AgentInfo.vue";
import ResourceUsage from "@/views/ComputerManagement/Plugins/Task/System/ResourceUsage.vue";
import SessionAndPowerManagement from "@/views/ComputerManagement/Plugins/Task/System/SessionAndPowerManagement.vue";
import ManageRoot from "@/views/ComputerManagement/Plugins/Task/System/ManageRoot.vue";
import LocalUser from "@/views/ComputerManagement/Plugins/Task/System/LocalUser.vue";
import FileManagement from "@/views/ComputerManagement/Plugins/Task/System/FileManagement.vue";
import FileTransfer from "@/views/ComputerManagement/Plugins/Task/System/FileTransfer.vue";
// import RemoteAccess from "@/views/ComputerManagement/Plugins/Task/System/RemoteAccess.vue";
import LdapLogin from "@/views/ComputerManagement/Plugins/Task/System/LdapLogin.vue";
import Conky from "@/views/ComputerManagement/Plugins/Task/System/Conky.vue";
import Xmessage from "@/views/ComputerManagement/Plugins/Task/System/Xmessage.vue";

export default {
  data() {
    return {
      pluginTaskResourceUsage: null,
      pluginTaskSessionPowerManagement: null,
      pluginTaskManageRoot: null,
      pluginTaskConky: null,
      pluginTaskEtaNotify: null,
      pluginTaskFileManagement: null,
      pluginTaskLocalUser: null,
      pluginTaskLdapLogin: null,
      pluginTaskXmessage: null,
      pluginTaskFileTransfer: null,
      pluginTaskRemoteAccess: null,

      resourceUsageState: false,
      sessionAndPowerState: false,
      manageRootState: false,
      conkyState: false,
      etaNotifyState: false,
      fileManagementState: false,
      localUserState: false,
      ldapLoginState: false,
      xmessageState: false,
      fileTransferState: false,
      remoteAccessState: false,
    };
  },
  components: {
    AgentInfo,
    ResourceUsage,
    SessionAndPowerManagement,
    ManageRoot,
    LocalUser,
    FileManagement,
    FileTransfer,
    // RemoteAccess,
    LdapLogin,
    Conky,
    Xmessage
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
          if (element.page == "resource-usage") {
            this.pluginTaskResourceUsage = element;
            this.resourceUsageState = element.state;
          }
          if (element.page == "end-sessions") {
            this.pluginTaskSessionPowerManagement = element;
            this.sessionAndPowerState = element.state;
          }
          if (element.page == "conky") {
            this.pluginTaskConky = element;
            this.conkyState = element.state;
          }
          if (element.page == "eta-notify") {
            this.pluginTaskEtaNotify = element;
            this.etaNotifyState = element.state;
          }
          if (element.page == "file-management") {
            this.pluginTaskFileManagement = element;
            this.fileManagementState = element.state;
          }
          if (element.page == "local-user") {
            this.pluginTaskLocalUser = element;
            this.localUserState = element.state;
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
          if (element.page == "remote-access") {
            this.pluginTaskRemoteAccess = element;
            this.remoteAccessState = element.state;
          }
          if (element.page == "manage-root") {
            this.pluginTaskManageRoot = element
            this.manageRootState = element.state;
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