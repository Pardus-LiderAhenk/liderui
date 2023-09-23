<template>
  <div>
    <div class="p-grid">
      <div class="p-col-12 p-md-6 p-lg-5">
        <member-of-agent-group class="plugin-card"></member-of-agent-group>
        <session-and-power-management v-if="sessionAndPowerState && isExistPrivilege('ROLE_SESSION_POWER')" 
          class="plugin-card" 
          :pluginTask="pluginTaskSessionPowerManagement">
        </session-and-power-management>
        <manage-root v-if="manageRootState && isExistPrivilege('ROLE_MANAGE_ROOT')" 
          class="plugin-card" :pluginTask="pluginTaskManageRoot">
        </manage-root>
        <ldap-login v-if="ldapLoginState && isExistPrivilege('ROLE_LOGIN_MANAGER')" 
          class="plugin-card" :pluginTask="pluginTaskLdapLogin">
        </ldap-login>
      </div>
      <div class="p-col-12 p-md-6 p-lg-7">
        <file-transfer v-if="fileTransferState && isExistPrivilege('ROLE_FILE_MANAGEMENT')" 
          class="plugin-card" :pluginTask="pluginTaskFileTransfer">
        </file-transfer>
        <conky v-if="conkyState && isExistPrivilege('ROLE_CONKY')" 
          class="plugin-card" 
          :pluginTask="pluginTaskConky">
        </conky>
        <xmessage v-if="xmessageState && isExistPrivilege('ROLE_SEND_MESSAGE')"
          class="plugin-card" :pluginTask="pluginTaskXmessage">
        </xmessage>
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
import {roleManagement} from "../../../../../../services/Roles/RoleManagement"


export default {
  data() {
    return {
      pluginTaskSessionPowerManagement: null,
      pluginTaskManageRoot: null,
      pluginTaskConky: null,
      pluginTaskLdapLogin: null,
      pluginTaskXmessage: null,
      pluginTaskFileTransfer: null,

      sessionAndPowerState: false,
      manageRootState: false,
      conkyState: false,
      ldapLoginState: false,
      xmessageState: false,
      fileTransferState: false,
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
  },

  created() {
    axios
      .post(
        process.env.VUE_APP_URL + "/api/get-plugin-task-list",
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
        }
      });
  },

  methods: {
    isExistPrivilege(role){
      return roleManagement.isExistRole(role)
    },
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
