<template>
  <div>
    <Dialog
      :header="$t('computer.agent_info.node_detail')" 
      :modal="true"
      :style="{ width: '40vw'}"
      v-model:visible="showAgentInfoDialog">
        <TabView style="min-height:50vh;">
          <TabPanel>
            <template #header>
                <i class="pi pi-info-circle"></i>
                <span>
                    &nbsp;{{ $t('group_management.computer_group.node_detail') }}
                </span>
            </template>
            <DataTable :value="selectedNodeData" responsiveLayout="scroll">
                <Column field="label" :header="$t('group_management.computer_group.attribute')"></Column>
                <Column field="value" :header="$t('group_management.computer_group.value')"></Column>
            </DataTable>
          </TabPanel>
          <TabPanel v-if="selectedLiderNode.type == 'AHENK'">
            <template #header>
                <i class="pi pi-users"></i>
                <span>
                    &nbsp;{{ $t('group_management.computer_group.members_of_group') }}
                </span>
            </template>
            <DataTable :value="selectedNodeData" responsiveLayout="scroll">
                <Column field="label" :header="$t('group_management.computer_group.attribute')"></Column>
                <Column field="value" :header="$t('group_management.computer_group.value')"></Column>
            </DataTable>
          </TabPanel>
      </TabView>
      <template #footer>
          <Button 
              :label="$t('group_management.computer_group.close')" 
              icon="pi pi-times"
              @click="showAgentInfoDialog = false" 
              class="p-button-text p-button-sm">
          </Button>
      </template>
    </Dialog>
    <base-plugin
      v-loading="loading" element-loading-text="Veriler alınıyor..."
      element-loading-spinner="fa fa-sync fa-spin"
      element-loading-background="rgba(0, 0, 0, 0.7)"
      :showTaskDialog="showTaskDialog"
      :pluginTask="task"
      @cancel-task="showTaskDialog = false"
    >
      <template #pluginTitle>
        <p v-if="selectedLiderNode">
          <i :class="selectedLiderNode.type == 'AHENK'? 'el el-icon-data-line': 'pi pi-folder-open'"></i>&nbsp; {{selectedLiderNode.name}}
        </p>
        <p v-else><i class="pi pi-folder-open"></i>&nbsp; Agents</p>
      </template>
      <template #pluginTitleButton>
        <div>
          <SplitButton title="Detail" icon="pi pi-list" @click="showAgentInfoDialog = true" :model="items"></SplitButton>
        </div>
      </template>
      <template #default>
      <!-- <ul style="margin-left: -25px"> -->
        <li style="list-style-type: none;">
          <div class="p-grid">
            <div class="p-col-4"><i class="el el-icon-turn-off"></i> {{ $t("computer.agent_info.status") }}</div>
            <div class="p-col-8">
            <Badge v-if="selectedLiderNode && selectedLiderNode.type == 'AHENK'" :value="status" :severity="statusType"></Badge></div>
          </div>
        </li>
        <li style="list-style-type: none;">
          <div class="p-grid">
            <div class="p-col-4"><i class="el el-icon-data-line"></i> {{ $t("computer.agent_info.hostname") }}</div>
            <div class="p-col-8">{{ hostname }}</div>
          </div>
        </li>
        <li style="list-style-type: none;">
          <div class="p-grid">
            <div class="p-col-4"><i class="el el-icon-location-outline"></i> {{ $t("computer.agent_info.location") }}</div>
            <div class="p-col-8">{{ location }}</div>
          </div>
        </li>
        <li style="list-style-type: none;">
          <div class="p-grid">
            <div class="p-col-4" v-if="isUserDomain"><i class="pi pi-sitemap"></i> {{ $t("computer.agent_info.user_domain") }}</div>
            <div class="p-col-8" v-if="isUserDomain">{{ userDirectoryDomain }}</div>
          </div>
        </li>
        <li style="list-style-type: none;">
          <div class="p-grid">
            <div class="p-col-4"><i class="el el-icon-data-analysis"></i> {{ $t("computer.agent_info.operating_system") }}</div>
            <div class="p-col-8">{{ operatingSystem }}</div>
          </div>
        </li>
        <li style="list-style-type: none;">
          <div class="p-grid">
            <div class="p-col-4"><i class="el el-icon-cpu"></i> {{ $t("computer.agent_info.processor") }}</div>
            <div class="p-col-8">{{ processor }}</div>
          </div>
        </li>
        <li style="list-style-type: none;">
          <div class="p-grid">
            <div class="p-col-4"><i class="pi pi-wifi"></i> {{ $t("computer.agent_info.ip_addr") }}</div>
            <div class="p-col-8">{{ ipAddress }}</div>
          </div>
        </li>
        <li style="list-style-type: none;">
          <div class="p-grid">
            <div class="p-col-4"><i class="el el-icon-data-analysis"></i> {{ $t("computer.agent_info.mac") }}</div>
            <div class="p-col-8">{{ macAddresses }}</div>
          </div>
        </li>
        <li style="list-style-type: none;">
          <div class="p-grid">
            <div class="p-col-4"><i class="fa fa-code-branch"></i> {{ $t("computer.agent_info.agent_version") }}</div>
            <div class="p-col-8">{{ agentVersion }}</div>
          </div>
        </li>
        <li style="list-style-type: none;">
          <div class="p-grid">
            <div class="p-col-4"><i class="far fa-user"></i> {{ $t("computer.agent_info.last_logged_user") }}</div>
            <div class="p-col-8">{{ lastLoggedUser }}</div>
          </div>
        </li>
        <li style="list-style-type: none;">
          <div class="p-grid">
            <div class="p-col-4"><i class="pi pi-calendar-times"></i> {{ $t("computer.agent_info.created_date") }}</div>
            <div class="p-col-8">{{ createdDate }}</div>
          </div>
        </li>
      <!-- </ul> -->
      </template>
    </base-plugin>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import {FilterMatchMode} from 'primevue/api';

export default {
  
  props : {
    pluginTask: {
      type: Object,
      description: "Plugin task object",
    }
  },

  data() {
    return {
      showTaskDialog: false,
      task: null,
      loading: false,
      agentCn: "",
      isHostname: true,
      isUserDomain: true,
      statusType: "danger",
      status: this.$t('computer.agent_info.offline'),
      hostname: "",
      location: "",
      userDirectoryDomain: "",
      operatingSystem: "",
      processor: "",
      ipAddress: "",
      macAddresses: "",
      agentVersion: "",
      lastLoggedUser: "",
      createdDate: "",
      agentInfoModal: false,
      showAgentInfoDialog: false,
      selectedNodeSummaryData: [],
      attributesMultiValue: false,
      filters: {},
      items: [
                {
                    label: 'Update',
                    icon: 'pi pi-refresh',
                    command: () => {
                        this.updateAgentInfo()
                    }
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-trash',
                    command: () => {
                        this.$toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
                    }
                },
                {
                    label: 'Move',
                    icon: 'el-icon-rank',
                    command: () => {
                        this.moveAgent()
                    }
                },
            ],
    };
  },

  created() {
    this.task = {...this.pluginTask};

    this.filters = {
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
    }
  },

  computed:mapGetters(["selectedLiderNode"]),

  mounted() {
    if (this.selectedLiderNode != null && this.selectedLiderNode.type == "AHENK") {
        this.getAgentInfo();
      } else {
        this.setDefaultTable();
      }
  },

  watch: {
    selectedLiderNode() {
      if (this.selectedLiderNode != null && this.selectedLiderNode.type == "AHENK") {
        this.getAgentInfo();
      } else {
        this.setDefaultTable();
      }

      this.getSelectedNodeAttribute()
    }
  },

  methods: {
    ...mapActions(["setSelectedAgentInfo"]),

    getAgentInfo() {
      this.loading = true;
      this.agentCn = this.selectedLiderNode.cn;
      this.location = this.getEntryFolderName(this.selectedLiderNode.distinguishedName);
      this.lastLoggedUser = this.selectedLiderNode.o;
      if (this.selectedLiderNode.online) {
        this.statusType = "success";
        this.status = this.$t('computer.agent_info.online');
      }
      
      const params = new URLSearchParams();
      params.append("agentJid", this.selectedLiderNode.uid);
      axios.post("/select_agent_info/detail", params).then((response) => {
        this.setSelectedAgentInfo(response.data);
        this.loading = false;
        if (response.data != "" && response.data != null) {
          var selectedLiderNodeProperties = response.data.properties;
          if (response.data.hostname) {
            this.hostname = response.data.hostname;
          }
          if (response.data.userDirectoryDomain) {
            this.userDirectoryDomain = response.data.userDirectoryDomain;
          }
          if (response.data.createDate) {
            this.createdDate = response.data.createDate;
          }
          
          for (let index = 0; index < selectedLiderNodeProperties.length; index++) {
            let element = selectedLiderNodeProperties[index];
            if (element.propertyName == "agentVersion") {
              if (element.propertValue != "" || element.propertyValue != null) {
                this.agentVersion = element.propertyValue;
              }
            }
            if (element.propertyName == "os.name") {
              if (element.propertValue != "" || element.propertyValue != null) {
                this.operatingSystem = element.propertyValue;
              }
            }
            if (element.propertyName == "processor") {
              if (element.propertValue != "" || element.propertyValue != null) {
                this.processor = element.propertyValue;
              }
            }
            if (element.propertyName == "ipAddresses") {
              if (element.propertValue != "" || element.propertyValue != null) {
                this.ipAddress = element.propertyValue.replace(/\'/g, '');
              }
            }
            if (element.propertyName == "macAddresses") {
              if (element.propertValue != "" || element.propertyValue != null) {
                this.macAddresses = element.propertyValue.replace(/\'/g, '');
              }
            }
          }
        } else {
          this.$toast.add({
            severity:'error', 
            detail: this.$t("computer.agent_info.error_message"), 
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
          });
          this.setDefaultTable();
        }
      });
    },

    setAgentInfo(property, value) {
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index];
        if (element.property == property) {
          element.value = value;
        }
      }
    },

    setDefaultTable() {
      this.agentCn = "";
      this.statusType = "danger";
      this.status = this.$t('computer.agent_info.offline');
      this.hostname = "";
      this.location = this.selectedLiderNode != null ? this.getEntryFolderName(this.selectedLiderNode.distinguishedName): "";
      this.userDirectoryDomain = "";
      this.operatingSystem = "";
      this.processor = "";
      this.ipAddress = "";
      this.macAddresses = "";
      this.agentVersion = "";
      this.lastLoggedUser = "";
      this.createdDate = "";
    },

    getEntryFolderName(selDn) {
      var dnArr = selDn.split(",");
      var ous = ""
      for (let i = 0; i < dnArr.length; i++) {
          var dn = dnArr[i];
          if(dn.startsWith("ou")){
            var arr = dn.split("=");
            if(arr.length > 0){
              if(arr[1] != 'Ahenkler'){
                ous += arr[1]
                if(i < dnArr.length){
                  ous +=" "
                }
              }
            }
          }
        }
      return ous;
    },

    updateAgentInfo() {
      alert("will be update agent info")
      // this.loading = true;
      this.showTaskDialog = true;
      setTimeout(() => this.loading = false, 5000);
    },

    deleteAgent() {
      alert("will be delete agent")
    },

    moveAgent(){
      alert("will be move agent")
    },

    showAgentInfoModal(show) {
      if (show) {
        this.agentInfoModal = true;
      } else {
        this.agentInfoModal = false;
      }
    },

    getSelectedNodeAttribute() {
      let nodeData = [];
      let nodeSummaryData = [];
      
      nodeSummaryData.push({
          'label': this.$t('group_management.computer_group.name'),
          'value': this.selectedLiderNode.name,
          },
          {
              'label': this.$t('group_management.computer_group.type'),
              'value': this.selectedLiderNode.type,
          });
      if (this.selectedLiderNode.type == "GROUP") {
            nodeSummaryData.push({
                'label': this.$t('group_management.computer_group.number_of_member'),
              'value': this.members.length
            });
      }
      nodeData.push({
          'label': this.$t('group_management.computer_group.name'),
          'value': this.selectedLiderNode.name,
          }, 
          {
              'label': this.$t('group_management.computer_group.node_dn'),
              'value': this.selectedLiderNode.distinguishedName,
          },
          {
              'label': this.$t('group_management.computer_group.type'),
              'value': this.selectedLiderNode.type,
          },
          {
              'label': this.$t('group_management.computer_group.created_date'),
              'value': this.selectedLiderNode.createDateStr,
          },

          {
              'label': this.$t('group_management.computer_group.modified_date'),
              'value': this.selectedLiderNode.attributes.modifyTimestamp,
          },
          {
              'label': this.$t('group_management.computer_group.creator_name'),
              'value': this.selectedLiderNode.attributes.creatorsName,
          },
          {
              'label': this.$t('group_management.computer_group.modifier_name'),
              'value': this.selectedLiderNode.attributes.modifiersName,
          });
      this.selectedLiderNode.attributesMultiValues.objectClass.map(oclas => {
          nodeData.push({
              'label': this.$t('group_management.computer_group.objectclass'),
              'value' : oclas
          })
      });
      this.selectedNodeData = nodeData;
      this.selectedNodeSummaryData = nodeSummaryData;
    }
  },
};
</script>

<style scoped>
.dashboard .task-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
</style>
