<template>
    <div>
        <Card>
            <template #title>
                <div class="p-d-flex p-jc-between">                
                    <div>
                        {{$t('settings.server_information.server_list')}}
                    </div>
                    <Button 
                        class="p-button-sm" 
                        icon="pi pi-plus" 
                        :label="$t('settings.server_information.add_server')"
                        @click="addServerModalVisible =  true;">
                    </Button>
                
                </div>
            </template>
            <template #content>
            <DataTable :value="servers"  
                tableStyle="min-width: 64rem" 
                class="p-datatable-sm" 
                responsiveLayout="scroll"
                :paginator="true" :rows="10" ref="dt"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                :rowsPerPageOptions="[10,25,50,100]" style="margin-top: 1rem">
                <Column header="#">
                    <template #body="{index}">
                      <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
                    </template>
                  </Column>  
                <Column field="machineName" :header="$t('settings.server_information.machine_name')">
                    {{ machineName }}
                </Column>
                <Column field="ip" :header="$t('settings.server_information.ip_addr')">
                    {{ ip }}
                </Column>
                <Column field="os" :header="$t('settings.server_information.os_system')">
                    <template #body="{ data }">
                        {{ getPropertyValue(data.properties, "os_name") }}
                    </template>
                </Column>
                <Column field="os-version" :header="$t('settings.server_information.os_version')">
                    <template #body="{ data }">
                        {{ getPropertyValue(data.properties, "os_version") }}
                    </template>
                </Column>
                
                <Column field="status" :header="$t('settings.server_information.status')">
                <template #body="slotProps">
                    <Badge  
                        :value="slotProps.data.status ? $t('settings.server_information.connect'): $t('settings.server_information.disconnect')" 
                        :severity="slotProps.data.status ? 'success': 'danger'">
                    </Badge>
                </template>    
                </Column>
            
                <Column>
                    <template #body="slotProps">
                        <div class="p-d-flex p-jc-end">
                            <Button class="p-mr-2 p-button-sm p-button-rounded p-button-warning" 
                                icon="pi pi-pencil"
                                :title="$t('settings.server_information.edit')" 
                                @click="editServerModalVisible = true; selectedServer = slotProps.data">
                            </Button>
                            <Button class="p-mr-2 p-button-danger p-button-sm p-button-rounded" 
                                icon="pi pi-trash" 
                                :title="$t('settings.server_information.delete')"
                                @click="deleteServerDialog =  true; selectedServer = slotProps.data">
                            </Button>
                            <Button 
                                class="p-mr-2 p-button-sm p-button-raised p-button-rounded"
                                icon="pi pi-list"
                                :title="$t('settings.server_information.detail')" 
                                @click="showServerDetailVisible= true; selectedServer = slotProps.data">
                            </Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
            </template>
        </Card>
    </div>
    <add-server-dialog v-if="addServerModalVisible"
        :addServerDialog="addServerModalVisible" 
        @closeAddServerDialog="addServerModalVisible = $event;"
        @saved-server="savedServer"
    />
    <show-server-detail-dialog v-if="showServerDetailVisible"
        :selectedServer="selectedServer"
        :showServerDetailDialog="showServerDetailVisible"
        @close-server-detail="showServerDetailVisible=false"
    />
    
    <edit-server-dialog v-if="editServerModalVisible"
        :updateServerDialog="editServerModalVisible"
        :selectedServer="selectedServer"
        @closeEditServerDialog="editServerModalVisible = $event;"
        @edit-server="editServer"  
    />
    <Dialog :header="$t('settings.server_information.delete_server')" 
        v-model:visible="deleteServerDialog" 
        :style="{width: '20vw'}" 
        :modal="true"
        @hide="deleteServerDialog = false"
    >
        <div class="p-fluid">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
            <span>
                {{$t('settings.server_information.delete_server_confirm_message') }}
            </span>
        </div>
        <template #footer >
            <Button 
            :label="$t('settings.server_information.cancel')" 
            icon="pi pi-times" 
            @click="deleteServerDialog = false" 
            class="p-button-text p-button-sm"
            />
            <Button class="p-button-sm"
                :label="$t('settings.server_information.yes')" 
                icon="pi pi-check"
                @click="deleteServer"                    
            />
        </template>
    </Dialog>
        
</template>

<script>
/**
 * @see {@link http://www.liderahenk.org/}
 * emits these events
 * @event closeServerDialog
 * @event deleteServer
*/

import AddServerDialog from '../Dialogs/AddServerDialog.vue';
import ShowServerDetailDialog from '../Dialogs/ShowServerDetailDialog.vue';
import EditServerDialog from '../Dialogs/EditServerDialog.vue';
import { serverInformationService } from '../../../../services/Settings/ServerInformationService';



export default{

    props: ["servers"],

    data() {

        return {
    
            showServerDetailDialog : false,
            addServerModalVisible : false,
            showServerDetailVisible : false,
            deleteServerDialog : false,
            editServerDialog : false,
            editServerModalVisible : false,
            selectedServer : null,
            serversData: [],
            serverOpenList : false,
            pageNumber: 1,
            rowNumber: 10,
            rows: 10

        }
    },

    components: {
        AddServerDialog,
        ShowServerDetailDialog,
        EditServerDialog,
        
    },

    methods: {

        savedServer() {
            this.addServerModalVisible = false;
            this.$emit("savedServer");
        },

        editServer() {
            this.showServerDetailVisible = false;
            this.$emit("editServer");
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

        async deleteServer() {
            this.deleteServerDialog = false;

            const{response,error} = await  serverInformationService.deleteServer(this.selectedServer.id);
            
            if(response.status == 200){
                    
                this.$toast.add({
                    severity:'success', 
                    detail: this.$t('settings.server_information.deleted_success'), 
                    summary:this.$t("settings.server_information.toast_summary"), 
                    life: 3000
                });
                this.$emit('deletedServer');
                // this.serversData = this.serversData.filter(template => template.id != this.selectedServer.id);
                this.selectedServer = null;
                this.deleteServerDialog = false;
            }
                
            
            else if(response.status == 417){                   
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.server_information.417_error_delete_server'), 
                        summary:this.$t("settings.server_information.toast_summary"), 
                        life: 3000
                    });
            }
        },

        
        async getServerInfo() {

            this.showServerDetailDialog = false;

            let params = {
                "id": this.selectedServer.id,
            }
            const { response,error } = await serverInformationService.getServerDetails(params);
            if(response.status == 200){
              if (response.data != "" && response.data != null) {
                  this.selectedServerInfo = response.data;
            
            } else {
                this.selectedServerInfo = null;
                this.$toast.add({
                  severity:'error', 
                  detail: this.$t("settings.server_information.error_detail_message"), 
                  summary:this.$t("settings.server_information.toast_summary"), 
                  life: 3000
                  });
                }
              }
            else if(response.status == 417){
                this.$toast.add({
                  severity:'error', 
                  detail: this.$t("settings.server_information.417_error_detail_server"), 
                  summary:this.$t("settings.server_information.toast_summary"), 
                  life: 3000
                  });
            }
    },

    resetPaginator() {
        this.pageNumber = 1;
        this.rowNumber = this.rows;
        this.first = 0;
        this.serverListAll();
    },

    },
}

</script>

<style lang="scss" scoped>
    
.card {
    background: #ffffff;
    padding: 0px;
    box-sizing: border-box;
    box-shadow: 0px 10px 40px rgba(41, 50, 65, 0.06);
}
::v-deep(.p-paginator) {
    .p-paginator-current {
        margin-left: auto;
    }
}
</style>