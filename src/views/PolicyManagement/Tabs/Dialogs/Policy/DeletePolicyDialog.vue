<template>
    <div>
        <!-- Delete Policy Dialog -->
        <Dialog :header="$t('policy_management.delete_policy')" v-model:visible="showDialog" 
            :style="{width: '20vw'}" :modal="true">
            <div class="p-fluid">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    {{$t('policy_management.delete_policy_warn') }}
                </span>
            </div>
            <template #footer>
                <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('policy_management.yes')" icon="pi pi-check"
                    @click="deletePolicy" class="p-button-sm"
                />
            </template>
        </Dialog>
        <!-- Delete Policy Dialog End -->
    </div>
</template>

<script>
/**
 * Create user policy dialog
 * @see {@link http://www.liderahenk.org/}
 * emits these events
 * @event closePolicyDialog
 * @event deletePolicy
*/

import { policyService } from "../../../../../services/PolicyManagement/PolicyService.js";

export default {

    props: {
        deletePolicyDialog: {
            type: Boolean,
            default: false,
        },
        selectedPolicy: {
            type: Object,
            description: "selected policy",
        },
    },

    data(){
        return{
            label:'',
            description: '',
            active: false,
            validation: {
                label: false,
            },
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.deletePolicyDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closePolicyDialog');
                }
            }
        }
    },

    methods: {
       async deletePolicy() {
            let params = {
                "id": this.selectedPolicy.id,
            }

            const{response,error} = await  policyService.policyDelete(this.selectedPolicy.id);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('policy_management.delete_policy_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }else{
                if(response.status == 200){
                    if (response.data) {
                        this.$emit('deletedPolicy', response.data);
                        this.$emit('closePolicyDialog');
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('policy_management.delete_policy_success'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    } else {
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('policy_management.delete_policy_error'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
                else if(response.status == 417){                   
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('policy_management.error_417_delete_policy'), 
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