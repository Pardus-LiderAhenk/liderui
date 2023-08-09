<template>
    <div class="p-col-12 p-pb-0" 
            v-loading="loading"
            element-loading-text="Loading, please wait..."
            element-loading-background="rgba(0, 0, 0, 0.6)"
            :element-loading-spinner="svg"
            >
            <div class="p-grid">
                <div class="p-col-12 p-md-6 p-lg-6">
                <server-list
                    :servers="servers"
                    @deletedServer="getServerData"
                    @savedServer="savedServer"
                ></server-list>
                </div>
                <div class="p-col-12 p-md-6 p-lg-6">
                    <server-logs
                        :servers="servers"
                        :serversData="serversData"
                    ></server-logs>
                </div>
            </div>
            <div class="p-grid">
                <div class="p-col-12 p-md-6 p-lg-4">
                    <disk-information
                        :servers="servers"
                        :serversData="serversData"
                    ></disk-information>
                </div>
                <div class="p-col-12 p-md-6 p-lg-4">
                    <ram-information
                        :servers="servers"
                    ></ram-information>
                </div>
                <div class="p-col-12 p-md-6 p-lg-4">
                    <cpu-information
                        :servers="servers"
                    ></cpu-information>
                </div>
            </div>

    <show-server-detail-dialog v-if="showServerDetailDialog"
        :showServerDetailDialog="showServerDetailDialog" 
        :servers="servers"
        @modalVisibleValue="showServerDetailDialog = $event;"
    />

    <edit-server-dialog v-if="editServerDialog"
        :editServerDialog="editServerDialog"
        :selectedServer="selectedServer"
        @edit-server-dialog="savedServer"
    />

</div>
</template>
<script>
    /**
     * Dashboard page
     * @see {@link http://www.liderahenk.org/}
     */
    

    import ChartDataLabels from 'chartjs-plugin-datalabels';
    import DiskInformation from "./Component/DiskInformation.vue";
    import RamInformation from "./Component/RamInformation.vue";
    import CpuInformation from "./Component/CpuInformation.vue";
    import ServerList from "./Component/ServerList.vue";
    import ServerLogs from "./Component/ServerLogs.vue";
    import ShowServerDetailDialog from "./Dialogs/ShowServerDetailDialog.vue";
    import EditServerDialog from "./Dialogs/EditServerDialog.vue";
    import  { serverInformationService } from "../../../services/Settings/ServerInformationService.js";
    
    
    
    export default {
        setup() {
        const plugins = [ChartDataLabels]
          return {
            plugins,
          }
        },
        data() {
            return {

                addServerModalVisible : false,
                showServerDetailVisible : false,
                showServerDetailDialog :  false,
                editServerModalVisible : false,
                editServerDialog: false,
                servers: [],
                serversData:[],
                loading: false,
            }
        },
        
        components: {

            ServerList,
            ServerLogs,
            DiskInformation,
            RamInformation,
            CpuInformation,
            ShowServerDetailDialog,
            EditServerDialog,
            
        },
        
        created(){
            this.serverListAll();
        },

        mounted(){
            this.serverListAll();
        },
    
        methods: {

            async serverListAll(){
                this.loading = true;
                const { response, error } = await serverInformationService.list();
                if (error){
                    this.$toast.add({
                    severity:'error',
                    detail: "test",
                    summary:this.$t("computer.task.toast_summary"),
                    life:3600
                    });
                } 
                else{
                    if (response.status == 200) {
                        this.servers = response.data;
                        console.log('Servr alıyorum server vue dann',this.servers)
                    } 
                    else if (response.status == 417) {
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
                   
            savedServer() {
                this.getServerData();
            },

            async getServerData(){
                this.loading = true;
                const{response,error} = await  serverInformationService.getData();
                console.log(response);
                if (error){
                    this.$toast.add({
                        severity:'error',
                        detail: "server db error",
                        summary:this.$t("computer.task.toast_summary"),
                        life:3600
                    });
                } 
                else{
                    if (response.status == 200) {
                        console.log(response.data)
                        this.servers = response.data;
                    } 
                    else if (response.status == 417) {
                        this.$toast.add({
                            severity:'error',
                            detail: this.$t('server db data'),
                            summary:this.$t("computer.task.toast_summary"),
                            life:3600
                        });
                    }
                }
                this.loading = false;
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

            
        },
        watch : {
            getServer(){
                this.getServerData();
            },
        }
    
    }
</script>
    
<style lang="scss" scoped>
    
    .card {
        background: #ffffff;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 0px 10px 40px rgba(41, 50, 65, 0.06);
    }

</style>