<template>
  <div>
    <base-plugin
      :pluginUrl="pluginUrl"
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false"
      :pluginTask="task"
      @task-response="networkManagementResponse"
    >
      <template #pluginTitle>
        {{ $t("computer.plugins.network_management.header") }}
      </template>
      <template #pluginTitleButton>
        <div>
          <Button
            icon="pi pi-list"
            class="p-button-raised p-button-sm"
            :title="$t('computer.plugins.network_management.list_network_settings')"
            @click.prevent="getNetworkSettings"
          >
          </Button>
        </div>
      </template>
      <template #default>
        <div class="p-grid p-flex-column">
            <TabView ref="tabview1">
              <TabPanel>
                <template #header>
                  <i class="pi pi-globe"></i>
                  <span>
                      &nbsp;{{$t("computer.plugins.network_management.dns")}}
                  </span>
                </template>
                <DNSManager
                   :message="dnsMessage"
                   @send-dns-task="sendTaskNetworkManagement">
                </DNSManager>
              </TabPanel>
              <TabPanel>
                <template #header>
                  <i class="fa fa-server"></i>
                  <span>
                      &nbsp;{{$t("computer.plugins.network_management.servers")}}
                  </span>
                </template>
                <HostManager
                   :message="hostMessage"
                   @send-host-task="sendTaskNetworkManagement">
                </HostManager>
              </TabPanel>
              <TabPanel>
                <template #header>
                  <i class="fa fa-network-wired"></i>
                  <span>
                      &nbsp;{{$t("computer.plugins.network_management.network")}}
                  </span>
                </template>
                <NetworkInterfacesManager
                   :message="networkMessage"
                   @send-network-interfaces-task="sendTaskNetworkManagement">
                </NetworkInterfacesManager>
              </TabPanel>
              <TabPanel>
                <template #header>
                  <i class="fa fa-compress-arrows-alt"></i>
                  <span>
                      &nbsp;{{$t("computer.plugins.network_management.ports")}}
                  </span>
                </template>
                <PortManager
                   :message="portMessage"
                   @send-port-task="sendTaskNetworkManagement">
                </PortManager>
              </TabPanel>
            </TabView>
        </div>
      </template>
      <template #pluginFooter> </template>
    </base-plugin>
  </div>
</template>

<script>
/**
 * Network Management Plugin. Allows to management newtwork settings of client
 * commandId: GET_NETWORK_INFORMATION, ADD_DNS, ADD_DOMAIN, ADD_NETWORK,
 * commandId: ALLOW_PORT, BLOCK_PORT, CHANGE_HOSTNAME, DELETE_DOMAIN, DELETE_HOST
 * commandId: DELETE_DNS, DELETE_NETWORK, ADD_HOST
 * @see {@link http://www.liderahenk.org/}
 *
 */

import DNSManager from '@/views/ComputerManagement/Plugins/Task/Security/NetworkManagement/Tabs/DNSManager.vue'
import HostManager from '@/views/ComputerManagement/Plugins/Task/Security/NetworkManagement/Tabs/HostManager.vue'
import NetworkInterfacesManager from '@/views/ComputerManagement/Plugins/Task/Security/NetworkManagement/Tabs/NetworkInterfacesManager.vue'
import PortManager from '@/views/ComputerManagement/Plugins/Task/Security/NetworkManagement/Tabs/PortManager.vue'

export default {
  props: {
    pluginTask: {
      type: Object,
      description: "Plugin task object",
    },
  },

  created() {
      this.task = { ...this.pluginTask };
  },

   components: {
       DNSManager,
       HostManager,
       NetworkInterfacesManager,
       PortManager
   },

  data() {
      return {
        task: null,
        showTaskDialog: false,
        pluginDescription: this.$t("computer.plugins.network_management.description"),
        pluginUrl:"https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/networkManagement/",
        filters: {},
        dnsMessage: null,
        hostMessage: null,
        networkMessage: null,
        portMessage: null
    };
  },
  
  methods: {
    getNetworkSettings(){
      this.task.commandId = "GET_NETWORK_INFORMATION";
      this.task.parameterMap = {};
      this.showTaskDialog = true;
    },

    networkManagementResponse(message){
        if (message.commandClsId == "GET_NETWORK_INFORMATION") {
          this.dnsMessage = message;
          this.hostMessage = message;
          this.networkMessage = message;
          this.portMessage = message;
        }
        if (message.commandClsId == "ADD_DNS" || message.commandClsId == "ADD_DOMAIN" || 
            message.commandClsId == "DELETE_DNS" || message.commandClsId == "DELETE_DOMAIN") {
            this.dnsMessage = message;
        }
        if (message.commandClsId == "ADD_HOST" || message.commandClsId == "DELETE_HOST") {
            this.hostMessage = message;
        }
        if (message.commandClsId == "ADD_NETWORK" || message.commandClsId == "DELETE_NETWORK") {
            this.networkMessage = message;
        }
        if (message.commandClsId == "ALLOW_PORT" || message.commandClsId == "BLOCK_PORT") {
            this.portMessage = message;
        }
    },

    sendTaskNetworkManagement(parameterMap, commandId){
      this.task.commandId = commandId;
        this.task.parameterMap = parameterMap;
        this.showTaskDialog = true;
    },
  },
  watch: {
    selectedTemplate() {
      if (this.selectedTemplate) {
        this.conkyValidation = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tabview-custom {
  i,
  span {
    vertical-align: middle;
  }
  span {
    margin: 0 0.5rem;
  }
}
</style>
