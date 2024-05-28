<template>
  <Panel :toggleable="true" class="p-m-3">
    <template #header>
      <h4 class="p-pt-2">{{$t('reports.system_log_report.system_log')}}</h4>
    </template>
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
        <label for="inputRegistrationDate">{{$t('reports.system_log_report.logs_date')}}</label>
        <Calendar
          v-model="filter.logCreateDate"
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
        <label for="inputStatus">{{$t('reports.system_log_report.logs_type')}}</label>
        <Dropdown
          v-model="filter.operationType"
          :options="operationTypes"
          optionLabel="text"
          optionValue="value"
          :filter="true" 
          :showClear="true" 
          :placeholder="$t('reports.system_log_report.select')"
          @change="clearOpType"
        />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
          <label>{{$t('reports.system_log_report.ip_address')}}</label>
          <InputText :placeholder="$t('reports.system_log_report.ip_address')" v-model="filter.requestIp" />
      </div>
      <div class="p-field p-col-12 p-lg-3 p-md-6 p-sm-12">
          <label>{{$t('reports.system_log_report.username')}}</label>
          <div class="p-inputgroup">
            <InputText :placeholder="$t('reports.system_log_report.username')" v-model="filter.userId" />
            <Button icon="pi pi-sitemap" class="p-button-primary" @click="searchTextDialog = true"/>
          </div>
      </div>
    </div>
    <div class="p-d-flex p-jc-end">
      <div>
        <Button
        :label="$t('reports.system_log_report.clear')"
          icon="fas fa-backspace"
          @click="clearFilterFields"
        />
      </div>
      <div class="p-ml-2">
        <Button 
        :label="$t('reports.system_log_report.search')"
        icon="fas fa-search" 
        @click="filterAgents" />
      </div>
    </div>
  </Panel>
  <Card class="p-m-3 p-mb-7">
    <template #title>
      <div class="p-d-flex p-jc-between">
        <div>{{$t('reports.system_log_report.results')}}</div>
        <div>
          <Button
            :label="$t('reports.system_log_report.export')"
            icon="fas fa-file-excel"
            @click="exportToExcel()"
          />
        </div>
      </div>
    </template>
    <template #content>
      <DataTable :value="logs" responsiveLayout="scroll" dataKey="id" :loading="loading">
        <template #empty>
          {{$t('reports.system_log_report.task_cant_find')}}...
        </template>
        <template #loading>
           {{$t('reports.system_log_report.loading')}}...
        </template>
        <Column header="#">
          <template #body="{index}">
            <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
          </template>
        </Column>
        <Column :header="$t('reports.system_log_report.logs_type')">
          <template #body="{ data }">
              {{ getOpetarionType(data.crudType)}}
          </template>
        </Column>
        <Column field="createDate" :header="$t('reports.system_log_report.create_date')"></Column>
        <Column field="logMessage" :header="$t('reports.system_log_report.message')"></Column>
        <Column field="userId" :header="$t('reports.system_log_report.username')"></Column>
        <Column field="requestIp" :header="$t('reports.system_log_report.ip_address')"></Column>
        <Column>
          <template #body="{ data }">
            <div class="p-d-flex p-jc-end">
              <div>
                <Button
                  class="p-button-sm p-button-raised p-button-rounded"
                  icon="pi pi-list"
                  v-tooltip.left="$t('reports.system_log_report.log_details')"
                  @click="showLogDetailDialog(data.id)"
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
        <template> {{$t('reports.system_log_report.total_result')}} : {{ totalElements }} </template>
      </Paginator>
    </template>
  </Card>

  <Dialog
    v-model:visible="logDetailDialog"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3> {{$t('reports.system_log_report.selected_system_log_detail')}}</h3>
    </template>

    <div class="p-grid">
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b> {{$t('reports.system_log_report.log_id')}}</b></div>
      <div class="p-col-8">
        {{ selectedLog.id }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b> {{$t('reports.system_log_report.logs_type')}}</b></div>
      <div class="p-col-8">
        {{ getOpetarionType(selectedLog.crudType) }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b> {{$t('reports.system_log_report.create_date')}}</b></div>
      <div class="p-col-8">
        {{ selectedLog.createDate }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b> {{$t('reports.system_log_report.message')}}</b></div>
      <div class="p-col-8">
        {{ selectedLog.logMessage }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b> {{$t('reports.system_log_report.username')}}</b></div>
      <div class="p-col-8">
        {{ selectedLog.userId }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
      <div class="p-col-4"><b> {{$t('reports.system_log_report.ip_address')}}</b></div>
      <div class="p-col-8">
        {{ selectedLog.requestIp }}
      </div>
      <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
    </div>

     <template #footer>
      <Button
        :label="$t('reports.system_log_report.close')"
        icon="pi pi-times"
        class="p-button-text"
        @click="logDetailDialog = false"
      />
    </template>
  </Dialog>

  <Dialog :header="$t('reports.system_log_report.select_user_group')" v-model:visible="searchTextDialog" :style="{width: '50vw'}" :modal="true">
        <tree-component 
            ref="usertree"
            loadNodeUrl="/api/lider/user/users"
            loadNodeOuUrl="/api/lider/user/ou-details"
            :treeNodeClick="treeNodeClick"
        />
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="searchTextDialog = false" class="p-button-text"/>
            <Button label="Oluştur" icon="pi pi-check" @click="selectsearchText" autofocus />
        </template>
    </Dialog>
</template>

<script>
import moment from "moment";
import { systemTaskReportService } from "../../services/Reports/SystemLogReportService.js";

export default {
  data() {
    return {
      logs: [],
      totalElements: 0,
      showedTotalElementCount: 10,
      currentPage: 1,
      offset: 1,
      loading: false,
      getFilterData: true,
      logDetailDialog: false,
      selectedLog: null,
      searchTextDialog:false,
      operationTypesResponse:[],
      operationTypes:[],
      filterTextType: [
            {value: 'userId', text:this.$t('reports.system_log_report.username')},
            {value: 'requestIp', text:this.$t('reports.system_log_report.ip_address')}
      ],
      filter: {
          logCreateDate: "",
          logCreateStartDate: "",
          logCreateEndDate: "",
          operationType: "ALL",
          userId: "",
          requestIp: "",
          searchText: ""
      },
      selectedNode: null,
      pageNumber: 1,
      rowNumber: 10,
    };
  },
  mounted() {
    this.getLogs();
    this.getOperationTypes();
  },
  methods: {
    treeNodeClick(node){
      this.selectedNode = node;
    },
    selectsearchText() {
      if(this.selectedNode) {
        this.filter.userId = this.selectedNode.distinguishedName;
        this.searchTextDialog = false;
        this.selectedNode = null;
      }
    },
    showLogDetailDialog(logId) {
      this.selectedLog = this.logs.filter(
        (log) => log.id === logId
      )[0];
      this.logDetailDialog = true;
    },
    async getLogs() {
      this.loading = true;
      this.currentPage = this.pageNumber;
      var data = new FormData();
      data.append("pageNumber", this.pageNumber);
      data.append("pageSize", this.rowNumber);
      data.append('operationType',this.filter.operationType);
      data.append('userId',this.filter.userId);
      data.append('requestIp',this.filter.requestIp);
  
      if (this.filter.logCreateDate && this.filter.logCreateDate[0] != null) {
        data.append(
          "startDate",
          moment(this.filter.logCreateDate[0])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }
      
      if (this.filter.logCreateDate && this.filter.logCreateDate[1] != null) {
        data.append(
          "endDate",
          moment(this.filter.logCreateDate[1])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }
      
      const { response, error } = await systemTaskReportService.operationLogsList(data)
      if(error){
          this.$toast.add({
            severity:'error',
            detail:this.$t('reports.task_report.error_get_operation_log_list'),
            summary:this.$t("computer.task.toast_summary"),
            life:3600
          });
      }else{
        if( response.status == 200){
        this.logs = response.data.content;
        this.totalElements = response.data.totalElements;
        this.loading = false;
        }
        else if(response.status == 417){
          this.$toast.add({
            severity:'error',
            detail:this.$t('reports.task_report.error_417_operation_log'),
            summary:this.$t("computer.task.toast_summary"),
            life:3600
          });
        }
      }
      
    },
    currentPageChange(newCurrentPage) {
      this.loading = true;
      this.getLogs(newCurrentPage);
    },
    onPage(event) {
      this.loading = true;
      this.pageNumber = event.page + 1;
      this.rowNumber = event.rows;
      this.getLogs();
    },
    filterAgents() {
      this.offset = 0;
      this.$refs.paging.$emit('page', {
        page: 0,
        rows: 10,
        first: 0,
      });
      this.getLogs(this.currentPage, this.showedTotalElementCount);
    },
    async exportToExcel() {
      this.loading = true;
      var data = new FormData();
      data.append('operationType',this.filter.operationType);
      data.append('userId',this.filter.userId);
      data.append('requestIp',this.filter.requestIp);
      if(this.filter.searchText != null) {
        data.append("searchText", this.filter.searchText);
      }
     
      if (this.filter.logCreateDate && this.filter.logCreateDate[0] != null) {
        data.append(
          "startDate",
          moment(this.filter.logCreateDate[0])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }
      
      if (this.filter.logCreateDate && this.filter.logCreateDate[1] != null) {
        data.append(
          "endDate",
          moment(this.filter.logCreateDate[1])
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .format("DD/MM/YYYY HH:mm:ss")
        );
      }
      const { response, error } = await systemTaskReportService.operationExport(data)
      if(error){
            this.$toast.add({
            severity:'error',
            detail:this.$t('reports.task_report.error_operation_log_export'),
            summary:this.$t("computer.toast_summary"),
            life:3600
          });
      }else{
        if( response.status == 200){
          let blob = new Blob([response.data]);
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "Logs_Report.xlsx";
          this.loading = false;
          link.click();
        }
        else if(response.status == 400){
          this.$toast.add({
            severity:'error',
            detail:this.$t('reports.task_report.error_400_operation_export_report'),
            summary:this.$t("computer.task.toast_summary"),
            life:3600
          });
        }
      }            
    },

    clearCalendar() {
      this.filter.logCreateDate = "";
      this.filter.logCreateStartDate = "";
      this.filter.logCreateEndDate = "";
    },

    clearOpType(event) {
      if (!event.value) {
        this.filter.operationType = "ALL";
      }
    },

    clearFilterFields() {
      this.filter = {
          logCreateDate: '',
          logCreateStartDate:'',
          logCreateEndDate:'',
          operationType:'ALL',
          searchText:null,
          userId: "",
          requestIp: ""
      };
    },

    async getOperationTypes(){

      const { response, error } = await systemTaskReportService.operationTypes()
      if(error){
            this.$toast.add({
            severity:'error',
            detail:this.$t('reports.task_report.error_operation_log_types'),
            summary:this.$t("computer.toast_summary"),
            life:3600
          });
      }else{
          this.operationTypesResponse = response.data;
          this.operationTypes = this.operationTypesResponse.map((otype, index) => {
              return {
                text: this.getOpetarionType(otype),
                value: index + 1
              }
            });
      }                      
    },

    getOpetarionType(type) {
      var typeText = type;
      if (type == "CREATE") {
        typeText = this.$t('reports.system_log_report.create');
      } else if (type == "READ") {
        typeText = this.$t('reports.system_log_report.read');
      } else if (type == "UPDATE") {
        typeText = this.$t('reports.system_log_report.update');
      } else if (type == "DELETE") {
        typeText = this.$t('reports.system_log_report.delete');
      } else if (type == "LOGIN") {
        typeText = this.$t('reports.system_log_report.login');
      } else if (type == "LOGOUT") {
        typeText = this.$t('reports.system_log_report.logout');
      } else if (type == "EXECUTE_TASK") {
        typeText = this.$t('reports.system_log_report.execute_task');
      } else if (type == "EXECUTE_POLICY") {
        typeText = this.$t('reports.system_log_report.execute_policy');
      } else if (type == "CHANGE_PASSWORD") {
        typeText = this.$t('reports.system_log_report.change_password');
      } else if (type == "MOVE") {
        typeText =this.$t('reports.system_log_report.move');
      } else if (type == "UNASSIGMENT_POLICY") {
        typeText = this.$t('reports.system_log_report.cancel_policy');
      }else if (type == "CANCEL_SCHEDULED_TASK") {
        typeText = this.$t('reports.system_log_report.scheduled_task_cancel');
      }else if (type == "UPDATE_SCHEDULED_TASK") {
        typeText = this.$t('reports.system_log_report.scheduled_task_update');
      }
      return typeText;
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
