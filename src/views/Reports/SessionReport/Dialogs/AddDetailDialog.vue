<template>
    <div>
        <Dialog
            v-model:visible="showDialog"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '50vw' }" :modal="true"
            :header="$t('reports.detailed_agent_report.agent_detail')">
            <h4>{{$t('reports.detailed_agent_report.general_information')}}</h4>
            <div class="p-grid">
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.computer_name')}}</b></div>
                <div class="p-col-8">{{ selectedAgent.hostname }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.mac_address')}}</b></div>
                <div class="p-col-8">
                    {{ selectedAgent.macAddresses.replace(/'/g, "") }}
                </div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>JID</b></div>
                <div class="p-col-8">{{ selectedAgent.jid }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.ip_address')}}</b></div>
                <div class="p-col-8">
                    {{ selectedAgent.ipAddresses.replace(/'/g, "") }}
                </div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.operating_system_version')}}</b></div>
                <div class="p-col-8">
                    {{
                    getPropertyValue(selectedAgent.properties, "os.version")
                    }}
                </div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.ahenk_version')}}</b></div>
                <div class="p-col-8">
                    {{ getPropertyValue(selectedAgent.properties, "agentVersion") }}
                </div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.create_date')}}</b></div>
                <div class="p-col-8">{{ selectedAgent.createDate }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('reports.detailed_agent_report.update_date')}}</b></div>
                <div class="p-col-8">{{ selectedAgent.updateDate }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            </div>            

            <template #footer>

            <Button
                :label="$t('reports.detailed_agent_report.export')"
                icon="fas fa-file-excel"
                @click="exportToExcel()"
            />
            <Button
                :label="this.$t('reports.detailed_agent_report.close')"
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
            // filter: {
            //     dn: "",
            //     hostname: "",
            //     ipAddress: "",
            //     macAddress: "",
            //     registrationDate: "",
            //     registrationStartDate: "",
            //     registrationEndDate: "",
            //     status: "ALL",
            //     brand: "",
            //     model: "",
            //     processor: "",
            //     osVersion: "",
            //     agentVersion: "",
            //     diskType:"ALL",
            //     sessionReportType: "",
            // },
        };
               
    },

    props: {
        filter: {
            type: Object,
            description: "Agent report filter",
        },

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

        async exportToExcel() {

            this.loading = true;
            var data = new FormData();
            data.append("hostname", "ebru");
            // data.append("ipAddress", selectedAgent.ipAddress);
            // data.append("macAddress", selectedAgent.macAddress);
            // data.append("registrationStartDate", selectedAgent.registrationStartDate);
            // data.append("registrationEndDate", selectedAgent.registrationEndDate);
            // if (selectedAgent.registrationDate[0] != null) {
            //   data.append(
            //     "registrationStartDate",
            //     moment(selectedAgent.registrationDate[0])
            //       .set("hour", 0)
            //       .set("minute", 0)
            //       .set("second", 0)
            //       .format("DD/MM/YYYY HH:mm:ss")
            //   );
            // }
            // if (selectedAgent.registrationDate[1] != null) {
            //   data.append(
            //     "registrationEndDate",
            //     moment(this.filter.registrationDate[1])
            //       .set("hour", 0)
            //       .set("minute", 0)
            //       .set("second", 0)
            //       .format("DD/MM/YYYY HH:mm:ss")
            //   );
            // }
            const { response, error } = await agentSessionReportService.agentSessionInfoExport(data)
            console.log(data);
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