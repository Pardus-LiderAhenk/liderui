<template>

    <div>
            <div class="p-grid">
                <div class="p-col-12 p-md-6 p-lg-6 p-field">
                    <!-- <Card header="server list">
                        <template #content>
                        <DataTable :value="serverList" showGridlines tableStyle="min-width: 50rem">
                            <template #header>
                                <div class="p-d-flex p-jc-between">
                                        <h5>server list</h5>
                                    <Button 
                                        class="p-button-sm" 
                                        icon="pi pi-plus" 
                                        :label="$t('sunucu ekle')"
                                        @click="addServerModalVisible =  true">
                                    </Button>
                                </div>
                            </template>
                            <Column field="ip" header="Ip"></Column>
                            <Column field="hostname" header="Hostname"></Column>
                            <Column field="users" header="Kullanıcı"></Column>
                            <Column field="password" header="Parola"></Column>
                            <Column header="Durum">
                                <template>
                                    <Tag/>
                                     <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)" />
                                </template>
                            </Column>
                            <Column field="inspect" header="İncele">
                                <Button 
                                class="p-button-sm" 
                                icon="pi pi-plus" 
                                :label="$t('sunucu ekle')"
                                @click="addServerModalVisible =  true">
                            </Button>
                            </Column>
                        </DataTable>
                        </template>
                    </Card> 
                -->
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
            }
        },
        
        components: {
            ServerList,
            ServerLogs,
            AddServerDialog,
            DiskInformation,
            RamInformation,
            CpuInformation,
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