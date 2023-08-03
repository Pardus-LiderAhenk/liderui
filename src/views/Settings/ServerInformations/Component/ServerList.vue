<template>
    <div>
            <Card>
                <template #title>
                    <div class="p-d-flex p-jc-between">                
                        <div>
                            {{$t('Sunucu Bilgisi')}}
                        </div>
                        <Button 
                            class="p-button-sm" 
                            icon="pi pi-plus" 
                            :label="$t('sunucu ekle')"
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
                    <!-- <template #header>                                                -->
                            
                        
                                <!-- <h5>Sunucu listesi</h5>
                                
                                <Button 
                                    class="p-button-sm" 
                                    icon="pi pi-plus" 
                                    :label="$t('sunucu ekle')"
                                    @click="addServerModalVisible =  true;">
                                </Button>
                        </div> -->
                    <!-- </template> -->
                    <Column header="#">
                        <template #body="{index}">
                          <!-- <span>{{  index + 1 }}</span> -->
                          <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>

                        </template>
                      </Column>  
                    <Column field="machineName" header="Makine İsmi">
                        {{ machineName }}
                    </Column>
                    <Column field="ip" header="Ip Adres">
                        {{ ip }}
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
                    
                    <Column field="status" header="Durumu">
                    <template #body="{ data }">
                        {{ getPropertyValue(data.properties, "status") == "true"  ?  $t("Bağlandı") : $t("Bağlandı") }}
                    </template>    
                    </Column>
                
                    <Column>
                        <template #body="slotProps">
                            <div class="p-d-flex p-jc-end">

                                <Button class="p-mr-2 p-button-sm p-button-rounded p-button-warning" 
                                    icon="pi pi-pencil"
                                    :title="$t('Düzenle')" 
                                    @click="editServerModalVisible = true; selectedServer = slotProps.data">
                                </Button>

                                <Button class="p-mr-2 p-button-danger p-button-sm p-button-rounded" 
                                    icon="pi pi-trash" 
                                    :title="$t('Sil')"
                                    @click="deleteServerDialog =  true; selectedServer = slotProps.data">
                                </Button>

                                <Button 
                                    class="p-mr-2 p-button-sm p-button-raised p-button-rounded"
                                    icon="pi pi-list"
                                    :title="$t('Detay')" 
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
            @updateConsoleUsers="getConsoleUsers"
            :modalVisibleValue="addServerModalVisible" 
            @modalVisibleValue="addServerModalVisible = $event;"
        />

        <show-server-detail-dialog v-if="showServerDetailVisible"
            :selectedServer="selectedServer"
            :showServerDetailDialog="showServerDetailVisible"
            @close-server-detail="showServerDetailVisible=false"
        />
        
        <edit-server-dialog v-if="editServerModalVisible"
            :updateServerDialog="editServerModalVisible"
            :selectedServer="selectedServer"
            @modalVisibleValue="editServerModalVisible = $event;"
            @close-server-dialog="editServerModalVisible = false"
        />

        <Dialog :header="$t('Sucunu sil')" 
            v-model:visible="deleteServerDialog" 
            :style="{width: '20vw'}" 
            :modal="true"
            @hide="deleteServerDialog = false"
        >
            <div class="p-fluid">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    {{$t('Sunucu silinecek emin misiniz?') }}
                </span>
            </div>
            <template #footer >
                <Button 
                :label="$t('İptal')" 
                icon="pi pi-times" 
                @click="deleteServerDialog = false" 
                class="p-button-text p-button-sm"
                />
                <Button class="p-button-sm"
                    :label="$t('Evet')" 
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
    props: {
        servers: {
            type: Object,
            description: "Server list",
        },
    },

    data() {

        return {
    
            AddServerDialog : false,
            showServerDetailDialog : false,
            addServerModalVisible : false,
            showServerDetailVisible : false,
            deleteServerDialog : false,
            editServerDialog : false,
            editServerModalVisible : false,
            selectedServer : null,
            pageNumber: 1,
            rowNumber: 10,

        }
    },

    components: {
        AddServerDialog,
        ShowServerDetailDialog,
        EditServerDialog,
        
    },
    


    methods: {

        updateRowIndex() {
            for (let index = 0; index < this.policies.length; index++) {
                const element = this.policies[index];
                element.index = index + 1;
            }
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
            console.log(response);
            
            if(response.status == 200){
                    
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('Sunucu başarıyla silindi(list)'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
            }
                
            
            else if(response.status == 417){                   
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('Sunucu silinirken hata oluştu 417'), 
                        summary:this.$t("computer.task.toast_summary"), 
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
                  console.log(response)
                  this.selectedServerInfo = response.data;
            
            } else {
                this.selectedServerInfo = null;
                this.$toast.add({
                  severity:'error', 
                  detail: this.$t("computer.agent_info.error_message"), 
                  summary:this.$t("computer.task.toast_summary"), 
                  life: 3000
                  });
                }
              }
            else if(response.status == 417){
              return "error";
            }
    }

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