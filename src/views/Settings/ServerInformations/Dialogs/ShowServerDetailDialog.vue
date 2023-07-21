<template>
    <Dialog
        :header="$t('Sunucu Bilgileri')" 
        :modal="true"
        :style="{ width: '40vw'}"
        v-model:visible="showDialog">
        <DataTable class="p-datatable-sm" :value=" servers" 
         responsiveLayout="scroll">
            <template #header>
                
            </template>
            <Column field="label" :header="$t('node_detail.attribute')"></Column>
            <Column field="value" :header="$t('node_detail.value')"></Column>
        </DataTable>
        <template #footer>

            <Button :label="$t('Kapat')" icon="pi pi-times" @click="showDialog = false" class="p-button-text"/>
            
        </template>
    </Dialog>

</template>
<script>
import { serverInformationService } from '../../../../services/Settings/ServerInformationService';


export default {

    data(){
        return {
            selectedServerInfo: null,

        }
    },

    props: {
        detailServerDialog: {
            type: Boolean,
            default: false,
        },
        
    },

    computed: {
        modalVisible: {
            get() {
                return this.deleteServerDialog;
            },
            set() {
                this.$emit('deleteServerDialog', false);
            }
        },
    }
    ,
    methods:{

        async  getServerInfo() {

            let params = {
                "id": this.selectedServerInfo,
            }
            const { response,error } = await serverInformationService.getDetailServer(params);
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