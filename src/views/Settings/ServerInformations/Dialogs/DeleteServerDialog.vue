<template>
    <div>
        
        <Dialog :header="$t('Sucunu sil')" v-model:visible="showDialog" 
            :style="{width: '20vw'}" :modal="true">
            <div class="p-fluid">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    {{$t('Sunucu silinecek emin misiniz?') }}
                </span>
            </div>
            <template #body="slotProps">
                <Button :label="$t('İptal')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button class="p-button-sm"
                    :label="$t('Evet')" 
                    icon="pi pi-check"
                    @click="deleteServer = true; selectedServer = slotProps.data"
                    
                />
            </template>
        </Dialog>
      
    </div>
</template>

<script>
/**
 * @see {@link http://www.liderahenk.org/}
 * emits these events
 * @event closeServerDialog
 * @event deleteServer
*/

import { serverInformationService } from '../../../../services/Settings/ServerInformationService';

export default {

    props: {
        deleteServerDialog: {
            type: Boolean,
            default: false,
        },
        // selectedServer: {
        //     type: Object,
        //     description: "selected server",
        // },
    },

    data(){
        return{
            label:"",
            description: "",
            active: false,
            validation: {
                label: false,
            },
            selectedServer: null,
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.deleteServerDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeServerDialog');
                }
            }
        }
    },

    methods: {
       async deleteServer() {
            let params = {
                "id": this.selectedServer,
            }

            const{response,error} = await  serverInformationService.deleteServer(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('Sunucu silinirken hata oluştu')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }else{
                if(response.status == 200){
                    if (response.data) {
                        this.$emit('deletedServer', response.data);
                        this.$emit('closeServerDialog');
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('Sunucu başarıyla silindi'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    // } else {
                    //     this.$toast.add({
                    //         severity:'error', 
                    //         detail: this.$t('policy_management.delete_policy_error'), 
                    //         summary:this.$t("computer.task.toast_summary"), 
                    //         life: 3000
                    //     });
                    // 
                    }
                }
                else if(response.status == 417){                   
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('Sunucu silinirken hata oluştu 417'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
            this.label = '';
            this.description = '';
        },
    }
    
}
</script>

<style lang="scss" scoped>

</style>