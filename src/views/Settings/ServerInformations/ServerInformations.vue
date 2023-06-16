<template>

    <div>
            <div class="p-grid">
                <div class="p-col-12 p-md-6 p-lg-6">
                <server-list></server-list>
                </div>
                <div class="p-col-12 p-md-6 p-lg-6">
                    <server-logs></server-logs>
                </div>
            </div>
            <div class="p-grid">
                <div class="p-col-12 p-md-6 p-lg-4">
                    <disk-information></disk-information>
                </div>
                <div class="p-col-12 p-md-6 p-lg-4">
                    <ram-information></ram-information>
                </div>
                <div class="p-col-12 p-md-6 p-lg-4">
                    <cpu-information></cpu-information>
                </div>
            </div>
    
       
    <add-server-dialog v-if="addServerModalVisible"
        @updateConsoleUsers="getConsoleUsers"
        :modalVisibleValue="addServerModalVisible" 
        @modalVisibleValue="addServerModalVisible = $event;"
    />

    <show-server-detail-dialog v-if="showServerDetailVisible"
        @updateConsoleUsers="getConsoleUsers"
        :modalVisibleValue="showServerDetailVisible" 
        @modalVisibleValue="showServerDetailVisible = $event;"
    />

    <delete-server-dialog
        :deleteServerDialog="deleteServerDialog"
        :selectedServer="selectedServer"
        @delete-server="deleteServer"
        @close-server-dialog="deleteServerDialog = false"
    />

</div>
    </template>
    <script>
    /**
     * Dashboard page
     * @see {@link http://www.liderahenk.org/}
     */
    

    import ChartDataLabels from 'chartjs-plugin-datalabels';
    import AddServerDialog from './Dialogs/AddServerDialog.vue';
    import DiskInformation from "./Component/DiskInformation.vue";
    import RamInformation from "./Component/RamInformation.vue";
    import CpuInformation from "./Component/CpuInformation.vue";
    import ServerList from "./Component/ServerList.vue";
    import ServerLogs from "./Component/ServerLogs.vue";
    import ShowServerDetailDialog from './Dialogs/ShowServerDetailDialog.vue';
    import DeleteServerDialog from './Dialogs/DeleteServerDialog.vue';
    
    
    
    export default {
        setup() {
        const plugins = [ChartDataLabels]
          return {
            plugins,
          }
        },
        data() {
            return {

                addServerModalVisible :false,
                showServerDetailVisible : false,
                
            }
        },
        
        components: {

            ServerList,
            ServerLogs,
            AddServerDialog,
            DiskInformation,
            RamInformation,
            CpuInformation,
            ShowServerDetailDialog,
            DeleteServerDialog,
            
        },
        
        mounted() {
    
        },
    
        methods: {
                        
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