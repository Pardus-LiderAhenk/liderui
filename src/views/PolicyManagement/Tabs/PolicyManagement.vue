<template>
    <div class="p-grid policy-management">
        <div class="p-col-12 p-md-6 p-lg-12">
            <Card>
                <template #title>
                    {{$t('policy_management.title')}}
                </template>
                <template #content>
                    <p>
                        {{$t('policy_management.explanation')}}
                    </p>
                </template>
            </Card>
         </div>
        <div class="p-col-12 p-md-6 p-lg-12">
            <Card>
                <template #title>
                    <div class="p-d-flex p-jc-between">
                        <div>
                            {{$t('policy_management.policy_list')}}
                        </div>
                        <Button 
                            class="p-button-sm" 
                            icon="pi pi-plus" 
                            :label="$t('policy_management.add')"
                            @click="modals.addPolicyDialog = true">
                        </Button>
                    </div>
                </template>
                 <template #content>
                    <div class="p-grid p-flex-column">
                        <div class="p-col">
                            <DataTable :value="policies" class="p-datatable-sm"
                                :paginator="true" :rows="10" ref="dt"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                                :rowsPerPageOptions="[10,25,50,100]" style="margin-top: 2em"
                                v-model:filters="filters"
                                responsiveLayout="scroll"
                            >
                                <template #header>
                                    <div class="p-d-flex p-jc-end">
                                        <span class="p-input-icon-left">
                                            <i class="pi pi-search"/>
                                            <InputText v-model="filters['global'].value" 
                                                class="p-inputtext-sm" 
                                                :placeholder="$t('policy_management.search')" 
                                            />
                                        </span>
                                    </div>
                                </template>
                                <template #empty>
                                    <div class="p-d-flex p-jc-center">
                                        <span>{{$t('policy_management.policy_table_empty_message')}}</span>
                                    </div>
                                </template>
                                <Column field="index" header="#"></Column>
                                <Column field="label" :header="$t('policy_management.policy_name')" style="width:15%"></Column>
                                <Column field="createDate" :header="$t('policy_management.created_date')" style="width:15%"></Column>
                                <Column field="modifyDate" :header="$t('policy_management.modified_date')" style="width:15%"></Column>
                                <Column field="policyVersion" :header="$t('policy_management.version')" style="width:10%"></Column>
                                <Column field="active" :header="$t('policy_management.status')" style="width:8%">
                                    <template #body="slotProps">
                                        <Badge 
                                            :value="slotProps.data.active ? $t('policy_management.active'): $t('policy_management.passive')" 
                                            :severity="slotProps.data.active ? 'success': 'danger'">
                                        </Badge>
                                    </template>
                                </Column>
                                <Column field="profiles.length" :header="$t('policy_management.number_of_profile')" style="width:7%">
                                </Column>
                                <Column field="description" :header="$t('policy_management.description')" style="width:20%"></Column>
                                <Column :exportable="false">
                                    <template #body="slotProps">
                                        <div class="p-d-flex p-jc-end">
                                            <Button class="p-mr-2 p-button-sm p-button-rounded p-button-warning" 
                                                icon="pi pi-pencil"
                                                :title="$t('policy_management.edit')" 
                                                @click.prevent="editPolicy(slotProps.data)">
                                            </Button>
                                            <!-- <Button class="p-mr-2 p-button-sm p-button-rounded p-button-secondary" 
                                                icon="pi pi-list"
                                                title="Policy Exception List" 
                                                @click.prevent="policyExceptionList(slotProps.data)">
                                            </Button> -->
                                            <Button class="p-button-danger p-button-sm p-button-rounded" 
                                                icon="pi pi-trash" 
                                                :title="$t('policy_management.delete')"
                                                @click.prevent="selectedPolicy = slotProps.data; modals.deletePolicyDialog = true;">
                                            </Button>
                                        </div>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>
                 </template>
            </Card>
        </div>
<!-- Dialogs START -->
        <add-policy-dialog v-if="modals.addPolicyDialog"
            :addPolicyDialog="modals.addPolicyDialog"
            @close-policy-dialog="modals.addPolicyDialog = false"
            @append-policy="appendPolicy">
        </add-policy-dialog>

        <edit-policy-dialog v-if="modals.editPolicyDialog"
            :editPolicyDialog="modals.editPolicyDialog"
            :selectedPolicy="selectedPolicy"
            @updated-policy="updatedPolicy"
            @close-policy-dialog="modals.editPolicyDialog = false">
        </edit-policy-dialog>

        <delete-policy-dialog v-if="modals.deletePolicyDialog"
            :deletePolicyDialog="modals.deletePolicyDialog"
            :selectedPolicy="selectedPolicy"
            @deleted-policy="deletedPolicy"
            @close-policy-dialog="modals.deletePolicyDialog = false">
        </delete-policy-dialog>

    <policy-exception-list-dialog v-if="modals.policyExceptionDialogList"
        :policyExceptionDialogList="modals.policyExceptionDialogList"
        @close-policy-exception-list-dialog="modals.policyExceptionDialogList = false"
        :selectedPolicy="selectedPolicy ? selectedPolicy : null"
    >
    </policy-exception-list-dialog>
<!-- Dialogs END -->
    </div>
</template>

<script>
/**
 * User of group policy management. This page contain update, enable or disable, create new policy and delete policy dialogs.
 * @see {@link http://www.liderahenk.org/}
 */
import {FilterMatchMode} from 'primevue/api';
import AddPolicyDialog from './Dialogs/Policy/AddPolicyDialog.vue'
import EditPolicyDialog from './Dialogs/Policy/EditPolicyDialog.vue'
import DeletePolicyDialog from './Dialogs/Policy/DeletePolicyDialog.vue'
import { policyService } from '../../../services/PolicyManagement/PolicyService.js';
import PolicyExceptionListDialog from './Dialogs/Policy/PolicyExceptionListDialog.vue'

export default {
    data() {
        return {
            policies: null,
            selectedPolicy: null,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            
            modals: {
                addPolicyDialog: false,
                editPolicyDialog: false,
                deletePolicyDialog: false,
                policyExceptionDialogList: false
            },
        }
    },

    components: {
        AddPolicyDialog,
        EditPolicyDialog,
        DeletePolicyDialog,
        PolicyExceptionListDialog
    },

    mounted() {
        this.policyList();
    },

    methods:{

        updateRowIndex() {
            for (let index = 0; index < this.policies.length; index++) {
                const element = this.policies[index];
                element.index = index + 1;
            }
        },

        editPolicy(selectedPolicy){
            this.selectedPolicy = selectedPolicy;
            this.modals.editPolicyDialog = true;
        },

        appendPolicy(policy){
            this.policies.push(policy);
            this.updateRowIndex();
        },

        deletedPolicy(deletedPolicy) {
            this.policies = this.policies.filter(policy => policy.id != deletedPolicy.id);
            this.updateRowIndex();
        },

        updatedPolicy(updatedPolicy) {
            this.policies = this.policies.filter(policy => policy.id != updatedPolicy.id);
            this.policies.push(updatedPolicy);
            this.updateRowIndex();
        },

        async policyList(){
            const{response,error} = await policyService.policyList();
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

        policyExceptionList(selectedPolicy) {
            this.selectedPolicy = selectedPolicy;
            this.modals.policyExceptionDialogList = true;
        },
    }
}
</script>

<style lang="scss" scoped>
.policy-management {
    background-color: #e7f2f8;
}
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
