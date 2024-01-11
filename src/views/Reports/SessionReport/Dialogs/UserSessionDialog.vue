<template>
  <div>
    <Dialog
        v-model:visible="showDialog"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
        :style="{ width: '70vw' }" :modal="true"
        :header="$t('reports.session_report.agent_session_information')">
        <div>
            <DataTable :value="sessions" responsiveLayout="scroll" :loading="loading"
                style="margin-top: 2em"  class="p-datatable-sm" v-model:filters="filters">
                <template #header>
                  <div class="p-d-flex p-jc-between">
                      <div style="text-align: left">
                        <Button class="p-button-sm" 
                        :label="$t('reports.session_report.export')"
                        icon="fas fa-file-excel"
                        @click="exportToExcel()"/>
                      </div>
                      <div class="p-d-flex p-jc-end">
                        <Dropdown v-model="sessionFilter.status" style="min-width: 100%;" 
                          :options="statuses"
                          optionLabel="name" 
                          optionValue="value"
                          @change="onChange"
                        />
                      </div>
                  </div>
                </template>

                <template #empty>
                  <div class="p-d-flex p-jc-center">
                    {{$t('reports.session_report.session_cant_find')}}
                  </div>
                </template>
                <template #loading>
                    {{$t('reports.session_report.loading')}}
                </template>
                <Column header="#">
                <template #body="{index}">
                  <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
                </template>
                </Column>
                 <Column field="username" :header="$t('reports.session_report.username')">
                 
                </Column>
                <Column field="sessionEvent" :header="$t('reports.session_report.session_type')">
                  <template #body="{ data}">
                    <span v-if="data.sessionEvent == 1">
                      {{ $t('reports.session_report.login') }}
                    </span>
                    <span v-if="data.sessionEvent == 2">
                      {{ $t('reports.session_report.logout') }}
                    </span>
                </template>
                </Column>
                <Column field="createDate" :header="$t('reports.session_report.session_date')">
                  <template #body="{ data }">
                    {{ formatDate(data.createDate) }}
                  </template>
                </Column>
                <Column :header="$t('reports.session_report.computer_name')">
                <template #body="{ data }">
                    {{ data.hostname }}
                </template>
                </Column>
                <Column field="macAddresses" :header="$t('reports.session_report.mac_address')">
                <template #body="{ data }">
                    {{ data.macAddresses.replace(/'/g, " ")  }}
                </template>
                </Column>
                <Column field="ipAddresses" :header="$t('reports.session_report.ip_address')">
                  <template #body="{ data }">
                    {{ data.ipAddresses.replace(/'/g, "")  }}
                </template>
                </Column>
            </DataTable>
            <Paginator
              ref="paging"
              :first="offset"
              :rows="10"
              :totalRecords="totalElements"
              :rowsPerPageOptions="[10, 25, 50, 100]"
              @page="onPage($event)">
              
            </Paginator>
            <template> {{$t('reports.session_report.total_result')}} : {{ totalElements }} </template>
        </div>                
        <template #footer>
          <Button
              :label="this.$t('reports.session_report.close')"
              icon="pi pi-times"
              class="p-button-text p-button-sm"
              @click="showDialog = false"/>
        </template>
    </Dialog>
  </div>
</template>


<script>
/**
 * Agent Detail Dialog
 * @see {@link http://www.liderahenk.org/}
 */
 import { agentSessionReportService } from "../../../../services/Reports/AgentSessionReportService.js";


export default {

    data(){
        return{
            agentSessionList : [],
            sessions: [],
            offset: 1,
            pageNumber: 1,
            rowNumber: 10,
            totalElements: 0,
            loading: false,
            sessionFilter: {
              status:"ALL",
            },

            statuses: [
            {
              name: this.$t('reports.session_report.all'),
              value: "ALL",
            },
            {
              name: this.$t('reports.session_report.login'),
              value: "LOGIN",
            },
            {
              name: this.$t('reports.session_report.logout'),
              value: "LOGOUT",
            },
          ],
        };
               
    },

    props: {
        selectedAgentId: {
            type: Number,
            description: "Selected agent ID",
        },

        userSessionDialog: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        showDialog: {
            get () {
                return this.userSessionDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeUserSessionDialog')
                }
            }
         }

    },

    methods: {

      formatDate(dateString) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',hour12: false};
        const formattedDate = new Date(dateString).toLocaleString('tr-TR', options);
        return formattedDate;
      },

      async getUserSessions(){
        this.loading = true;
        if (this.selectedAgentId) {
          var data = new FormData();
          data.append("pageNumber", this.pageNumber);
          data.append("pageSize", this.rowNumber);
          data.append("agentID", this.selectedAgentId);
          data.append("sessionType", this.sessionFilter.status);
          const{response,error} = await agentSessionReportService.agentSessionDetailList(data);

          if(error){
            this.$toast.add({
              severity:'error', 
              detail: this.$t('reports.session_report.error_get_not_agent_session_report')+ " \n"+error, 
              summary:this.$t("computer.task.toast_summary"), 
              life: 3000
            });
          }
          else{
            if(response.status == 200){
              this.totalElements = response.data.totalElements;
              this.sessions = response.data.content;
            }
            else{
              this.$toast.add({
                severity:'error',
                detail:this.$t('reports.session_report.error_417_get_not_agent_session_report'),
                summary:this.$t('settings.console_user_settings.error'),
                life:3600
                });     
              }
            }
            this.loading = false;
          }
      },

      async exportToExcel() {
        this.loading = true;
        var data = new FormData();
        data.append("pageNumber", this.pageNumber);
        data.append("pageSize", this.rowNumber);
        data.append("agentID", this.selectedAgentId);
        data.append("sessionType", this.sessionFilter.status);
        const { response, error } = await agentSessionReportService.agentSessionInfoExport(data)
        if (error){
              this.$toast.add({
              severity:'error',
              detail:this.$t('reports.session_report.agent_info_report_export_error'),
              summary:this.$t("computer.toast_summary"),
              life:3600
            });
        }else{
          if(response.status == 200){
            let blob = new Blob([response.data])
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "Agent Session Report.xlsx";
            this.loading = false;
            link.click();
          }
        else if(response.status == 400)
            this.$toast.add({
                severity:'error',
                detail:this.$t('reports.session_report.error_400_agent_info_report'),
                summary:this.$t("computer.toast_summary"),
                life:3600
            });      
        }
      },  
      onChange() {
        this.offset = 0;
        this.$refs.paging.$emit('page', {
          page: 0,
          rows: 10,
          first: 0,
        });
          this.getUserSessions();
        },

      onPage(event) {
        this.pageNumber = event.page + 1;
        this.rowNumber = event.rows;
        this.getUserSessions();
      },
    },
    
    mounted() {
      this.getUserSessions();
    }

}
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
  .p-component {
      margin-left: auto;
  }
}
</style>