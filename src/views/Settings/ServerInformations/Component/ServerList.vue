<template>
    <div>
        <div class="card">
            <Card header="server-list">
                <template #content>
                <DataTable :value="servers"  tableStyle="min-width: 62rem" class="p-datatable-sm" responsiveLayout="scroll">
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
                    <Column header="#">
                        <template #body="{index}">
                          <span>{{  index + 1 }}</span>
                        </template>
                      </Column>  
                    <Column field="hostname" header="hostname">
                        {{ hostname }}
                    </Column>
                    <Column field="ip" header="Ip">
                        {{ ip }}
                    </Column>
                    <Column field="mac" header="Mac Adres">
                        <template #body="{ data }">
                            {{ getPropertyValue(data.properties, "mac_addr") }}
                        </template>
                    </Column>
                    <Column field="os" header="İşletim sistemi">
                        <template #body="{ data }">
                            {{ getPropertyValue(data.properties, "os_name") }}
                        </template>
                    </Column>
                    <Column field="os-version" header="İşletim sistemi versiyon">
                        <template #body="{ data }">
                            {{ getPropertyValue(data.properties, "os_version") }}
                        </template>
                    </Column>
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


export default{
    props: {
        servers: {
            type: Object,
            description: "Server list",
        },
    },

    data() {

        return {
    
            AddServerDialog : false,
            ShowServerDetailDialog : false,
            addServerModalVisible : false,
            showServerDetailVisible : false,
            deleteServerDialog : false,
            editServerDialog : false,
            editServerModalVisible : false,

        }
    },

    components: {
        AddServerDialog,
        ShowServerDetailDialog,
        DeleteServerDialog,
        EditServerDialog,
        
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

    },

    mounted() {
        console.log(this.servers)
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