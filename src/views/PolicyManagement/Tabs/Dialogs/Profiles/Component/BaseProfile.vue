<template>
    <div>
        <!-- Delete Profile Dialog -->
        <Dialog :header="$t('policy_management.delete_profile')" v-model:visible="showDeleteProfileDialog" 
            :style="{width: '20vw'}" :modal="true">
            <div class="p-fluid">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    {{$t('policy_management.delete_profile_warn') }}
                </span>
            </div>
            <div class="p-fluid">
                <p></p>
                <small>
                    Bu profili içeren tüm politikalardan da silinecektir.
                </small>
            </div>
            <template #footer>
                <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                    @click="showDeleteProfileDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('policy_management.yes')" icon="pi pi-check"
                    @click="deleteProfile" class="p-button-sm"
                />
            </template>
        </Dialog>
        <!-- Delete Profile Dialog End -->

        <!-- Plugin profile dialog -->
        <Dialog :header="profileTitle" 
            v-model:visible="showPluginProfileDialog"
            :style="dialogStyle" :modal="true">
            <div class="p-fluid p-grid p-field p-formgrid">
                <div class="p-field p-col-12 p-md-4">
                    <label for="label">{{$t('policy_management.profile_name')}}</label>
                    <InputText :class="validation.label ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" type="text" v-model="label"/>
                    <small v-if="validation.label" class="p-error">
                        {{ $t('policy_management.profile_name_warn')}}
                    </small>
                </div>
                <div class="p-field p-col-12 p-md-8">
                    <label for="description">{{$t('policy_management.description')}}</label>
                    <InputText type="text" class="p-inputtext-sm" v-model="description"/>
                </div>
                <div class="p-field p-col-12 p-md-12">
                    <!-- This slot tag contain plugin profile page -->
                    <slot>
                        <p> Profile Page Content </p>
                    </slot>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                    @click="showPluginProfileDialog = false" class="p-button-text p-button-sm">
                </Button>
                <Button  v-if="dialogType == 'add'"
                    :label="$t('policy_management.save')" icon="pi pi-save"
                    @click="$emit('saveProfile');" class="p-button-sm">
                </Button>
                <Button v-if="dialogType == 'update'"
                    :label="$t('policy_management.update')" 
                    icon="pi pi-refresh"
                    @click="$emit('updateProfile');" class="p-button-sm">
                </Button>
            </template>
        </Dialog>
        <!-- Plugin profile dialog end-->
        <Toolbar class="mb-4">
            <template #end>
                <Button 
                    class="p-button-sm" 
                    icon="pi pi-plus" 
                    :label="$t('policy_management.add')"
                    @click="showAddProfileDialog">
                </Button>
            </template>
        </Toolbar>
        <DataTable :value="profiles" responsiveLayout="scroll" 
            v-model:filters="filters" class="p-datatable-sm"
            :scrollable="true" scrollHeight="400px">
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
                    <span>{{$t('policy_management.profile_table_empty_message')}}</span>
                </div>
            </template>
            <Column field="index" header="#"></Column>
            <Column field="label" :header="$t('policy_management.profile_name')" style="min-width:20%"></Column>
            <Column field="createDate" :header="$t('policy_management.created_date')" style="min-width:20%"></Column>
            <Column field="modifyDate" :header="$t('policy_management.modified_date')" style="min-width:20%"></Column>
            <Column field="description" :header="$t('policy_management.description')" style="min-width:25%"></Column>
            <Column :exportable="false" style="flex: 0 0 4rem">
                <template #body="slotProps">
                    <div class="p-d-flex p-jc-end">
                        <Button class="p-mr-2 p-button-sm p-button-rounded p-button-warning" 
                            icon="pi pi-pencil"  
                            :title="$t('policy_management.edit')" 
                            @click.prevent="showUpdateProfileDialog(slotProps.data)">
                        </Button>
                        <Button class="p-button-sm p-button-rounded p-button-danger" 
                            icon="pi pi-trash"  
                            :title="$t('policy_management.delete')" 
                            @click.prevent="showDeleteProfileDialog = true; selectedProfile = slotProps.data">
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
/**
 * Base Profile Component. This component is child for other profile. Use to base-profile for created user profile.
 * @see {@link http://www.liderahenk.org/}
* emits this event
* @event addProfile used to add new profile. Show add profile dialog
* @event saveProfile used to save new profile
* @event editProfile used to edit selected profile. Show edit profile dialog
* @event updateProfile used to update selected profile
* @function saveProfile used to save profile by parent component with ref
* @function updateProfile used to update profile by parent component with ref
*/

import {FilterMatchMode} from 'primevue/api';
import { profilesServices } from '../../../../../../services/PolicyManagement/Profiles.js';

export default {

    data(){
        return{
            dialogType: "add",
            profiles: [],
            profileTitle: this.$t('policy_management.add_profile'),
            label:'',
            description: '',
            showPluginProfileDialog: false,
            showDeleteProfileDialog: false,
            selectedProfile: null,
            validation: {
                label: false,
            },
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
        }
    },

    props: {
        pluginProfile: {
            type: Object,
            default: null,
            description: "Profile object"
        },
        dialogStyle: {
            default: {width: '50vw'},
            description: "dialog with"
        },
    },

    mounted(){
        this.getProfile();
    },

    methods: {
        toggle(event) {
            this.$refs.opBaseProfile.toggle(event);
        },

        async getProfile() {
            let params = new FormData();
            params.append("name", this.pluginProfile.plugin.name)

            const{response,error} = await profilesServices.list(params);
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
                        this.updateRowIndex();
                    } 
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('policy_management. error_417_get_profile'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
        },

        updateRowIndex() {
            for (let index = 0; index < this.profiles.length; index++) {
                const element = this.profiles[index];
                element.index = index + 1;
            }
        },

        showUpdateProfileDialog(profile) {
            this.dialogType = "update";
            this.selectedProfile = profile;
            this.validation.label = false;
            this.profileTitle = this.$t('policy_management.edit_selected_profile');
            this.label = profile.label;
            this.description = profile.description;
            this.showPluginProfileDialog = true;
            this.$emit('editProfile', profile);
        },

        showAddProfileDialog() {
            this.dialogType = "add";
            this.$emit('addProfile');
            this.validation.label = false;
            this.profileTitle = this.$t('policy_management.add_profile');
            this.label = "";
            this.description = "";
            this.showPluginProfileDialog = true;
        },
        
        // this function is called with ref given by base plugin.
        async  saveProfile(profileData) {
            if (!this.label.trim()) {
                this.validation.label = true;
                return;
            }
            let params = {
                "label": this.label,
                "description": this.description,
                "profileData": profileData,
                "plugin": this.pluginProfile.plugin
			};

            const{response,error} = await profilesServices.add(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('policy_management.add_profile_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    if (response.data) {
                        this.showPluginProfileDialog = false;
                        this.profiles.push(response.data);
                        this.updateRowIndex();
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('policy_management.add_profile_success'),
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    } 
                }
                else if(response.status == 417){
                    this.$toast.add({
                    severity:'error', 
                    detail: this.$t('policy_management.error_417_add_policy'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                }
            }
        },

    // this function is called with ref given by base plugin for updated selected profile.
        async updateProfile(profileData) {
            if (!this.label.trim()) {
                this.validation.label = true;
                return;
            }
            let params = {
                "label": this.label,
                "description": this.description,
                "profileData": profileData,
                "id": this.selectedProfile.id
			};

            const{response,error} = await profilesServices.update(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('policy_management.update_profile_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }else{
                if(response.status == 200){
                    if (response.data) {
                        this.showPluginProfileDialog = false;
                        this.profiles = this.profiles.filter(profile => profile.id != response.data.id);
                        this.profiles.push(response.data);
                        this.updateRowIndex();
                        this.selectedProfile = null;
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('policy_management.update_profile_success'),
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    } 
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('policy_management.error_417_update_profile'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
        },

        async deleteProfile() {
            
            const{ response,error } = await profilesServices.delete(this.selectedProfile.id);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('policy_management.delete_profile_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status = 200){
                    if (response.data) {
                        this.showDeleteProfileDialog = false;
                        this.profiles = this.profiles.filter(profile => profile.id != response.data.id);
                        this.updateRowIndex();
                        this.selectedProfile = null;
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('policy_management.delete_profile_success'),
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
        }
    },

    watch: {
        label() {
            if (this.label.trim()) {
                this.validation.label = false;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
