<template>
    <Dialog :header="$t('computer.task.toast_summary')" 
        v-model:visible="applyPolicyConfirmDialog"  
        :modal="true" :style="{width: '30vw'}"
        @hide="applyPolicyConfirmDialog = false">
        <div class="p-fluid">
            <div class="p-field">
                <div class="confirmation-content">
                    <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                    <span>
                        {{ $t('group_management.apply_policy_confirm_message')}}
                    </span>
                </div>
            </div>
            <div class="p-field p-d-flex p-jc-start">
                <div>
                    <Button type="button" class="p-button-link" 
                        :label="$t('group_management.add_policy_exception')"
                        :badge="policyExceptionData ? policyExceptionData.members.length : '0'" 
                        @click="addPolicyExceptionDialog = true"
                        badgeClass="p-badge-danger"
                        v-tooltip.bottom="$t('group_management.exception_users_groups')"/>
                </div>
            </div>
        </div>
        
        <template #footer>
            <Button 
                :label="$t('group_management.cancel')" 
                icon="pi pi-times" 
                @click="applyPolicyConfirmDialog = false" 
                class="p-button-text p-button-sm"
            />
            <Button 
                :label="$t('group_management.yes')"
                icon="pi pi-check" 
                @click="applyPolicy"
                class="p-button-sm"
            />
        </template>
    </Dialog>
    <div>
        <Dialog :header="$t('group_management.active_policy_list')" v-model:visible="showDialog" 
        :style="{width: '60vw'}" :modal="true">
        <div class="p-fluid">
            <div class="p-field">
                <DataTable class="p-datatable-sm" 
                    :value="policies" v-model:filters="filters"
                    responsiveLayout="scroll" :paginator="true" :rows="10" ref="dt"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                    :rowsPerPageOptions="[10,25,50,100]" style="margin-top: 2em"
                >
                <template #header>
                    <div class="p-d-flex p-jc-end">
                        <div>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search"/>
                                <InputText v-model="filters['global'].value" 
                                    class="p-inputtext-sm" 
                                    :placeholder="$t('policy_management.search')" 
                                />
                            </span>
                        </div>
                    </div>
                </template>
                    <template #empty>
                        <div class="p-d-flex p-jc-center">
                            <span>{{$t('group_management.active_policy_empty_message')}}</span>
                        </div>
                    </template>
                    <Column field="index" header="#"></Column>
                    <Column field="label" :header="$t('policy_management.policy_name')" style="width:17%"></Column>
                    <Column field="createDate" :header="$t('policy_management.created_date')" style="width:15%"></Column>
                    <Column field="modifyDate" :header="$t('policy_management.modified_date')" style="width:15%"></Column>
                    <Column field="policyVersion" :header="$t('policy_management.version')" style="width:10%"></Column>
                    <Column field="profiles.length" :header="$t('policy_management.number_of_profile')" style="width:10%">
                    </Column>
                    <Column field="description" :header="$t('policy_management.description')" style="width:25%"></Column>
                    <Column :exportable="false">
                        <template #body="slotProps">
                            <div class="p-d-flex p-jc-end" >
                                <Button  class="p-button-sm p-button-rounded"  v-if="domainType=='LDAP'"
                                    icon="pi pi-play"
                                    :title="$t('group_management.apply_policy')" 
                                    @click.prevent="applyPolicyConfirmDialog= true; selectedPolicy = slotProps.data">
                                </Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <template #footer>
            <Button :label="$t('group_management.cancel')" icon="pi pi-times" 
                @click="showDialog = false" class="p-button-text p-button-sm"
            />
        </template>
    </Dialog>

    <AddPolicyExceptionDialog v-if="addPolicyExceptionDialog"
        :addPolicyExceptionDialog="addPolicyExceptionDialog"
        @close-policy-exception-dialog="addPolicyExceptionDialog = false"
        :selectedPolicy="selectedPolicy"
        @addPolicyException="(event) => policyExceptionData = event"
        :selectedPolicyException="policyExceptionData? policyExceptionData.members: []"
    >
    </AddPolicyExceptionDialog>
    </div>
</template>

<script>
/**
 * Active policy list for apply to selected user group
 * @see {@link http://www.liderahenk.org/}
*/

import {FilterMatchMode} from 'primevue/api';
import { policyService } from "../../../../services/PolicyManagement/PolicyService.js";
import AddPolicyExceptionDialog from "./AddPolicyExceptionDialog.vue"
import { adManagementService } from "../../../../services/UserManagement/AD/AdManagement.js"

export default {
    components: {
        AddPolicyExceptionDialog
    },
     props: {
        applyPolicyDialog: {
            type: Boolean,
            default: false,
        },
        selectedNode: {
            type: Object,
            description: "selected node",
        },
    },

    data() {
        return {
            policies: [],
            applyPolicyConfirmDialog: false,
            selectedPolicy: null,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            addPolicyExceptionDialog: false,
            policyExceptionData: null,
            domainType: 'LDAP',
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.applyPolicyDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closePolicyDialog');
                }
            }
        },
    },

    mounted() {
        this.activePolicy();
        this.created();
    },

    methods:{
        updateRowIndex() {
            for (let index = 0; index < this.policies.length; index++) {
                const element = this.policies[index];
                element.index = index + 1;
            }
        },
        async activePolicy(){
            const{response,error} = await policyService.policyActivePolicy();
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('policy_management.get_policy_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    if (response.data) {
                        this.policies = response.data;
                        this.updateRowIndex();
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('policy_management.error_417_get_policy'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
        },

        async created() {
            const{ response,error } =  await adManagementService.configuration();
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.ad.error_configuraton'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    if (response.data) {

                        this.domainType = response.data.domainType;
                        if (this.domainType == "ACTIVE_DIRECTORY") {
                            this.selectedTab = "ad-management";
                        }
                    }
                }else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.ad.error_417_configuration'),
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }

        },

        async applyPolicy() {
            let dnList = [];
            dnList.push(this.selectedNode.distinguishedName);
            let params = {
                "id": this.selectedPolicy.id,
                "dnType": this.selectedNode.type,
                "dnList": dnList,
			};

            if (this.policyExceptionData && this.policyExceptionData.members.length > 0) {
                const{response,error} = await  policyService.addPolicyException(this.policyExceptionData);
                if(error){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('group_management.delete_member_error_message')+ " \n"+error, 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    this.addPolicyExceptionDialog = false;
                }
            }

            const {response,error} = await policyService.policyExecute(params);
            if(error) {
                console.log("burda")
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('group_management.apply_policy_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else {
                if(response.status == 200){
                    if (response.data) {
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('group_management.apply_policy_success'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                        this.$emit('appliedPolicy', this.selectedPolicy);
                        this.selectedPolicy = null;
                    } 
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('policy_management.error_417_apply_policy'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
            
            this.applyPolicyConfirmDialog = false;
        }
    },
    
}
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-paginator-current {
        margin-left: auto;
    }
}
::v-deep(.p-datatable.p-datatable-customers) {
    .p-paginator {
        padding: 1rem;
    }
}

</style>