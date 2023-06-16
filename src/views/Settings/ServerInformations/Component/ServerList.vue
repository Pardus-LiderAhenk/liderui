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
                    <!-- <div > -->
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
                                    >
                                </Button>

                                <Button class="p-button-danger p-button-sm p-button-rounded" 
                                    icon="pi pi-trash" 
                                    :title="$t('Sil')"
                                    @click="deleteServerDialog =  true;">
                                </Button>

                                <Button 
                                    class="p-button-sm p-button-raised p-button-rounded"
                                    icon="pi pi-list"
                                    :title="$t('Detay')" 
                                    @click="showServerDetailVisible =  true;">
                                </Button>
                            </div>
                        </template>
                    </Column>
                    <!-- </div> -->
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

    </div>
        
</template>

<script>
import AddServerDialog from '../Dialogs/AddServerDialog.vue';
import ShowServerDetailDialog from '../Dialogs/ShowServerDetailDialog.vue';
import DeleteServerDialog from '../Dialogs/DeleteServerDialog.vue';

export default{

    data() {

        return {
    
            AddServerDialog : false,
            ShowServerDetailDialog : false,
            addServerModalVisible : false,
            showServerDetailVisible : false,
            deleteServerDialog : false,
            serverList:[
                {hostname: "ebru0", users:"test0",password:"***",ip:"10.100.10.52", status:"bağlandı"},
                {hostname: "ebru1", users:"test1",password:"***",ip:"10.100.10.100", status:"bağlandı"},
                {hostname: "ebru2", users:"test2",password:"***",ip:"10.100.10.1", status:"bağlandı"},
            ]

        }
    },

    components: {

        AddServerDialog,
        ShowServerDetailDialog,
        DeleteServerDialog,
        
        
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