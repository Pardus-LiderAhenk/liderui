<template>
    <div>
        <div class="card">
            <Card header="server list">
                <template #content>
                <DataTable :value="serverList" showGridlines tableStyle="min-width: 60rem">
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
                            <!-- <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)" /> -->
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
        </div>

    
    
        <add-server-dialog v-if="addServerModalVisible"
        @updateConsoleUsers="getConsoleUsers"
        :modalVisibleValue="addServerModalVisible" 
        @modalVisibleValue="addServerModalVisible = $event;"
        />
    </div>
        
</template>

<script>
import AddServerDialog from '../Dialogs/AddServerDialog.vue';
export default{
    
    components: {
            AddServerDialog,
        },
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