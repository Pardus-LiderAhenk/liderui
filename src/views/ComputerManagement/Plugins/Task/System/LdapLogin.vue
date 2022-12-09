<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="closeShowTaskDialog"
      :pluginTask="task"
      executeTaskUrl="/api/ldap-login/task/execute"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.ldap_login.header") }}
      </template>
      <template #pluginTitleButton>
        <Button
          icon="pi pi-caret-right"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.button.run')"
          @click.prevent="sendTaskLoginSettings">
        </Button>
      </template>
      <template #default>
        <div>
          <div v-for="category of categories" :key="category.key" class="p-field-radiobutton">
            <RadioButton :id="category.key" name="category" :value="category" v-model="selectedSetting" />
            <label :for="category.key">{{category.name}}</label>
          </div>
          <Fieldset :legend="selectedSetting.name" >
            <p v-if="selectedSetting.key == 'cancel'">{{ $t("computer.plugins.ldap_login.default_settings") }}</p>
            <div v-if="selectedSetting.key == 'OpenLDAP'">
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-6">{{ $t("computer.plugins.ldap_login.server_address") }}:</div>
                  <div class="p-col-6"> {{ldapServer}} </div>
                </div>
              </li>
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-6">Base DN:</div>
                  <div class="p-col-6">{{ ldapRootDn }}</div>
                </div>
              </li> 
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-6">{{ $t("computer.plugins.ldap_login.disable_local_user") }}:</div>
                    <div class="p-col-6" v-if="disableLocalUser == true"> aktif </div>
                    <div class="p-col-6" v-else> pasif </div>
                </div>
              </li>
            </div>
            <div v-if="selectedSetting.key == 'AD'">
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-6">{{ $t("computer.plugins.ldap_login.domain") }}:</div>
                  <div class="p-col-6"> {{adDomainName}} </div>
                </div>
              </li>
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-6">{{ $t("computer.plugins.ldap_login.server_address") }}:</div>
                  <div class="p-col-6"> {{adIpAddress}} </div>
                </div>
              </li>
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-6">{{ $t("computer.plugins.ldap_login.server_name") }}:</div>
                  <div class="p-col-6"> {{adHostName}} </div>
                </div>
              </li>
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-6">{{ $t("computer.plugins.ldap_login.disable_local_user") }}:</div>
                  <div class="p-col-6" v-if="disableLocalUser == true"> aktif </div>
                  <div class="p-col-6" v-else> pasif </div>
                </div>
              </li>
            </div>
          </Fieldset>
        </div>
      </template>
      <template #pluginFooter></template>
    </base-plugin>
  </div>
</template>

<script>
/**
 * Ldap login plugin. This page authentication to OpenLDAP or Active Directory and cancel authentication from directory manager
 * commandId: EXECUTE_LDAP_LOGIN, EXECUTE_AD_LOGIN, EXECUTE_CANCEL_LDAP_LOGIN
 * @see {@link http://www.liderahenk.org/}
 * 
 */
import { mapGetters } from "vuex"
import { taskService } from "../../../../../services/Task/TaskService.js";

export default {
  props: {
    pluginTask: {
      type: Object,
      description: "Plugin task object",
    },
  },

  data() {
    return {
      showTaskDialog: false,
      task: null,
      cancelLdapLogin: false,
      categories: [
        {name: this.$t('computer.plugins.ldap_login.cancel_login_settings'), key: 'cancel'}, 
        {name: 'OpenLDAP', key: 'OpenLDAP'}, 
        {name: 'Active Directory', key: 'AD'}, 
      ],
      selectedSetting: {name: this.$t('computer.plugins.ldap_login.cancel_login_settings'), key: 'cancel'},
      ldapServer: "",
      ldapRootDn: "",
      adIpAddress: "",
      adDomainName: "",
      adHostName: "",
      disableLocalUser: null,
      allowDynamicDNSUpdate: false,
      pluginDescription: this.$t('computer.plugins.ldap_login.description'),
      pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/computerLoginSettings/",
    };
  },

  created() {
    this.task = {...this.pluginTask};
  },

  mounted() {
    this.loginConfigurations(null);
  },

  computed:mapGetters(["selectedLiderNode"]),

  methods: {
    sendTaskLoginSettings() {
      this.task.parameterMap = {};
      if (this.selectedSetting.key == "OpenLDAP") {
        this.task.commandId = "EXECUTE_LDAP_LOGIN";
        var agentDn = null;
        var agentPassword = null;
        
        if (this.selectedLiderNode != null && this.selectedLiderNode.type == "AHENK") {
          agentDn = this.selectedLiderNode.attributes.entryDN;
          agentPassword = this.selectedLiderNode.attributes.userPassword;
        }
        this.task.parameterMap = {
          "server-address": this.ldapServer,
					"dn": this.ldapRootDn,
					"admin-dn": agentDn,
					"admin-password": agentPassword,
					"disableLocalUser": this.disableLocalUser
        }
      } else if (this.selectedSetting.key == "AD") {
        this.task.commandId = "EXECUTE_AD_LOGIN";
        
        // set ad_username, admin_password, ad_port params in controller
        this.task.parameterMap = {
          "domain_name": this.adDomainName,
          "hostname": this.adHostName,
          "ip_address": this.adIpAddress,
          "disableLocalUser": this.disableLocalUser,
          "dynamic_dns_update": this.allowDynamicDNSUpdate,
          "ad_username": null,
          "admin_password": null,
          "ad_port": null
        }
      } else {
        this.task.commandId = "EXECUTE_CANCEL_LDAP_LOGIN";
        this.task.parameterMap = {
					"set-previous-settings": "execute_cancel_ldap_login"
			  };
      }
      this.showTaskDialog = true;
    },

    closeShowTaskDialog(event){
      this.showTaskDialog = false;
      if (event == "success") {
        this.updateUserDirectoryDomain();
      }
    },

    async loginConfigurations(){
      const{response,error} = await taskService.configurations();
      if(error){
        this.$toast.add({
          severity:'error', 
          detail: this.$t('computer.plugins.ldap_login.get_settings_error_message')+ " \n"+error, 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000
        })
      }
      else{
        if(response.status == 200){
          if (response.data != null) {
            this.ldapServer = response.data.ldapServer;
            this.ldapRootDn = response.data.ldapRootDn;
            this.adIpAddress = response.data.adIpAddress;
            this.adDomainName = response.data.adDomainName;
            this.adHostName = response.data.adHostName;
            this.disableLocalUser = response.data.disableLocalUser;
            this.allowDynamicDNSUpdate = response.data.allowDynamicDNSUpdate;

        } else {
            this.$toast.add({
              severity:'error', 
              detail: this.$t("computer.plugins.ldap_login.get_settings_error_message"), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
            });
          }
        }
        else if(response.status == 417){
          this.$toast.add({
              severity:'error', 
              detail: this.$t("computer.plugins.ldap_login.error_417_get_settings_configuration"), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
            });
        }
      } 
    },

  // Updated user directory domain field to db by selected dn as OpenLDAP, AD or
    async updateUserDirectoryDomain() {
      var userDirectoryDomain = null;
      if (this.task.commandId == "EXECUTE_LDAP_LOGIN") {
        userDirectoryDomain = "LDAP";
      } else if (this.task.commandId == "EXECUTE_AD_LOGIN"){
        userDirectoryDomain = "AD";
      }
      const params = new FormData();
      params.append("dn", this.selectedLiderNode.distinguishedName);
      params.append("userDirectoryDomain", userDirectoryDomain);

      const{response,error} = await taskService.updateDomain(params);
      if(error){
        this.$toast.add({
              severity:'error', 
              detail: this.$t("computer.plugins.ldap_login.error_update_directory_domain"), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
          });
          
      }
      else{
        if(response.status == 417){
          this.$toast.add({
              severity:'error', 
              detail: this.$t("computer.plugins.ldap_login.error_417_get_settings_configuration"), 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
            });        
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
