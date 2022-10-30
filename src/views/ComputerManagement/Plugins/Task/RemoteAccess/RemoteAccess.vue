<template>
  <Dialog :style="{width: '20vw'}"
    :header="$t('computer.task.toast_summary')" 
    v-model:visible="remoteAccessConfirmDialog"  
    :modal="true" 
  >
    <div class="confirmation-content">
      <span v-if="selectedProtocol === 'vnc'">
        <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>&nbsp;
        {{$t('computer.plugins.remote_access.remote_desktop_access_will_be_provided_are_you_sure')}}
      </span>
      <span v-if="selectedProtocol === 'ssh'">
        <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>&nbsp;
        {{$t('computer.plugins.remote_access.ssh_access_will_be_provided_are_you_sure')}}
      </span>
    </div>
    <template #footer>
      <Button 
        :label="$t('computer.plugins.base_plugin.no')" 
        icon="pi pi-times" 
        @click="remoteAccessConfirmDialog = false" 
        class="p-button-text p-button-sm"
      />
      <Button 
       :label="$t('computer.plugins.base_plugin.yes')"
       icon="pi pi-check" 
       @click="connectRemoteAccess"
       class="p-button-sm"
       />
    </template>
  </Dialog>
  <div>
    <Card>
      <template #title>
        <div class="p-d-flex p-jc-between">
          <div style="font-size:15px;">
            {{ $t("computer.plugins.remote_access.header") }}
          </div>
          <div>
            <Button
              icon="pi pi-play"
              class="p-button-raised p-button-sm"
              :title="$t('computer.plugins.remote_access.connect')"
              @click.prevent="showRemoteAccessConfirmDialog"
            >
            </Button>
          </div>
        </div>
        <hr style="margin-bottom:-5px">
      </template>
      <template #content>
        <div class="p-fluid">
          <div class="p-field p-col-6">
            <label>{{$t('computer.plugins.remote_access.remote_access_option')}}</label>
            <Dropdown
              v-model="selectedProtocol"
              :options="protocols"
              optionLabel="label"
              optionValue="value"
            >
            </Dropdown>
          </div>
        </div>
        <Fieldset class="p-field p-col-6" v-if="selectedProtocol === 'vnc'" 
          :legend="$t('computer.plugins.remote_access.remote_access_options')"
        >
          <div class="p-col-12">
            <div class="p-field-radiobutton">
              <RadioButton id="remoteAccessType1" name="yes" value="yes" v-model="permission"/>
              <label for="remoteAccessType1">
                {{$t('computer.plugins.remote_access.enable_user_permission_and_notification')}}
              </label>
            </div>
            <div class="p-field-radiobutton">
              <RadioButton id="remoteAccessType2" name="without_notify" value="without_notify" v-model="permission"/>
              <label for="remoteAccessType2">
                {{$t('computer.plugins.remote_access.disable_user_permission_and_notification')}}
              </label>
            </div>
          </div>
        </Fieldset>
        <Fieldset class="p-fluid p-col-6" v-if="selectedProtocol === 'ssh'" 
          :legend="$t('computer.plugins.remote_access.ssh_connection_settings')"
        >
          <div class="p-field p-col-12">
            <label>{{$t('computer.plugins.remote_access.ip_address')}}</label>
            <div class="p-inputgroup">
              <InputText 
                type="text"
                v-model="host" 
                :class="validationHost ? 'p-invalid': ''" 
                placeholder="192.168.*.*"
              />
              <Button icon="pi pi-undo" 
                :title="$t('computer.plugins.remote_access.get_ip_address')" 
                @click="getIpAddress"
              />
            </div>
            <small v-show="validationHost" class="p-error">
              {{$t('computer.plugins.remote_access.ip_address_cannot_be_null')}}
            </small>
          </div>
          <div class="p-field p-col-12">
            <label>{{$t('computer.plugins.remote_access.username')}}</label>
            <InputText 
              type="text"
              v-model="sshUsername" 
              :class="validationUsername ? 'p-invalid': ''" 
              :placeholder="$t('computer.plugins.remote_access.username')"
            />
            <small v-show="validationUsername" class="p-error">
              {{$t('computer.plugins.remote_access.username_cannot_be_null')}}
            </small>
          </div>
          <div class="p-field p-col-12">
            <label>{{$t('computer.plugins.remote_access.user_password')}}</label>
            <Password :class="validationPassword ? 'p-invalid': ''"  
              v-model="sshPassword" :feedback="false" toggleMask
              :placeholder="$t('computer.plugins.remote_access.user_password_cannot_be_null')"
            />
            <small v-show="validationPassword" class="p-error">
                {{$t('computer.plugins.remote_access.user_password_cannot_be_null')}}
            </small>
          </div>
        </Fieldset>
      </template>
      <template #footer>
        <div class="p-col p-as-start">
          <a class="primary" type="secondary" @click="toggle" 
            v-tooltip.right="$t('computer.plugins.plugin_popover.title')">
            <i class="el el-icon-question"></i>
          </a>
          <OverlayPanel ref="op" 
            appendTo="body" 
            :showCloseIcon="false" 
            id="overlay_panel" 
            style="width: 450px" 
            :breakpoints="{'960px': '75vw'}"
          >
            <div><h5>{{ $t('computer.plugins.plugin_popover.title') }}</h5></div>
            <ul>
              <li>
                <small>{{ pluginDescription }}</small>
              </li>
            </ul>
            <i class="pi pi-link"></i>&nbsp;<a :href="pluginUrl" type="primary" target="_blank">
              {{ $t('computer.plugins.plugin_popover.for_more_info') }}...
            </a>
          </OverlayPanel>
        </div>
       </template>
    </Card>
  </div>
</template>

<script>
/**
 * Remote access with guacd
 * commandId: SETUP-VNC-SERVER
 * @see {@link http://www.liderahenk.org/}
 * 
 */
import { mapGetters } from "vuex";
import { taskService } from '../../../../../services/Task/TaskService.js';

export default {
   data() {
    return {
      pluginDescription: this.$t("computer.plugins.remote_access.description"),
      pluginUrl:"https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/remoteAccess/",
      permission: "yes",
      protocols: [
        {label: this.$t('computer.plugins.remote_access.connect_with_vnc'), value: 'vnc'},
        {label: this.$t('computer.plugins.remote_access.connect_with_ssh'), value: 'ssh'}
      ],
      selectedProtocol: 'vnc',
      sshUsername: "",
      sshPassword: "",
      host: "",
      validationPassword: false,
      validationUsername: false,
      validationHost: false,
      remoteAccessConfirmDialog: false
    };
  },

  computed: {
    ...mapGetters(["selectedLiderNode"]),
  },

  methods: {
    showRemoteAccessConfirmDialog() {
      if (this.selectedProtocol == "vnc") {
        if (this.selectedLiderNode == null || 
          this.selectedLiderNode.type != "AHENK") {
          this.$toast.add({
            severity:'warn', 
            detail: this.$t("computer.task.selected_agent_warn"), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 5000
          });
          return;
        }
      } else if (this.selectedProtocol == "ssh") {
        if (!this.host.trim()){
          this.validationHost = true;
          return;
        }
        if (!this.sshUsername.trim()){
          this.validationUsername = true;
          return;
        }
        if (!this.sshPassword.trim()){
          this.validationPassword = true;
          return;
        }
      }
      this.remoteAccessConfirmDialog = true;
    },

    connectRemoteAccess() {
      let data = {
        "dn": this.selectedProtocol == 'vnc'? this.selectedLiderNode.distinguishedName: null,
        "uid": this.selectedProtocol == 'vnc'? this.selectedLiderNode.uid: null,
        "protocol": this.selectedProtocol,
        "permission": this.selectedProtocol == 'vnc'? this.permission: null,
        "sshUsername": this.selectedProtocol == 'ssh'? this.sshUsername: null,
        "sshPassword": this.selectedProtocol == 'ssh'? this.sshPassword: null,
        "host": this.selectedProtocol == 'ssh'? this.host: null
      }
      // if selected protocol is vnc added remote connection info to vuex
      if (this.selectedProtocol == "vnc") {
        this.$store.dispatch('addRemoteConnections', data).then(() => {
          let routeData = this.$router.resolve({path: '/remote-access', 
          query: {
              uid:this.selectedProtocol == 'vnc'? this.selectedLiderNode.uid: null,
              protocol:this.selectedProtocol
            }
          });
          window.open(routeData.href, '_blank');
        });
      } else if (this.selectedProtocol == "ssh") {
        let routeData = this.$router.resolve({path: '/remote-access', 
          query: {
              sshUsername: this.sshUsername,
              sshPassword: this.sshPassword,
              host: this.host,
              protocol: this.selectedProtocol
            }
          });
          window.open(routeData.href, '_blank');
      }
      this.remoteAccessConfirmDialog = false;
    },

    async getIpAddress() {
      if (this.selectedLiderNode == null || 
        this.selectedLiderNode.type != "AHENK") {
        this.$toast.add({
          severity:'warn', 
          detail: this.$t("computer.task.selected_agent_warn"), 
          summary:this.$t("computer.task.toast_summary"), 
          life: 5000
        });
        return;
      }
      const params = new FormData();
      params.append("agentJid", this.selectedLiderNode.uid);
      //axios.post("/api/select-agent-info/detail", params).then((response) => {
      const { response,error } = await taskService.agentInfoDetail(params);
      if(error){
        this.$toast.add({
            severity:'error', 
            detail: this.$t('computer.plugins.remote_access.an_error_occurred_while_fetching_the_ip_address'), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
      }
      else{
        if(response.status == 200){
          if (response.data != "" && response.data != null) {
            this.host = response.data.ipAddresses.replace(/'/g, "");
          }
        }
        else if(response.status == 417){
          this.$toast.add({
            severity:'error', 
            detail: this.$t('computer.plugins.remote_access.error_417_fetching_ip_address'), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
        }
      }

    },

    toggle(event) {
      this.$refs.op.toggle(event);
    },
  },

  watch: {
    sshUsername() {
      if (this.sshUsername.trim()){
        this.validationUsername = false;
      }
    },
    
    sshPassword() {
      if (this.sshPassword.trim()){
        this.validationPassword = false;
      }
    },

    host() {
      if (this.host.trim()){
        this.validationHost = false;
      }
    }
  }
}

</script>

<style scoped></style>
