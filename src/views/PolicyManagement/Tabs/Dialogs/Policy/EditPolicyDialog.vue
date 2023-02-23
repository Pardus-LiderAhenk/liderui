<template>
    <div>
        <!-- Edit Policy Dialog -->
        <Dialog :header="$t('policy_management.edit_selected_policy')" v-model:visible="showDialog" 
            :modal="true"  ref="editPolicy" :style="{width: '50vw'}" 
            >
            <div class="p-fluid">
                <div class="p-fluid p-grid p-field p-formgrid">
                    <div class="p-field p-col-12 p-md-3">
                        <label for="label">{{$t('policy_management.policy_name')}}</label>
                        <InputText :class="validation.label ? 'p-invalid': ''" type="text" v-model="label"/>
                        <small v-if="validation.label" class="p-error">
                            {{ $t('policy_management.policy_name_warn')}}
                        </small>
                    </div>
                    <div class="p-field p-col-12 p-md-7">
                        <label for="description">{{$t('policy_management.description')}}</label>
                        <InputText type="text" v-model="description"/>
                    </div>
                    <div class="p-field p-col-12 p-md-2">
                        <label for="active">{{ $t('policy_management.status') }}</label>
                        <div>
                            <!-- <InputSwitch title="asd" v-model="active"/> -->
                            <Button value="active" 
                                @click="active = !active"
                                :icon="active?'pi pi-check':'pi pi-ban'"
                                :label="active ? $t('policy_management.active'): $t('policy_management.passive')"
                                :class="active ? 'p-button-success p-button-sm':'p-button-sm p-button-danger'"
                            />
                        </div>
                    </div>
                </div>
                <div class="p-field">
                    <DataTable :value="profiles" class="p-datatable-sm" ref="dt"
                        v-model:filters="filters"
                        rowGroupMode="subheader" groupRowsBy="plugin.name"
                        sortMode="single" sortField="plugin.name" :sortOrder="1"
                        :scrollable="true" scrollHeight="400px"
                        responsiveLayout="scroll" v-model:selection="selectedProfiles"
                        @rowSelect="onRowSelect" :expandableRowGroups="true" v-model:expandedRowGroups="expandedRowGroups">
                        <template #header>
                            <div class="p-d-flex p-jc-between">
                                <div style="text-align: left">
                                    <h5>{{$t('policy_management.profile_list')}}</h5>
                                </div>
                                <div class="p-d-flex p-jc-end">
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
                            <div>
                                <span>{{$t('policy_management.profile_table_empty_message')}}</span>
                            </div>
                        </template>
                        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
                        <Column field="label" :header="$t('policy_management.profile_name')" style="min-width:20%"></Column>
                        <Column field="createDate" :header="$t('policy_management.created_date')" style="min-width:20%"></Column>
                        <Column field="modifyDate" :header="$t('policy_management.modified_date')" style="min-width:20%"></Column>
                        <Column field="description" :header="$t('policy_management.description')" style="min-width:35%"></Column>
                        <template #groupheader="slotProps">
                            <i class="pi pi-cog"></i>&nbsp;
                            <span >{{slotProps.data.plugin.description}}</span>&nbsp;
                            <span >- {{slotProps.data.plugin.name}}</span>
                        </template>
                    </DataTable>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('policy_management.update')" icon="pi pi-refresh"
                    @click="updatePolicy" class="p-button-sm"
                />
            </template>
        </Dialog>
        <!-- Edit Policy Dialog End -->
    </div>
</template>

<script>
/**
 * Updated selected policy dialog. Added profile, updated policy with this dialog
 * @see {@link http://www.liderahenk.org/}
 * emits these events
 * @event closePolicyDialog
 * @event updatedPolicy
 */

import {FilterMatchMode} from 'primevue/api';
import { policyService } from "../../../../../services/PolicyManagement/PolicyService.js";
import { profilesServices } from "../../../../../services/PolicyManagement/Profiles.js";

export default {

    props: {
        editPolicyDialog: {
            type: Boolean,
            default: false,
            description: "New policy added",
        },
        selectedPolicy: {
            type: Object,
            description: "selected policy",
            default: null
        },
    },

    data(){
        return{
            editDialogClass: "p-dialog-maximized",
            label:'',
            description: '',
            active: false,
            plugins: [],
            profiles: null,
            selectedProfiles: [],
            expandedRowGroups: null,
            validation: {
                label: false,
            },
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            
        }
    },
    
    computed: {
        showDialog: {
            get () {
                return this.editPolicyDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closePolicyDialog');
                } 
            }
        }
    },

    mounted() {
        // get all profile list by deleted is false
        this.allList();

        if (this.selectedPolicy) {
            this.label = this.selectedPolicy.label;
            this.description = this.selectedPolicy.description;
            this.active = this.selectedPolicy.active;
            this.setCheckBoxForSelectedPolicy();
        }
    },

    methods: {

        toggle(event) {
            this.$refs.opProfileList.toggle(event);
        },

        async allList(){
            const{response,error} = await profilesServices.allList();
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('policy_management.get_profile_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    if (response.data) {
                        this.profiles = response.data;
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('policy_management.error_417_get_profile'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }

        },

        async updatePolicy() {
            if (!this.label.trim()) {
                this.validation.label = true;
                return;
            }
            let params = {
                "active": this.active,
                "label": this.label,
                "description": this.description,
                "profiles": this.selectedProfiles,
                "id": this.selectedPolicy.id
            }
            if (this.active && this.selectedProfiles.length == 0) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('policy_management.selected_profile_warn'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }

            const{response,error} = await policyService.policyUpdate(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('policy_management.update_profile_error'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status === 200){
                    if (response.data) {
                        this.$emit('updatedPolicy', response.data);
                        this.$emit('closePolicyDialog');
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('policy_management.update_profile_success'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    } else {
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('policy_management.update_profile_error'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
                else if(response.status = 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('policy_management.error_417_update_profile'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
            this.label = '';
            this.description = '';
            this.selectedProfiles = [];
        },

        setCheckBoxForSelectedPolicy(){
            for (let index = 0; index < this.selectedPolicy.profiles.length; index++) {
                const element = this.selectedPolicy.profiles[index];
                this.selectedProfiles.push(element)
            }
        },

        onRowSelect(event) {
            this.selectedProfiles = this.selectedProfiles.filter(profile => profile.id != event.data.id);
            if (!this.isExistPluginNameInPolicy(event.data.plugin.name)) {
                this.selectedProfiles.push(event.data);
            } else {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('policy_management.select_profile_warn'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
        },

        isExistPluginNameInPolicy(pluginName) {
            let isExist = false;
            if (this.selectedProfiles.length > 0) {
                for (let index = 0; index < this.selectedProfiles.length; index++) {
                    const element = this.selectedProfiles[index];
                    if (element.plugin.name === pluginName) {
                        isExist = true;
                    }
                }
                return isExist;
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.p-rowgroup-footer td {
    font-weight: 700;
}

::v-deep(.p-rowgroup-header) {
    span {
        font-weight: 700;
    }

    .p-row-toggler {
        vertical-align: middle;
        margin-right: .25rem;
    }
}
::v-deep(.p-datatable .p-column-header-content) {
  .p-checkbox .p-checkbox-box{
    display: none !important
  }
}
::v-deep(.p-datatable .p-column-header-content) {
  pointer-events: none;
}
</style>