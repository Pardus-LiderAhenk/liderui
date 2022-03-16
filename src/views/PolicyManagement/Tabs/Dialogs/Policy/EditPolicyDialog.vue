<template>
    <div>
        <!-- Edit Policy Dialog -->
        <Dialog :header="$t('policy_management.edit')" v-model:visible="showDialog" 
            :modal="true"  ref="editPolicy" :style="{width: '60vw'}" :class="editDialogClass"
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
                        <Dropdown v-model="active" optionValue="value" optionLabel="label"
                            :options="[
                                {label: $t('policy_management.active'), value: true},
                                {label: $t('policy_management.passive'), value: false}
                            ]">
                        </Dropdown>
                    </div>
                </div>
                <div class="p-field p-col-12 p-md-3">
                    <!-- <label for="active">{{ $t('policy_management.profile_list') }}</label> -->
                    <!-- <SplitButton :label="$t('policy_management.add_profile')" 
                        icon="pi pi-plus"
                        @click="save" :model="plugins">
                    </SplitButton> -->
                    <Button type="button" icon="pi pi-plus" 
                        :label="$t('policy_management.add_profile')" 
                        @click="toggle" aria:haspopup="true" 
                        aria-controls="overlay_panel">
                    </Button>
                    <OverlayPanel ref="opProfileList" appendTo="body" 
                        :showCloseIcon="false" 
                        id="overlay_panel" 
                        style="width: 450px" 
                        :breakpoints="{'960px': '75vw'}">
                        <DataTable :value="plugins" responsiveLayout="scroll" class="p-datatable-sm">
                            <Column field="index" header="#"></Column>
                            <Column field="plugin.name" :header="$t('policy_management.profile_name')"></Column>
                            <Column field="plugin.description" :header="$t('policy_management.description')"></Column>
                            <Column :exportable="false">
                                <template #body="slotProps">
                                    <div class="p-d-flex p-jc-end">
                                        <Button class="p-button-sm p-button-rounded" 
                                            icon="pi pi-plus"  
                                            :title="$t('policy_management.add')" 
                                            @click.prevent="addProfile(slotProps.data)">
                                        </Button>
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                    </OverlayPanel>
                </div>
                <div class="p-field">
                    <DataTable :value="profiles" class="p-datatable-sm" ref="dt"
                        style="margin-top: 2em"
                        v-model:filters="filters"
                        responsiveLayout="scroll">
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
                                <span>{{$t('policy_management.poliy_table_empty_message')}}</span>
                            </div>
                        </template>
                        <Column field="index" header="#"></Column>
                        <Column field="label" :header="$t('policy_management.profile_name')" style="width:15%"></Column>
                        <Column field="createDate" :header="$t('policy_management.created_date')" style="width:15%"></Column>
                        <Column field="modifyDate" :header="$t('policy_management.modified_date')" style="width:15%"></Column>
                        <Column field="plugin.name" :header="$t('policy_management.plugin_name')" style="width:15%"></Column>
                        <Column field="description" :header="$t('policy_management.description')" style="width:25%"></Column>
                        <Column :exportable="false" style="width:10%">
                            <template #body="slotProps">
                                <div class="p-d-flex p-jc-end">
                                    <Button class="p-mr-2 p-button-sm p-button-rounded p-button-warning" 
                                        icon="pi pi-pencil"  
                                        :label="$t('policy_management.edit')" 
                                        @click.prevent="deleteProfile(slotProps.data)">
                                    </Button>
                                    <Button class="p-button-danger p-button-sm p-button-rounded" 
                                        icon="pi pi-trash" 
                                        :label="$t('policy_management.delete')"
                                        @click.prevent="">
                                    </Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('policy_management.update')" icon="pi pi-refresh"
                    @click="addFolder" class="p-button-sm"
                />
            </template>
        </Dialog>
        <!-- Edit Policy Dialog End -->
    </div>
</template>

<script>
/**
 * Create user policy 
 * @see {@link http://www.liderahenk.org/}
 * emits these events
 * @event closePolicyDialog
 * @event updatedPolicy
 */

import axios from "axios";
import {FilterMatchMode} from 'primevue/api';


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
            selectedProfile: null,
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
        this.editDialogClass = "p-dialog-maximized";
        axios.post('/getPluginProfileList', {}).then(response => {
            if (response.data) {
                console.log(response.data)
                this.plugins = response.data;
                    this.updateRowIndex(this.plugins);
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    
                }
            } 
        });
    },

    methods: {
        toggle(event) {
            this.$refs.opProfileList.toggle(event);
        },

        addFolder() {
            if (!this.label.trim()) {
                this.validation.label = true;
                return;
            }
            let params = new FormData();
            params.append("parentName", this.selectedNode.distinguishedName);
            params.append("ou", this.folderName);
            axios.post('/policy/update', params).then(response => {
                if (response.data) {
                    this.$emit('appendNode', response.data, this.selectedNode);
                    this.$emit('closeAdDialog');
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.add_folder_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.add_folder_error'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            });
            this.label = '';
            this.description = '';
        },

        updateRowIndex(array) {
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                element.index = index + 1;
            }
        },

        getProfileOfSelectedPolicy(){
            console.log(this.selectedPolicy)
            this.profiles = this.selectedPolicy.profiles;
            this.updateRowIndex(this.profiles);

        }
    },

    watch: {
        selectedPolicy() {
            if (this.selectedPolicy) {
                this.label = this.selectedPolicy.label;
                this.description = this.selectedPolicy.description;
                this.active = this.selectedPolicy.active;
                this.getProfileOfSelectedPolicy();
            }
        }
    }
    
}
</script>

<style lang="scss" scoped>
</style>