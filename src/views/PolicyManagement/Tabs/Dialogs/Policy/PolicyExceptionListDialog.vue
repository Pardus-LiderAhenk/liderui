<template>
    <div>
        <Dialog
            :header="$t('group_management.exception_user_group_list')"
            :modal="true"
            :style="{ width: '50vw'}"
            v-model:visible="showDialog">
            <div class="p-fluid">
                <div class="p-field">
                    <DataTable  
                        :value="members" class="p-datatable-sm"
                        style="margin-top: 2em"
                        v-model:filters="filters"
                        responsiveLayout="stack" :loading="loading"
                        :paginator="true" :rows="10"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        :rowsPerPageOptions="[10,25,50]">
                        <template #header>
                            <div class="p-field p-d-flex p-jc-between">
                                <div>
                                    <Button type="button" class="p-button-sm p-mr-2" v-tooltip.bottom="'Add User'"
                                        @click="addPolicyExceptionDialog = true; type = 'user'"
                                        icon="pi pi-user-plus"
                                    />
                                    <Button type="button" class="p-button-sm" v-tooltip.bottom="'Add Grup'"
                                        @click="addPolicyExceptionDialog = true; type = 'group'"
                                        icon="pi pi-users"
                                    />
                                </div>
                                <div>
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search"/>
                                        <InputText 
                                            v-model="filters['global'].value" 
                                            class="p-inputtext-sm" 
                                            :placeholder="$t('group_management.search')" 
                                        />
                                    </span>
                                </div>
                            </div>
                        </template>
                        <template #empty>
                            <div class="p-d-flex p-jc-center">
                                <span>{{ $t('group_management.member_empty_message') }}</span>
                            </div>
                        </template>
                        <Column header="#" style="width: 10%">
                            <template #body="{index}">
                                <span>{{ index + 1 }}</span>
                            </template>
                        </Column>
                        <Column field="dn" header="Entry DN">
                        </Column>
                        <Column field="createDate" header="Created Date">
                        </Column>
                        <Column :exportable="false" style="width: 10%">
                            <template #body="slotProps">
                                <div class="p-d-flex p-jc-end">
                                    <Button
                                        class="p-button-sm p-button-rounded p-button-danger"
                                        icon="pi pi-trash"
                                        :title="$t('group_management.delete')"
                                        @click.prevent="deletePolicyExceptionConfirm = true; selectedPolicyException = slotProps.data">
                                    </Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
            
            <template #footer>
                <Button 
                    :label="$t('group_management.close')" 
                    icon="pi pi-times"
                    @click="showDialog = false" 
                    class="p-button-text p-button-sm">
                </Button>
            </template>
        </Dialog>

        <Dialog :header="$t('computer.task.toast_summary')" 
            v-model:visible="deletePolicyExceptionConfirm"  
            :modal="true" :style="{width: '20vw'}"
            @hide="deletePolicyExceptionConfirm = false">
            <div class="confirmation-content">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    $t('group_management.selected_record_will_be_excluded')
                </span>
            </div>
            <template #footer>
                <Button 
                    :label="$t('group_management.cancel')" 
                    icon="pi pi-times" 
                    @click="deletePolicyExceptionConfirm = false" 
                    class="p-button-text p-button-sm"
                />
                <Button 
                    :label="$t('group_management.yes')"
                    icon="pi pi-check" 
                    @click="deleteEntryFromPolicyException"
                    class="p-button-sm"
                />
            </template>
        </Dialog>

        <AddPolicyExceptionDialog v-if="addPolicyExceptionDialog"
            :addPolicyExceptionDialog="addPolicyExceptionDialog"
            @close-policy-exception-dialog="addPolicyExceptionDialog = false"
            :selectedPolicy="selectedPolicy"
            @addPolicyException="addPolicyException"
            :type="type"
        >
        </AddPolicyExceptionDialog>
    </div>  
</template>

<script>

/**
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import {FilterMatchMode} from 'primevue/api';
import { policyService } from "../../../../../services/PolicyManagement/PolicyService.js";
import AddPolicyExceptionDialog from "./AddPolicyExceptionDialog.vue"

export default {

    components: {
        AddPolicyExceptionDialog
    },

    props: ["policyExceptionDialogList", "selectedPolicy"],

    data() {
        return {
            members: [],
            filters: {},
            loading: false,
            domainAdminConfirmDialog: false,
            selectedPolicyException: null,
            deletePolicyExceptionConfirm: false,
            addPolicyExceptionDialog: false,
            type: "user"
        }
    },

    created() {
        this.initFilters();
    },

    computed: {
        showDialog: {
            get () {
                return this.policyExceptionDialogList
            },

            set (value) {
                if (!value) {
                    this.$emit('closePolicyExceptionListDialog');
                }
            }
        },
    },

    methods: {
        initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            }
        },

        async getPolicyExceptionOfSelectedPolicy() {

            this.loading = true;
            const{response,error} = await policyService.getPolicyExceptionByPolicy(this.selectedPolicy.id);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: "$t('group_management.error_selected_user_group_list')", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            } else {
                this.members = response.data;
            }
            this.loading = false;
        },

        async deleteEntryFromPolicyException() {
            const{response,error} = await policyService.deletePolicyException(this.selectedPolicyException.id);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: "$t('group_management.error_deleting_policy')", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            } else {
                if (response.status == 200) {
                    this.members = this.members.filter(pe => pe.id != this.selectedPolicyException.id);
                } else if (response.status == 404) {
                    this.$toast.add({
                        severity:'error', 
                        detail: "$t('group_management.selected_policy_found')", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                this.deletePolicyExceptionConfirm = false;
            }
        },

        async addPolicyException(data) {
            if (data && data.members.length > 0) {
                const { response,error } = await  policyService.addPolicyException(data);
                if(error){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('group_management.delete_member_error_message')+ " \n"+error, 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    this.addPolicyExceptionDialog = false;
                } else {
                    this.getPolicyExceptionOfSelectedPolicy();
                }
            }
        }
    },

    mounted() {
        this.getPolicyExceptionOfSelectedPolicy();
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