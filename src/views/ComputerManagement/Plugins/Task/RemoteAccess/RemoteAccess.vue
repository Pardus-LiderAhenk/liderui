<template>
  <div>
    <base-plugin 
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false"
      :pluginTask="task"
      @task-response="remoteAccessResponse"
    >
    <template #pluginTitle>
        {{ $t("computer.plugins.remote_access.header") }}
    </template>
    <template #pluginTitleButton>
        <Button
          icon="pi pi-desktop"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.remote_access.remote_destktop_access')"
          @click.prevent="sendTaskRemoteAccess"
        >
        </Button>
      </template>
      <template #default>
        <div class="p-fluid">
          <div class="p-field p-col-6">
              <label>{{ $t("computer.plugins.remote_access.remote_access_options") }}</label>
              <Dropdown
                v-model="selectedProtocol"
                :options="protocols"
                optionLabel="label"
                optionValue="value"
              >
              </Dropdown>
          </div>
        </div>
        <div class="p-fluid" v-if="selectedProtocol === 'vnc'">
          <div class="p-field p-col-6">
              <label>{{ $t("computer.plugins.remote_access.remote_access_options") }}</label>
              <Dropdown
                v-model="permission"
                :options="options"
                optionLabel="label"
                optionValue="value"
              >
              </Dropdown>
          </div>
        </div>

        <div class="p-fluid" v-if="selectedProtocol === 'ssh'">
          <div class="p-field p-col-6">
              <label>{{ "Username" }}</label>
                <InputText 
                  type="text"
                  v-model="sshUsername" 
                  :class="validationScriptParams ? 'p-invalid': ''" 
                />
          </div>
        </div>

        <div class="p-fluid" v-if="selectedProtocol === 'ssh'">
          <div class="p-field p-col-6">
              <label>{{ "Password" }}</label>
              <InputText 
                  type="password"
                  v-model="sshPassword" 
                  :class="validationScriptParams ? 'p-invalid': ''" 
                />
          </div>
        </div>
        
      </template>

     <template #pluginFooter> </template>
    </base-plugin>
   
    <Dialog header="pardus-virtualbox" v-model:visible="openRemoteAccessModal" @hide="remoteAccessDisconnect = true" :maximizable="true">
        <RemoteAccessComp :disconnected="remoteAccessDisconnect"
        />
    </Dialog>
    

  </div>
</template>

<script>
/**
 * Remote access with guacd
 * commandId: SETUP-VNC-SERVER
 * @see {@link http://www.liderahenk.org/}
 * 
 */
import RemoteAccessComp from '@/components/RemoteAccessComp/RemoteAccess.vue';
import axios from 'axios';
import { mapGetters } from "vuex"

export default {
  components: {
    RemoteAccessComp
  },
  props: {
    pluginTask: {
      type: Object,
      description: "Plugin task object",
    },
  },

   data() {
    return {
      task: null,
      showTaskDialog: false,
      pluginDescription: this.$t("computer.plugins.remote_access.description"),
      pluginUrl:"https://docs.liderahenk.org/lider-ahenk-docs/liderv2/computer_management/sistem/uzak_masaustu/",
      permission: "yes",
      options: [
        {label: this.$t('computer.plugins.remote_access.enable_user_permission_and_notification'), value: 'yes'},
        {label: this.$t('computer.plugins.remote_access.disable_user_permission_and_notification'), value: 'without_notify'}
      ],
      openRemoteAccessModal: false,
      remoteAccessDisconnect:false,
      protocols: [
        {label: 'SSH', value: 'ssh'},
        {label: 'VNC', value: 'vnc'}
      ],
      selectedProtocol: 'vnc',
      sshUsername:null,
      sshPassword:null,
    };
  },
  
  created() {
    this.task = { ...this.pluginTask };
  },
  computed: {
    ...mapGetters(["selectedLiderNode", "selectedNodeType", "selectedComputerGroupNode"]),
  },
  methods: {
    sendTaskRemoteAccess() {
      // this.task.commandId = "SETUP-VNC-SERVER";
      // this.task.parameterMap = {
      //   "permission": this.permission
      // }
      // this.showTaskDialog = true;


      // let routeData = this.$router.resolve({name: 'Remote Access', query: {}});
      // window.open(routeData.href, '_blank');

      this.$store.dispatch('addRemoteConnections', {
        "dn": this.selectedLiderNode.distinguishedName,
        "uid":this.selectedLiderNode.uid,
        "protocol": this.selectedProtocol,
        "sshUsername": this.sshUsername,
        "sshPassword": this.sshPassword,
        "permission":this.permission
      }).then(() => {
        let routeData = this.$router.resolve({name: 'Remote Access', query: {uid:this.selectedLiderNode.uid, protocol:this.selectedProtocol}});
        window.open(routeData.href, '_blank');
      });
    },

    remoteAccessResponse(message) {
      if (message.commandClsId == "SETUP-VNC-SERVER") {
        let arrg = JSON.parse(message.result.responseDataStr);
        this.startRemoteAccess(arrg);
      }
    },

    async startRemoteAccess(args) {
     
     if (args) {
        let data = new FormData();
        if (this.selectedProtocol && this.selectedProtocol == 'ssh') {
            data.append("protocol", this.selectedProtocol);
            data.append("port", 22);
            data.append("password", this.sshPassword);
            data.append("username", this.sshUsername);
        } else {
            data.append("protocol", this.selectedProtocol);
            data.append("port", args.port);
            data.append("password", args.password);
            data.append("username", '');
        }

        let checkhostFormdata = new FormData();
        checkhostFormdata.append('host', args.host);
        checkhostFormdata.append('port', this.selectedProtocol && this.selectedProtocol == 'ssh' ? 22 : args.port);
        const hostResponse = await axios.post('/checkhost',checkhostFormdata);
        data.append("host", hostResponse.data);
        await  axios.post('/sendremote', data);
        let routeData = this.$router.resolve({name: 'Remote Access', query: {}});
        window.open(routeData.href, '_blank');
     }
     
    },

    // openRemoteScreen() {
    //   let routeData = this.$router.resolve({name: 'routeName', query: {data: "someData"}});
    //   window.open(routeData.href, '_blank');
    // }
  }

};
</script>

<style scoped></style>
