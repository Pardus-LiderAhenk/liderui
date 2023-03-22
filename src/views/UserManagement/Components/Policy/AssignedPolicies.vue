<template>
    <div>
        <apply-policy v-if="applyPolicyDialog" 
            :selectedNode="selectedNode"
            :applyPolicyDialog="applyPolicyDialog"
            @close-policy-dialog="applyPolicyDialog = false"
            @applied-policy="getAssignedPolices">
        </apply-policy>
    <!-- Detail selected policy dialog start -->
        <Dialog 
            :header="$t('policy_management.detail_selected_policy')" 
            :modal="true" :style="{ width: '40vw'}" @hide="detailPolicyDialog = false"
            v-model:visible="detailPolicyDialog" >
            <div class="p-grid">
                <div class="p-col-4"><b>{{$t('policy_management.policy_name')}}</b></div>
                <div class="p-col-8">{{ selectedPolicy.policyImpl.label }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('policy_management.description')}}</b></div>
                <div class="p-col-8">{{ selectedPolicy.policyImpl.description }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('policy_management.created_date')}}</b></div>
                <div class="p-col-8">{{ selectedPolicy.policyImpl.createDate }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('policy_management.modified_date')}}</b></div>
                <div class="p-col-8">{{ selectedPolicy.policyImpl.modifyDate }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('policy_management.assigned_date')}}</b></div>
                <div class="p-col-8">{{ selectedPolicy.commandExecutionImpl.createDate }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('policy_management.version')}}</b></div>
                <div class="p-col-8">{{ selectedPolicy.policyImpl.policyVersion }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('policy_management.number_of_profile')}}</b></div>
                <div class="p-col-8">{{ selectedPolicy.policyImpl.profiles.length }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>{{$t('policy_management.user_applying')}}</b></div>
                <div class="p-col-8">{{ selectedPolicy.commandImpl.commandOwnerUid }}</div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>Policy Exception</b></div>
                <div class="p-col-8">
                    <Button type="button" class="p-button-link" 
                        :label="$t('group_management.click_exception_list')" 
                        @click="policyExceptionDialogList = true"
                        badgeClass="p-badge-danger"
                        style="margin-left: -10px"
                    />
                </div>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
            </div>
            <template #footer>
                <Button 
                    :label="$t('group_management.cancel')" 
                    icon="pi pi-times" 
                    @click="detailPolicyDialog = false" 
                    class="p-button-text p-button-sm"
                />
            </template>
        </Dialog>
        <!-- Detail selected policy dialog end -->
        <!-- unassign policy confirm dialog start -->
        <Dialog :header="$t('computer.task.toast_summary')" 
            v-model:visible="unassignPolicyDialog"  
            :modal="true" :style="{width: '20vw'}"
            @hide="unassignPolicyDialog = false">
            <div class="confirmation-content">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    {{ $t('policy_management.unassign_policy_confirm_message')}}
                </span>
            </div>
            <template #footer>
                <Button 
                    :label="$t('group_management.cancel')" 
                    icon="pi pi-times" 
                    @click="unassignPolicyDialog = false" 
                    class="p-button-text p-button-sm"
                />
                <Button 
                    :label="$t('group_management.yes')"
                    icon="pi pi-check" 
                    @click="unassignPolicy"
                    class="p-button-sm"
                />
            </template>
        </Dialog>
        <!-- unassign policy confir dialog end -->
        <div>
            <Card>
                <template #title>
                    <div class="p-d-flex p-jc-between">
                        <div style="font-size:15px;">
                            {{ $t("group_management.assigned_policies") }}
                        </div>
                        <div>
                            <Button class="p-button-sm" v-if="selectedNode && selectedNode.type == 'GROUP'"
                                :label="$t('group_management.apply_policy')" 
                                @click="applyPolicyDialog = true"
                                icon="pi pi-play">
                            </Button>
                        </div>
                    </div>
                </template>
                <template #content>
                    <div class="p-fluid">
                        <div class="p-field">
                            <DataTable class="p-datatable-sm" 
                                :value="policies" v-model:filters="filters"
                                responsiveLayout="scroll"
                                :paginator="true" :rows="10" ref="dt"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                                :rowsPerPageOptions="[10,25,50,100]"  style="margin-top: 2em"

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
                                <Column field="policyImpl.label" :header="$t('policy_management.policy_name')" style="min-width:15%"></Column>
                                <Column field="commandExecutionImpl.createDate" :header="$t('policy_management.assigned_date')" style="min-width:15%"></Column>
                                <Column field="policyImpl.policyVersion" :header="$t('policy_management.version')" style="min-width:15%"></Column>
                                <Column field="policyImpl.description" :header="$t('policy_management.description')" style="min-width:25%"></Column>
                                <Column :exportable="false">
                                    <template #body="slotProps">
                                        <div class="p-d-flex p-jc-end">
                                            <Button class="p-mr-2 p-button-sm p-button-rounded" 
                                                icon="pi pi-list"
                                                :title="$t('policy_management.detail_policy')" 
                                                @click.prevent="detailPolicyDialog = true; selectedPolicy = slotProps.data">
                                            </Button>
                                            <Button class="p-button-sm p-button-rounded p-button-danger" 
                                                icon="pi pi-trash"
                                                :title="$t('group_management.delete')" 
                                                @click.prevent="unassignPolicyDialog = true; selectedPolicy = slotProps.data">
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
    <PolicyExceptionListDialog v-if="policyExceptionDialogList"
        :policyExceptionDialogList="policyExceptionDialogList"
        @close-policy-exception-list-dialog="policyExceptionDialogList = false"
        :selectedPolicy="selectedPolicy ? selectedPolicy.policyImpl : null"
    >
    </PolicyExceptionListDialog>
    </div>
</template>

<script>
/**
 * Active policy list for apply to selected user group
 * @see {@link http://www.liderahenk.org/}
*/

import {FilterMatchMode} from 'primevue/api';
import { policyService } from "../../../../services/PolicyManagement/PolicyService.js";
import ApplyPolicy from "./ApplyPolicy.vue";
import PolicyExceptionListDialog from "./PolicyExceptionListDialog.vue"

export default {
    props: {
        selectedNode: {
            type: Object,
            description: "selected node",
        },
    },

    components: {
        ApplyPolicy,
        PolicyExceptionListDialog
    },

    data() {
        return {
            policies: [],
            applyPolicyConfirmDialog: false,
            detailPolicyDialog: false,
            selectedPolicy: null,
            unassignPolicyDialog: false,
            applyPolicyDialog: false,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            policyExceptionDialogList: false
        }
    },

    methods:{
        async getAssignedPolices() {
            const{response,error} = await policyService.policyGroup(this.selectedNode.distinguishedName);
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

        updateRowIndex() {
            for (let index = 0; index < this.policies.length; index++) {
                const element = this.policies[index];
                element.index = index + 1;
            }
        },

        async unassignPolicy() {
            let params = {
                "id": this.selectedPolicy.commandImpl.id,
			};

            const{response,error} = await  policyService.policyUnassigment(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('policy_management.unassign_policy_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                    });
            }
            else{
                if(response.status == 200){
                    if (response.data) {
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('policy_management.unassign_policy_success'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                        this.policies = this.policies.filter(policy => policy.policyImpl.id != this.selectedPolicy.policyImpl.id);
                        this.updateRowIndex();
                        this.selectedPolicy = null;
                    } 
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('policy_management.error_417_unassign_policy'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
            this.unassignPolicyDialog = false;
        },
    },

    // mounted() {
    //     if (this.selectedNode && this.selectedNode.type == "GROUP") {
    //         this.getAssignedPolices();
    //     } else {
    //         this.policies = [];
    //     }
    // },

    watch: {
        selectedNode() {
            if (this.selectedNode && this.selectedNode.type == "GROUP") {
                this.getAssignedPolices();
            } else {
                this.policies = [];
            }
        },
    },
    
}
</script>

<style lang="scss" scoped>
</style>