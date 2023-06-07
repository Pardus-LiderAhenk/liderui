<template>
    <div>

        <add-server-dialog v-if="addServerModalVisible"
            @updateConsoleUsers="getConsoleUsers"
            :modalVisibleValue="addServerModalVisible" 
            @modalVisibleValue="addServerModalVisible = $event;"
        />

        <div class="card">
            <Card header="server-list">
                <template #content>
                <DataTable :value="serverList"  tableStyle="min-width: 60rem" >
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
                    <Column field="ip" header="Ip"></Column>
                    <Column field="hostname" header="Hostname"></Column>
                    <Column field="users" header="Kullanıcı"></Column>
                    <Column field="password" header="Parola"></Column>
                    <Column field="status" header="Durum"></Column>
                    <Column field="detail" header="Detay">
                        <template #body>
                        <Button 
                        class="p-mr-2 p-button-sm p-button-warning" 
                        icon="pi pi-search"
                        :title="$t('Detay')" 
                        @click="addServerModalVisible =  true;"
                            >
                    </Button>
                    </template>
                    </Column>
                </DataTable>
                
                </template>
            </Card>
        </div>

    </div>
        
</template>

<script>
import AddServerDialog from '../Dialogs/AddServerDialog.vue';

export default{

    data() {

        return {

            
            AddServerDialog : false,
            addServerModalVisible :false,
            serverDetailModalVisible : false,
            serverList:[
                {hostname: "ebru0", users:"test0",password:"***",ip:"10.100.10.52", status:"bağlandı"},
                {hostname: "ebru1", users:"test1",password:"***",ip:"10.100.10.100", status:"bağlandı"},
                {hostname: "ebru2", users:"test2",password:"***",ip:"10.100.10.1", status:"bağlandı"},
            ]

        }
    },

    components: {

        AddServerDialog,
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