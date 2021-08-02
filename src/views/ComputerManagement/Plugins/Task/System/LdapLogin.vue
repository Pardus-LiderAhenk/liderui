<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false"
      @task-response="ldapLoginResponse"
      :pluginTask="task"
    >
      <template #pluginHeader>
        {{ $t("computer.plugins.ldap_login.header") }}
      </template>
      <template #pluginHeaderButton>
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
                  <div class="p-col-4">{{ $t("computer.plugins.ldap_login.server_address") }}:</div>
                  <div class="p-col-8"> {{ldapServer}} </div>
                </div>
              </li>
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-4">Base DN:</div>
                  <div class="p-col-8">{{ ldapRootDn }}</div>
                </div>
              </li> 
            </div>
            <div v-if="selectedSetting.key == 'AD'">
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-4">{{ $t("computer.plugins.ldap_login.domain") }}:</div>
                  <div class="p-col-8"> {{adDomainName}} </div>
                </div>
              </li>
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-4">{{ $t("computer.plugins.ldap_login.server_address") }}:</div>
                  <div class="p-col-8"> {{adIpAddress}} </div>
                </div>
              </li>
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-4">{{ $t("computer.plugins.ldap_login.server_name") }}:</div>
                  <div class="p-col-8"> {{adHostName}} </div>
                </div>
              </li>
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-4">Port:</div>
                  <div class="p-col-8"> {{adPort}} </div>
                </div>
              </li>
              <li style="list-style-type: none;">
                <div class="p-grid">
                  <div class="p-col-4">{{ $t("computer.plugins.ldap_login.username") }}:</div>
                  <div class="p-col-8"> {{adAdminUserName}} </div>
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
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import axios from "axios";
import { mapGetters } from "vuex"

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
      adAdminUserName: "",
      adAdminPassword: "",
      adPort: "",
      disableLocalUser: null,
      pluginDescription: this.$t('computer.plugins.ldap_login.description'),
      pluginUrl: "https://docs.liderahenk.org/lider-ahenk-docs/liderv2/computer_management/sistem/istemci_oturum_acma_ayarlari/",
    };
  },

  created() {
    this.task = {...this.pluginTask};
  },

  mounted() {
    axios.get(process.env.VUE_APP_URL + "/ldap_login/configurations", null)
    .then((response) => {
      if (response.data != null) {
        this.ldapServer = response.data.ldapServer;
        this.ldapRootDn = response.data.ldapRootDn;
        this.adIpAddress = response.data.adIpAddress;
        this.adDomainName = response.data.adDomainName;
        this.adHostName = response.data.adHostName;
        this.adAdminUserName = response.data.adAdminUserName;
        this.adAdminPassword = response.data.adAdminPassword;
        this.adPort = response.data.adPort;
        this.disableLocalUser = response.data.disableLocalUser;
      } else {
        this.$toast.add({severity:'error', detail: this.$t("computer.plugins.ldap_login.get_settings_error_message"), summary:this.$t("computer.task.toast_summary"), life: 3000});
      }
    });
  },

  computed:mapGetters(["selectedAgent"]),

  methods: {
    sendTaskLoginSettings() {
      this.task.parameterMap = {};
      if (this.selectedSetting.key == "OpenLDAP") {
        this.task.commandId = "EXECUTE_LDAP_LOGIN";
        var adminDn = null;
        var adminPassword = null;
        if (this.selectedAgent != null && this.selectedAgent.type == "AHENK") {
          adminDn = this.selectedAgent.attributes.entryDN;
          adminPassword = this.selectedAgent.attributes.userPassword;
        }
        this.task.parameterMap = {
          "server-address": this.ldapServer,
					"dn": this.ldapRootDn,
					"admin-dn": adminDn,
					"admin-password": adminPassword,
					"disableLocalUser": this.disableLocalUser
        }
      } else if (this.selectedSetting.key == "AD") {
        this.task.commandId = "EXECUTE_AD_LOGIN";
        this.task.parameterMap = {
          "domain_name": this.adDomainName,
          "hostname": this.adHostName,
          "ip_address": this.adIpAddress,
          "ad_username": this.adAdminUserName,
          "admin_password": this.adAdminPassword,
          "ad_port": this.adPort,
          "disableLocalUser": this.disableLocalUser
        }
      } else {
        this.task.commandId = "EXECUTE_CANCEL_LDAP_LOGIN";
        this.task.parameterMap = {
					"set-previous-settings": "execute_cancel_ldap_login"
			  };
      }
      this.showTaskDialog = true;
    },
    ldapLoginResponse(message) {
      alert("will be update  user domain")
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
