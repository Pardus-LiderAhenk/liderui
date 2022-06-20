<template>
  <Dialog :style="{width: '20vw'}"
    :header="$t('computer.task.toast_summary')" 
    v-model:visible="remoteAccessConfirmDialog"  
    :modal="true" 
  >
    <div class="confirmation-content">
      <span v-if="selectedProtocol === 'vnc'">
        <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>&nbsp;
        Uzak masaüstü erişimi sağlanacaktır, emin misiniz?
      </span>
      <span v-if="selectedProtocol === 'ssh'">
        <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>&nbsp;
        SSH erişimi sağlanacaktır, emin misiniz?
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
       @click="sendTaskRemoteAccess"
       class="p-button-sm"
       />
    </template>
  </Dialog>
  <div>
    <base-plugin 
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false"
      :pluginTask="task"
    >
    <template #pluginTitle>
        {{ $t("computer.plugins.remote_access.header") }}
    </template>
    <template #pluginTitleButton>
      <Button
          icon="pi pi-play"
          class="p-button-raised p-button-sm"
          title="Bağlan"
          @click.prevent="showRemoteAccessConfirmDialog"
        >
        </Button>
      </template>
      <template #default>
        <div class="p-fluid">
          <div class="p-field p-col-6">
              <label>Uzak Bağlantı Seçenekleri</label>
              <Dropdown
                v-model="selectedProtocol"
                :options="protocols"
                optionLabel="label"
                optionValue="value"
              >
              </Dropdown>
          </div>
        </div>
        <Fieldset class="p-field p-col-6" v-if="selectedProtocol === 'vnc'" :legend="$t('computer.plugins.remote_access.remote_access_options')">
          <div class="p-col-12">
            <div class="p-field-radiobutton">
                <RadioButton id="remoteAccessType1" name="yes" value="yes" v-model="permission"/>
                <label for="remoteAccessType1">{{$t('computer.plugins.remote_access.enable_user_permission_and_notification')}}</label>
            </div>
            <div class="p-field-radiobutton">
                <RadioButton id="remoteAccessType2" name="without_notify" value="without_notify"  v-model="permission"/>
                <label for="remoteAccessType2">{{$t('computer.plugins.remote_access.disable_user_permission_and_notification')}}</label>
            </div>
          </div>
        </Fieldset>
        <Fieldset class="p-fluid p-col-6" v-if="selectedProtocol === 'ssh'" legend="SSH Bağlantı Ayarları">
          <div class="p-field p-col-12">
            <label>{{ "IP Adresi" }}</label>
            <div class="p-inputgroup">
              <InputText 
                type="text"
                v-model="ipAddress" 
                :class="validationIpAddress ? 'p-invalid': ''" 
                placeholder="192.168.*.*"
              />
              <Button icon="pi pi-undo" title="IP Adresi Getir" @click="getIpAddress"/>
            </div>
            <small v-show="validationIpAddress" class="p-error">
              IP Adresi adı boş bırakılamaz
            </small>
          </div>
          <div class="p-field p-col-12">
              <label>{{ "Kullanıcı Adı" }}</label>
              <InputText 
                type="text"
                v-model="sshUsername" 
                :class="validationUsername ? 'p-invalid': ''" 
                placeholder="Kullanıcı adı"
              />
              <small v-show="validationUsername" class="p-error">
                Kullanıcı adı boş bırakılamaz
              </small>
          </div>
          <div class="p-field p-col-12">
              <label>{{ "Kullanıcı Parolası" }}</label>
              <Password :class="validationPassword ? 'p-invalid': ''"  
                v-model="sshPassword" :feedback="false" toggleMask
                placeholder="Kullanıcı parolası"
              />
              <small v-show="validationPassword" class="p-error">
                Kullanıcı parolası boş bırakılamaz
              </small>
          </div>
        </Fieldset>
      </template>
     <template #pluginFooter> </template>
    </base-plugin>
  </div>
</template>

<script>
/**
 * Remote access with guacd
 * commandId: SETUP-VNC-SERVER
 * @see {@link http://www.liderahenk.org/}
 * 
 */
import axios from 'axios';
import { mapGetters } from "vuex"

export default {
   data() {
    return {
      showTaskDialog: false,
      pluginDescription: this.$t("computer.plugins.remote_access.description"),
      pluginUrl:"https://docs.liderahenk.org/lider-ahenk-docs/liderv2/computer_management/sistem/uzak_masaustu/",
      permission: "yes",
      openRemoteAccessModal: false,
      remoteAccessDisconnect:false,
      protocols: [
        {label: 'VNC İle Bağlan', value: 'vnc'},
        {label: 'SSH İle Bağlan', value: 'ssh'}
      ],
      selectedProtocol: 'vnc',
      sshUsername: "",
      sshPassword: "",
      ipAddress: "",
      validationPassword: false,
      validationUsername: false,
      validationIpAddress: false,
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
        if (!this.ipAddress.trim()){
          this.validationIpAddress = true;
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

    sendTaskRemoteAccess() {
      this.$store.dispatch('addRemoteConnections', {
        "dn": this.selectedProtocol == 'vnc'? this.selectedLiderNode.distinguishedName: null,
        "uid": this.selectedProtocol == 'vnc'? this.selectedLiderNode.uid: null,
        "protocol": this.selectedProtocol,
        "sshUsername": this.sshUsername,
        "sshPassword": this.sshPassword,
        "permission": this.selectedProtocol == 'vnc'? this.permission: null,
        "ipAddress": this.ipAddress
      }).then(() => {
        let routeData = this.$router.resolve({path: '/remote-access', query: {uid:this.selectedLiderNode.uid, protocol:this.selectedProtocol}});
        window.open(routeData.href, '_blank');
      });
      this.remoteAccessConfirmDialog = false;
    },

    getIpAddress() {
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
      axios.post("/select_agent_info/detail", params).then((response) => {
        if (response.data != "" && response.data != null) {
          this.ipAddress = response.data.ipAddresses.replace(/'/g, "");
        } else {
          this.$toast.add({
            severity:'error', 
            detail: "Ip adresi getirilirken hata oluştu", 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
        }
      });
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

    ipAddress() {
      if (this.ipAddress.trim()){
        this.validationIpAddress = false;
      }
    }
  }
}

</script>

<style scoped></style>
