<template>
    <div>
        <div class="card">
            <Card header="server-list">
                <template #content>
                <DataTable :value="serverList"  tableStyle="min-width: 62rem" class="p-datatable-sm" responsiveLayout="scroll">
                    <template #header>
                        <div class="p-d-flex p-jc-between">
                                <h5>Sunucu listesi</h5>
                            <Button 
                                class="p-button-sm" 
                                icon="pi pi-plus" 
                                :label="$t('sunucu ekle')"
                                @click="addServerModalVisible =  true;">
                            </Button>
                        </div>
                    </template>
                    <Column field="id" header="#"></Column>  
                    <Column field="hostname" header="Hostname"></Column>
                    <Column field="ip" header="Ip"></Column>
                    <Column field="mac" header="Mac Adres"></Column>
                    <Column field="os" header="İşletim sistemi"></Column>
                    <Column field="os-version" header="İşletim sistemi versiyon"></Column>
                    <Column>
                        <template #body>
                            <div class="p-d-flex p-jc-end">

                                <Button class="p-mr-2 p-button-sm p-button-rounded p-button-warning" 
                                    icon="pi pi-pencil"
                                    :title="$t('Düzenle')" 
                                    @click="editServerModalVisible = true;"
                                    >
                                </Button>

                                <Button class="p-mr-2 p-button-danger p-button-sm p-button-rounded" 
                                    icon="pi pi-trash" 
                                    :title="$t('Sil')"
                                    @click="deleteServerDialog =  true;">
                                </Button>

                                <Button 
                                    class="p-mr-2 p-button-sm p-button-raised p-button-rounded"
                                    icon="pi pi-list"
                                    :title="$t('Detay')" 
                                    @click="showServerDetailVisible =  true;">
                                </Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
                
                </template>
            </Card>
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
        
        <edit-server-dialog v-if="editServerModalVisible"
            :updateServerDialog="editServerModalVisible"
            :selectedServer="selectedServer"
            @modalVisibleValue="editServerModalVisible = $event;"
            @close-server-dialog="editServerModalVisible = false"
        />

    </div>
        
</template>

<script>
import AddServerDialog from '../Dialogs/AddServerDialog.vue';
import ShowServerDetailDialog from '../Dialogs/ShowServerDetailDialog.vue';
import DeleteServerDialog from '../Dialogs/DeleteServerDialog.vue';
import EditServerDialog from '../Dialogs/EditServerDialog.vue';
import  { serverInformationService } from '../../../../services/Settings/ServerInformationService.js';


export default{

    data() {

        return {
    
            AddServerDialog : false,
            ShowServerDetailDialog : false,
            addServerModalVisible : false,
            showServerDetailVisible : false,
            deleteServerDialog : false,
            editServerDialog : false,
            editServerModalVisible : false,
            serverList:[hostname = ""]

        }
    },

    components: {
        AddServerDialog,
        ShowServerDetailDialog,
        DeleteServerDialog,
        EditServerDialog,
        
    },

    mounted() {
        this.serverListAll();
    
    },


    methods: {
        async serverListAll(){

            const { response, error } = await serverInformationService.list(this.serverList);
            console.log(this.serverList);
            if (error){
                this.$toast.add({
                severity:'error',
                detail: this.$t('serverList'),
                summary:this.$t("computer.task.toast_summary"),
                life:3600
            });
            } 
            else{
              if (response.status == 200) {
                this.brands = response.data.brands;
                this.models = response.data.models;
                this.processors = response.data.processors;
                this.agentVersions = response.data.agentVersions;
                this.osVersions = response.data.osVersions;
                this.agents = response.data.agents.content;
                this.totalElements = response.data.agents.totalElements;
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
            }
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