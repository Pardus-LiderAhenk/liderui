<template>
  <div>
    <Dialog
        v-model:visible="showDialog"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
        :style="{ width: '50vw' }" :modal="true"
        :header="$t('İstemci Oturum Bilgileri')">
        <div>
            <DataTable :value="sessions" responsiveLayout="scroll" :loading="loading"
                style="margin-top: 2em"  class="p-datatable-sm" v-model:filters="filters"
                :paginator="true" :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                :rowsPerPageOptions="[10,25,50]">
                <template #header>
                  <div class="p-d-flex p-jc-between">
                      <div style="text-align: left">
                        <Button :label="$t('reports.session_report.export')"
                        icon="fas fa-file-excel"
                        @click="exportToExcel()"/>
                      </div>
                      <div class="p-d-flex p-jc-end">
                        <Dropdown v-model="sessionFilter.status" style="min-width: 100%;" 
                          :options="statuses"
                          optionLabel="name" optionValue="value"
                          :showClear="true"
                          @change="getSessions"
                        />
                      </div>
                  </div>
                </template>

                <template #empty>
                  {{$t('reports.system_log_report.task_cant_find')}}...
                </template>
                <template #loading>
                   {{$t('Yükleniyor')}}...
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
                    {{ data.macAddresses.replace(/'/g, "")  }}
                </template>
                </Column>
                <Column field="ipAddresses" :header="$t('reports.session_report.ip_address')">
                  <template #body="{ data }">
                    {{ data.ipAddresses.replace(/'/g, "")  }}
                </template>
                </Column>
            </DataTable>
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
            currentPage: 1,
            offset: 1,
            pageNumber: 1,
            rowNumber: 10,
            totalElements: 0,
            loading: false,
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
            },
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
        const formattedDate = new Date(dateString).toLocaleString(undefined, options);
      return formattedDate;
      },

      async getUserSessions(){
        if (this.selectedAgentId) {
        var data = new FormData();

        data.append("pageNumber", this.pageNumber);
        data.append("pageSize", this.rowNumber);
        data.append("agentID", this.selectedAgentId);
        const{response,error} = await agentSessionReportService.agentSessionDetailList(data);

        if(error){
          this.$toast.add({
            severity:'error', 
            detail: this.$t('Agent bilgisi getirilemedi')+ " \n"+error, 
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
                  detail:this.$t('settings.console_user_settings.an_unexpected_problem_was_encountered'),
                  summary:this.$t('settings.console_user_settings.error'),
                  life:3600
                  });     
              }
            }
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
      async getSessions(){
        var data = new FormData();
        data.append("pageNumber", this.pageNumber);
        data.append("pageSize", this.rowNumber);
        data.append("agentID", this.selectedAgentId);
        data.append("sessionType", this.sessionFilter.status);

        const{response,error} = await agentSessionReportService.agentSessionGetSessionInfo(data);
          if(error){
              this.$toast.add({
                  severity:'error', 
                  detail: this.$t('İstemci Oturum listesi getirilemedi'), 
                  summary:this.$t("computer.task.toast_summary"), 
                  life: 3000
              });
          }
          else{
              if(response.status == 200){
                this.sessions = response.data.content;
              }
              else if(response.status == 417){
                  this.$toast.add({
                      severity:'error', 
                      detail: this.$t('İstemci Oturum listesi getirilemedi'), 
                      summary:this.$t("computer.task.toast_summary"), 
                      life: 3000
                  });                
              }
          }
        }
    },
    
    mounted() {
      this.getUserSessions();
    }

}
</script>

<style lang="scss" scoped>
::v-deep(.p-progressbar-blue) {
    height: 1.25rem;
    background-color: #419544;

    .p-progressbar-value {
        background-color: #1769aa;
    }
    
  }
  ::v-deep(.p-progressbar-red) {
    height: 1.25rem;
    background-color: #419544;
  
    .p-progressbar-value {
        background-color:#D32F2F;
    }
    
  }
</style>