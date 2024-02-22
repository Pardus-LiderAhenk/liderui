<template>
<!-- Dialogs Start -->
  <add-group-dialog v-if="addGroupDialog"
    :filter="filter"
    :addGroupDialog="addGroupDialog" 
    @close-group-dialog="addGroupDialog=false;">
  </add-group-dialog>
  <add-to-exist-group-dialog v-if="addExistGroupDialog"
    :filter="filter"
    :addExistGroupDialog="addExistGroupDialog" 
    @close-group-dialog="addExistGroupDialog=false;">
  </add-to-exist-group-dialog>
  <agent-detail-dialog v-if="agentDetailDialog"
    :agentDetailDialog="agentDetailDialog"
    :selectedAgent="selectedAgent"
    @close-agent-detail-dialog="agentDetailDialog=false;">
  </agent-detail-dialog>
  <Dialog :header="$t('reports.detailed_agent_report.select_folder')"
    v-model:visible="agentOuDialog" 
    :style="{width: '30vw'}" :modal="true"
  >
    <tree-component 
      ref="agentTree"
      loadNodeUrl="/api/lider/computer/computers"
      loadNodeOuUrl="/api/lider/computer/ou-details"
      :treeNodeClick="node => filter.dn = node.distinguishedName"
      :searchFields="[{key: this.$t('tree.folder'), value: 'ou'}]"
      :isMove="true"
      :scrollHeight="40"
    />
    <template #footer>
      <Button :label="$t('reports.detailed_agent_report.cancel')"
        icon="pi pi-times" @click="agentOuDialog = false"
        class="p-button-text p-button-sm"
      />
      <Button :label="$t('reports.detailed_agent_report.select')" icon="pi pi-check" 
          @click="selectAgentOuDn" class="p-button-sm"
      />
    </template>
  </Dialog>
  <!-- Dialogs End -->
  <Panel :toggleable="true" class="p-m-3">
    <template #header>
      <h4 class="p-pt-2">{{$t('reports.detailed_agent_report.detailed_agent_report')}}</h4>
    </template>
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputComputerName">{{$t('reports.detailed_agent_report.computer_name')}}</label>
        <InputText
          id="inputComputerName"
          type="text"
          v-model="filter.hostname"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputIPAdress">{{$t('reports.detailed_agent_report.ip_address')}}</label>
        <InputText id="inputIPAdress" type="text" v-model="filter.ipAddress" />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputMacAddress">{{$t('reports.detailed_agent_report.mac_address')}}</label>
        <InputText
          id="inputMacAddress"
          type="text"
          v-model="filter.macAddress"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputDN">{{$t('reports.detailed_agent_report.dn')}}</label>
         <div class="p-inputgroup ">
            <InputText id="inputDN" type="text" v-model="filter.dn" />
            <Button icon="pi pi-sitemap" class="p-button-warning" 
                @click="agentOuDialog = true"
            />
        </div>
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputRegistrationDate">{{$t('reports.detailed_agent_report.create_date')}}</label>
        <Calendar
          v-model="filter.registrationDate"
          selectionMode="range"
          :showButtonBar="true"
          :numberOfMonths="2"
          dateFormat="dd/mm/yy"
          :showIcon="true"
          :hideOnDateTimeSelect="true"
          :manualInput="false"
          @clear-click="clearCalendar"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputStatus">{{$t('reports.detailed_agent_report.status')}}</label>
        <Dropdown
          v-model="filter.status"
          :options="statuses"
          optionLabel="name"
          optionValue="value"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectBrand">{{$t('reports.detailed_agent_report.brand')}}</label>
        <Dropdown
          id="selectBrand"
          v-model="filter.brand"
          :options="brands"
          :placeholder="$t('reports.detailed_agent_report.select')"
          showClear="true"
          @change="clearEvent($event, 'brand')"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectModel">{{$t('reports.detailed_agent_report.model')}}</label>
        <Dropdown
          id="selectModel"
          v-model="filter.model"
          :options="models"
          :placeholder="$t('reports.detailed_agent_report.select')"
          showClear="true"
          @change="clearEvent($event, 'model')"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectProcessor">{{$t('reports.detailed_agent_report.processor')}}</label>
        <Dropdown
          id="selectProcessor"
          v-model="filter.processor"
          :options="processors"
          :placeholder="$t('reports.detailed_agent_report.select')"
          showClear="true"
          @change="clearEvent($event, 'processor')"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectOSVersion">{{$t('reports.detailed_agent_report.operating_system_version')}}</label>
        <Dropdown
          id="selectOSVersion"
          v-model="filter.osVersion"
          :options="osVersions"
          :placeholder="$t('reports.detailed_agent_report.select')"
          showClear="true"
          @change="clearEvent($event, 'osVersion')"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectAgentVersion">{{$t('reports.detailed_agent_report.ahenk_version')}}</label>
        <Dropdown
          id="selectAgentVersion"
          v-model="filter.agentVersion"
          :options="agentVersions"
          :placeholder="$t('reports.detailed_agent_report.all')"
          :showClear="true"
          @change="clearEvent($event, 'agentVersion')"
        />
      </div>
      <!-- <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="selectSessionVersion">{{$t('reports.detailed_agent_report.session')}}</label>
        <Dropdown
          id="selectSessionVersion"
          v-model="filter.sessionReportType"
          :options="sessionReportTypes" 
          optionLabel="name" 
          optionValue="value"
          :placeholder="$t('reports.detailed_agent_report.all')"
          showClear="true"
          @change="clearEvent($event, 'sessionReportType')"
        />
      </div> -->
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="">{{$t('reports.detailed_agent_report.disk_type')}}</label>
        <Dropdown
          v-model="filter.diskType"
          :options="diskTypes"
          optionLabel="name"
          optionValue="value"
          :placeholder="$t('reports.detailed_agent_report.all')"
          showClear="true"
          @change="clearEvent($event, 'diskType')"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="">{{$t('reports.detailed_agent_report.client_status')}}</label>
        <Dropdown
          v-model="filter.agentStatus"
          :options="agentStatuses"
          optionLabel="name"
          optionValue="value"
          :placeholder="$t('reports.detailed_agent_report.all')"

        />
      </div>
      <div class="p-field p-col-12 p-text-right">
        <div class="p-d-flex p-jc-end">
          <div>
            <Button
              :label="$t('reports.detailed_agent_report.clear')"
              icon="fas fa-backspace"
              @click="clearFilterFields"
            />
          </div>
          <div class="p-ml-2">
            <Button
              :label="$t('reports.detailed_agent_report.search')"
              icon="fas fa-search" 
              @click="filterAgents" 
              />
          </div>
        </div>
      </div>
    </div>
  </Panel>
  <Card class="p-m-3 p-mb-7">
    <template #title>
      <div class="p-d-flex p-jc-between">
        <div>{{$t('reports.detailed_agent_report.results')}}</div>
        <div  v-if="agents.length > 0">
          <SplitButton class="p-mr-2"
             :label="$t('reports.detailed_agent_report.create_computer_group')" icon="fa fa-users"
            @click="addGroupDialog=true;" :model="items">
          </SplitButton>
          <Button
            :label="$t('reports.detailed_agent_report.export')"
            icon="fas fa-file-excel"
            @click="exportToExcel()"
          />
        </div>
      </div>
    </template>
    <template #content>
      <DataTable :value="agents" responsiveLayout="scroll" dataKey="id" :loading="loading">
        <template #empty>
          <div class="p-d-flex p-jc-center">
            <span>{{$t('reports.detailed_agent_report.agent_not_found')}}</span>
          </div>
        </template>
        <template #loading>
          <div class="p-d-flex p-jc-center">
            <span>{{$t('reports.detailed_agent_report.loading')}}...</span>
          </div>
        </template>
        <Column header="#">
          <template #body="{index}">
            <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
          </template>
        </Column>
        <Column field="hostname" :header="$t('reports.detailed_agent_report.computer_name')"></Column>
        <Column :header="$t('reports.detailed_agent_report.mac_address')">
          <template #body="{ data }">
            {{ data.macAddresses.replace(/'/g, "") }}
          </template>
        </Column>
        <Column :header="$t('reports.detailed_agent_report.ip_address')">
          <template #body="{ data }">
            {{ data.ipAddresses.replace(/'/g, "") }}
          </template>
        </Column>
        <Column field="isOnline" :header="$t('reports.detailed_agent_report.status')">
          <template #body="{ data }">
            <Badge
              v-if="data.isOnline"
              :value="$t('reports.detailed_agent_report.online')"
              severity="success"
            ></Badge>
            <Badge v-else 
            :value="$t('reports.detailed_agent_report.offline')" 
            severity="danger"
            ></Badge>
          </template>
        </Column>
        <Column :header="$t('reports.detailed_agent_report.brand')">
          <template #body="{ data }">
            {{
              getPropertyValue(
                data.properties,
                "hardware.baseboard.manufacturer"
              )
            }}
          </template>
        </Column>
        <Column :header="$t('reports.detailed_agent_report.operating_system')">
          <template #body="{ data }">
            {{ getPropertyValue(data.properties, "os.distributionName") }}
          </template>
        </Column>
        <Column :header="$t('reports.detailed_agent_report.operating_system_version')">
          <template #body="{ data }">
            {{ getPropertyValue(data.properties, "os.version") }}
          </template>
        </Column>
        <Column field="createDate" :header="$t('reports.detailed_agent_report.create_date')"></Column>
        <Column>
          <template #body="{ data }">
            <div class="p-d-flex p-jc-end">
              <div>
                <Button
                  class="p-button-sm p-button-raised p-button-rounded"
                  icon="pi pi-list"
                  v-tooltip.left="$t('reports.detailed_agent_report.agent_detail')"
                  @click="showAgentDetailDialog(data.id)"
                />
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
      <Paginator
        ref="paging"
        :first="offset"
        :rows="10"
        :totalRecords="totalElements"
        :rowsPerPageOptions="[10, 25, 50, 100]"
        @page="onPage($event)"
      >
        <template> Toplam Sonuç: {{ totalElements }} </template>
      </Paginator>
    </template>
  </Card>
</template>

<script>
/**
 * Detailed Agent Report.
 * @see {@link http://www.liderahenk.org/}
 */
import moment from "moment";
import AddGroupDialog from './Dialogs/AddGroupDialog.vue'
import AddToExistGroupDialog from './Dialogs/AddToExistGroupDialog.vue'
import AgentDetailDialog from './Dialogs/AgentDetailDialog.vue'
import { agentInfoReportService } from "../../../services/Reports/AgentInfoReportService.js";

export default {
  data() {
    return {
      agents: [],
      totalElements: 0,
      showedTotalElementCount: 10,
      currentPage: 1,
      offset: 1,
      pageNumber: 1,
      rowNumber: 10,
      loading: false,
      brands: [],
      models: [],
      processors: [],
      osVersions: [],
      dataTpe:[],
      agentVersions: [],
      diskTypes: [
        {
          name: this.$t('reports.detailed_agent_report.all'),
          value: ""
          },
        {
          name: this.$t('reports.detailed_agent_report.hdd_title'),
          value: "hardware.disk.hdd.info"
          },
        {
          name: this.$t('reports.detailed_agent_report.ssd_title'),
          value: "hardware.disk.ssd.info",
        }
        
      ],
      sessionReportTypes: [
        {
          name: this.$t('reports.detailed_agent_report.not_logged_one_mounth'),
          value: "LAST_ONE_MONTH_NO_SESSIONS",
        },
        {
          name: this.$t('reports.detailed_agent_report.not_logged_two_mounth'),
          value: "LAST_TWO_MONTHS_NO_SESSIONS",
        },
        {
          name: this.$t('reports.detailed_agent_report.not_logged_three_mounth'),
          value: "LAST_THREE_MONTHS_NO_SESSIONS",
        },
        {
          name: this.$t('reports.detailed_agent_report.logged_one_mounth'),
          value: "LAST_ONE_MONTH_SESSIONS",
        },
        {
          name: this.$t('reports.detailed_agent_report.logged_two_mounth'),
          value: "LAST_TWO_MONTHS_SESSIONS",
        },
        {
          name: this.$t('reports.detailed_agent_report.logged_three_mounth'),
          value: "LAST_THREE_MONTHS_SESSIONS",
        },
      ],
      getFilterData: true,
      selectedAgent: null,
      statuses: [
        {
          name: this.$t('reports.detailed_agent_report.all'),
          value: "ALL",
        },
        {
          name: this.$t('reports.detailed_agent_report.online'),
          value: "ONLINE",
        },
        {
          name: this.$t('reports.detailed_agent_report.offline'),
          value: "OFFLINE",
        },
      ],
      agentStatuses: [
        {
          name: this.$t('reports.detailed_agent_report.all'),
          value:"",
        },
        {
          name: this.$t('reports.detailed_agent_report.active'),
          value: 1,
        },
        {
          name: this.$t('reports.detailed_agent_report.passive'),
          value: 0,
        },
      ],
      filter: {
        dn: "",
        hostname: "",
        ipAddress: "",
        macAddress: "",
        registrationDate: "",
        registrationStartDate: "",
        registrationEndDate: "",
        status: "ALL",
        brand: "",
        model: "",
        processor: "",
        osVersion: "",
        agentVersion: "",
        diskType:"ALL",
        sessionReportType: "",
        agentStatus: "",
      },
      items: [
        {
          label: this.$t('reports.detailed_agent_report.add_existing_group'),
          icon: 'pi pi-plus',
          command: () => {
              this.addExistGroupDialog = true;
          }
        },
      ],
      addGroupDialog: false,
      addExistGroupDialog: false,
      agentDetailDialog: false,
      filterData: null,
      agentOuDialog: false,
    };
  },

  components: {
    AddGroupDialog,
    AddToExistGroupDialog,
    AgentDetailDialog
  },

  mounted() {
    this.getAgents();
  },

  methods: {
    selectAgentOuDn() {
      if (!this.filter.dn.trim()) {
        this.$toast.add({
            severity:'warn', 
            detail: this.$t('reports.detailed_agent_report.please_select_folder'),
            summary:this.$t("computer.task.toast_summary"), 
            life: 3000
        });
        return;
      }
      this.agentOuDialog = false;
    },

    showAgentDetailDialog(agentID) {
      this.selectedAgent = this.agents.filter(
        (agent) => agent.id === agentID
      )[0];
      this.agentDetailDialog = true;
    },
    getPropertyValue(properties, propertyName) {
      var propertyValue = "";
      const filteredProperties = properties.filter(
        (property) => property.propertyName === propertyName
      );
      if (filteredProperties != null && filteredProperties.length > 0) {
        propertyValue = filteredProperties[0].propertyValue;
  
      }
      return propertyValue;
    },
    async getAgents() {
      this.loading = true;
      this.currentPage = this.pageNumber;
      var data = new FormData();
      data.append("pageNumber", this.pageNumber);
      data.append("pageSize", this.rowNumber);
      data.append("status", this.filter.status);
      data.append("dn", this.filter.dn);
      data.append("hostname", this.filter.hostname);
      data.append("ipAddress", this.filter.ipAddress);
      data.append("macAddress", this.filter.macAddress);
      // data.append("registrationStartDate", this.filter.registrationStartDate);
      // data.append("registrationEndDate", this.filter.registrationEndDate);
      data.append("brand", this.filter.brand);
      data.append("model", this.filter.model);
      data.append("processor", this.filter.processor);
      data.append("osVersion", this.filter.osVersion);
      data.append("diskType",this.filter.diskType);
      data.append("agentVersion", this.filter.agentVersion);
      data.append("sessionReportType", this.filter.sessionReportType);
      data.append("agentStatus",this.filter.agentStatus);
      if (this.pageNumber == 1) {
        data.append("getFilterData", true);
      }
      if (this.filter.registrationDate && this.filter.registrationDate[0] != null) {
        data.append(
          "registrationStartDate",
          moment(this.filter.registrationDate[0])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }
      if (this.filter.registrationDate && this.filter.registrationDate[1] != null) {
        data.append(
          "registrationEndDate",
          moment(this.filter.registrationDate[1])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }

      const { response, error } = await agentInfoReportService.agentInfoList(data);
      if (error){
            this.$toast.add({
            severity:'error',
            detail: this.$t('reports.task_report.agent_info_report_error'),
            summary:this.$t("computer.task.toast_summary"),
            life:3600
          });
      } else{
        if (response.status == 200) {
          if (this.pageNumber == 1) {
            this.brands = response.data.brands;
            this.models = response.data.models;
            this.processors = response.data.processors;
            this.agentVersions = response.data.agentVersions;
            this.osVersions = response.data.osVersions;
            this.totalElements = response.data.agents.totalElements;
          }
          this.agents = response.data.agents.content;
        } else if (response.status == 417) {
          this.$toast.add({
            severity:'error',
            detail: this.$t('reports.task_report.error_417_agent_info_list'),
            summary:this.$t("computer.task.toast_summary"),
            life:3600
          });
        }
      }

      this.loading = false;
      
    },

    clearCalendar() {
      this.filter.registrationStartDate = "";
      this.filter.registrationEndDate = "";
      this.filter.registrationDate = "";
    },


    clearEvent(event, name){
      if (!event.value) {
        this.filter[name] = "";
      }
    },
    
    currentPageChange(newCurrentPage) {
      this.loading = true;
      this.getAgents(newCurrentPage);
    },
    onPage(event) {
      this.loading = true;
      this.pageNumber = event.page + 1;
      this.rowNumber = event.rows;
      this.getAgents();
    },
    filterAgents() {
      if (this.filter.registrationDate && this.filter.registrationDate[0] != null) {
        this.filter.registrationStartDate = moment(
          this.filter.registrationDate[0]
        )
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .format("DD/MM/YYYY HH:mm:ss");
      }
      if (this.filter.registrationDate && this.filter.registrationDate[1] != null) {
        this.filter.registrationEndDate = moment(
          this.filter.registrationDate[1]
        )
          .set("hour", 23)
          .set("minute", 59)
          .set("second", 59)
          .format("DD/MM/YYYY HH:mm:ss");
      }
      this.offset = 0;
      this.$refs.paging.$emit('page', {
        page: 0,
        rows: 10,
        first: 0,
      });
      this.getAgents(this.currentPage, this.showedTotalElementCount);
    },
    async exportToExcel() {
      this.loading = true;
      var data = new FormData();
      data.append("status", this.filter.status);
      data.append("dn", this.filter.dn);
      data.append("hostname", this.filter.hostname);
      data.append("ipAddress", this.filter.ipAddress);
      data.append("macAddress", this.filter.macAddress);
      ///data.append("registrationStartDate", this.filter.registrationStartDate);
      //data.append("registrationEndDate", this.filter.registrationEndDate);
      data.append("brand", this.filter.brand);
      data.append("model", this.filter.model);
      data.append("processor", this.filter.processor);
      data.append("osVersion", this.filter.osVersion);
      data.append("diskType",this.filter.diskType);
      data.append("agentVersion", this.filter.agentVersion);
      data.append("sessionReportType", this.filter.sessionReportType);
      data.append("agentStatus",this.filter.agentStatus);
      if (this.filter.registrationDate && this.filter.registrationDate[0] != null) {
        data.append(
          "registrationStartDate",
          moment(this.filter.registrationDate[0])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }
      if (this.filter.registrationDate && this.filter.registrationDate[1] != null) {
        data.append(
          "registrationEndDate",
          moment(this.filter.registrationDate[1])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }
      const { response, error } = await agentInfoReportService.agentInfoExport(data)
      if (error){
            this.$toast.add({
            severity:'error',
            detail:this.$t('reports.task_report.agent_info_report_export_error'),
            summary:this.$t("computer.toast_summary"),
            life:3600
          });

      }else{
        if(response.status == 200){
          let blob = new Blob([response.data])
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "Agent Report.xlsx";
          this.loading = false;
          link.click();
        }
        else if(response.status == 400)
        this.$toast.add({
            severity:'error',
            detail:this.$t('reports.task_report.error_400_agent_info_report'),
            summary:this.$t("computer.toast_summary"),
            life:3600
          });      
        }
    },

    clearFilterFields() {
      this.filter = {
        dn: "",
        hostname: "",
        ipAddress: "",
        macAddress: "",
        registrationDate: "",
        registrationStartDate: "",
        registrationEndDate: "",
        status: "ALL",
        brand: "",
        model: "",
        processor: "",
        osVersion: "",
        agentVersion: "",
        diskType:"ALL",
        sessionReportType: "",
        agentStatus:"",
        
      };
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-component {
        margin-left: auto;
    }
}
</style>
