<template>
  <div>
    <div class="p-grid">
      <div class="p-col-12 p-md-6 p-lg-5">
        <agent-info class="plugin-card"
          :pluginTask="pluginTaskAgentInfo"
          @move-selected-agent="moveSelectedAgent"
          @delete-selected-agent="deleteSelectedAgent"
          @rename-selected-agent="renameSelectedAgent"
          @add-folder="addFolder">
        </agent-info>
        <session-and-power-management v-if="sessionAndPowerState && isExistPrivilege('ROLE_SESSION_POWER')" 
          class="plugin-card" 
          :pluginTask="pluginTaskSessionPowerManagement">
        </session-and-power-management>
        <manage-root v-if="manageRootState && isExistPrivilege('ROLE_MANAGE_ROOT')" class="plugin-card" :pluginTask="pluginTaskManageRoot"></manage-root>
        <!-- <remote-access v-if="remoteAccessState" class="plugin-card" :pluginTask="pluginTaskRemoteAccess"></remote-access>-->
        <local-user v-if="localUserState && isExistPrivilege('ROLE_LOCAL_USER')" class="plugin-card" :pluginTask="pluginTaskLocalUser"></local-user>
        <ldap-login v-if="ldapLoginState && isExistPrivilege('ROLE_LOGIN_MANAGER')" class="plugin-card" :pluginTask="pluginTaskLdapLogin"></ldap-login>
        <xmessage v-if="xmessageState && isExistPrivilege('ROLE_SEND_MESSAGE')" class="plugin-card" :pluginTask="pluginTaskXmessage"></xmessage>
      </div>
      <div class="p-col-12 p-md-6 p-lg-7">
        <resource-usage v-if="resourceUsageState && isExistPrivilege('ROLE_RESOURCE_USAGE')" class="plugin-card" :pluginTask="pluginTaskResourceUsage"></resource-usage>
        <file-management v-if="fileManagementState && isExistPrivilege('ROLE_FILE_MANAGEMENT')" class="plugin-card" :pluginTask="pluginTaskFileManagement"></file-management>
        <file-transfer v-if="fileTransferState && isExistPrivilege('ROLE_FILE_TRANSFER')" class="plugin-card" :pluginTask="pluginTaskFileTransfer"></file-transfer>
        <conky v-if="conkyState && isExistPrivilege('EXECUTE_CONKY')" class="plugin-card" :pluginTask="pluginTaskConky"></conky>
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
import { taskService } from '../../../../../services/Task/TaskService.js';
import { mapGetters } from "vuex";
import {roleManagement} from "../../../../../services/Roles/RoleManagement"


export default {
  props: {
    priviliges: {
      type: Array
    }
  },

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
      pluginTaskAgentInfo: null,

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
    this.pluginTaskList();
  },


  computed: {
    ...mapGetters(["getUser"]),
  },

  methods: {
    isExistPrivilege(role){
      return roleManagement.isExistRole(role)
    },

    moveSelectedAgent(deletedNode, selectedNode, destinationDn) {
      this.$emit('moveSelectedAgent', deletedNode, selectedNode, destinationDn,);
    },

    deleteSelectedAgent(selectedNode) {
      this.$emit('deleteSelectedAgent', selectedNode);
    },

    renameSelectedAgent(selectedNode) {
      this.$emit('renameSelectedAgent', selectedNode);
    },

    addFolder(folder, destinationDn) {
      this.$emit('addFolder', folder, destinationDn);
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
            if (element.page == "move-agent") {
              this.pluginTaskAgentInfo = element
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
