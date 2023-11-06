<template>
    <div>
        <Dialog
            v-model:visible="showDialog"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '50vw' }" :modal="true"
            :header="$t('İstemci Oturum Bilgileri')">
            <!-- <div class="p-d-flex p-jc-between">
                <div style="text-align: left">
                    <Button
                        :label="$t('reports.session_report.export')"
                        icon="fas fa-file-excel"
                        @click="exportToExcel()"/>
                </div>
            </div> -->
                <template #title>
                  <div class="p-d-flex p-jc-between">
                    <div>{{$t('reports.session_report.results')}}</div>
                    <div>
                      <Button
                        :label="$t('reports.session_report.export')"
                        icon="fas fa-file-excel"
                        @click="exportToExcel()"
                      />
                    </div>
                  </div>
                </template>
                  <h5>
                    {{ selectedAgent.hostname }}
                  </h5>
                

                <Paginator
                  :rows="10"
                  :totalRecords="totalElements"
                  :rowsPerPageOptions="[10, 25, 50, 100]"
                  @page="onPage($event)">
                  <template> {{$t('reports.session_report.total_result')}} : {{ totalElements }} </template>
                </Paginator>
                
            <template #footer>

            <Button
                :label="this.$t('reports.session_report.close')"
                icon="pi pi-times"
                class="p-button-text p-button-sm"
                @click="showDialog = false"
            />
            </template>
        </Dialog>
    <!-- Add Group Dialog End-->
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
            disksList : [],
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
        };
               
    },

    props: {

        selectedAgent: {
            type: Object,
            description: "Selected agent",
        },

        agentDetailDialog: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        showDialog: {
            get () {
                return this.agentDetailDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeAgentDetailDialog')
                }
            }
        },

    },

    methods: {

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

        getSessionsValue(sessions, username) {
            var propertyValue = "";

            const filteredSessions = sessions.filter(
                (property) => property.username === username
            );
            
            if (filteredSessions != null && filteredSessions.length > 0) {
                propertyValue = filteredSessions[0].propertyValue;

            }
            console.log(propertyValue);

            return propertyValue;
        },

        async exportToExcel() {

            //this.loading = true;
            var data = new FormData();
            data.append("pageNumber", this.pageNumber);
            data.append("pageSize", this.rowNumber);
            data.append("status", this.filter.status);
            data.append("dn", this.filter.dn);
            data.append("hostname", this.filter.hostname);
            data.append("ipAddress", this.filter.ipAddress);
            data.append("macAddress", this.filter.macAddress);
            data.append("registrationStartDate", this.filter.registrationStartDate);
            data.append("registrationEndDate", this.filter.registrationEndDate);
            data.append("brand", this.filter.brand);
            data.append("model", this.filter.model);
            data.append("processor", this.filter.processor);
            data.append("osVersion", this.filter.osVersion);
            data.append("diskType",this.filter.diskType);
            data.append("agentVersion", this.filter.agentVersion);
            data.append("sessionReportType", this.filter.sessionReportType);
            if (this.pageNumber == 1) {
              data.append("getFilterData", true);
            }
            if (this.filter.registrationDate[0] != null) {
              data.append(
                "registrationStartDate",
                moment(this.filter.registrationDate[0])
                  .set("hour", 0)
                  .set("minute", 0)
                  .set("second", 0)
                  .format("DD/MM/YYYY HH:mm:ss")
              );
            }
            if (this.filter.registrationDate[1] != null) {
              data.append(
                "registrationEndDate",
                moment(this.filter.registrationDate[1])
                  .set("hour", 0)
                  .set("minute", 0)
                  .set("second", 0)
                  .format("DD/MM/YYYY HH:mm:ss")
              );
            }
            const { response, error } = await agentSessionReportService.agentSessionInfoExport(data)
            console.log(response);
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