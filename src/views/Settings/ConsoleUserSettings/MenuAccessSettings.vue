<template>
    <div>
        <Toolbar class="p-field">
            <template #start>
                <h5>{{ $t('settings.console_user_settings.menu_access_settings') }}</h5>
            </template>
            <template #end>
                <Button :label="$t('settings.console_user_settings.add_console_user')"  
                    class="p-button-sm" icon="pi pi-user-plus"
                    @click="addConsoleUserModalVisible = true"
                />
            </template>
        </Toolbar>
        <DataTable :value="records" responsiveLayout="scroll"
            v-model:filters="filters"
            class="p-datatable-sm p-field"
            :loading="loading"
            :paginator="true" :rows="10" ref="dt"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
            :rowsPerPageOptions="[10,25,50,100]" style="margin-top: 2em"
        >
            <template #header>
                <div class="p-d-flex p-jc-between">
                    <h5>{{$t('settings.console_user_settings.existing_console_users')}}</h5>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"/>
                        <InputText v-model="filters['global'].value" 
                        class="p-inputtext-sm" 
                        :placeholder="$t('settings.console_user_settings.search')" 
                        />
                    </span>
                </div>
            </template>
            <template #empty>
                <div class="p-d-flex p-jc-center">
                    <span>Not found user</span>
                </div>
            </template>
            <Column header="#">
                <template #body="slotProps">
                    <p>{{slotProps.index + 1}}</p>
                </template>
            </Column>
            <Column field="uid" header="UID"></Column>
            <Column field="distinguishedName" :header="$t('settings.console_user_settings.registiration_dn')"></Column>
            <Column>
                <template #body="slotProps">
                    <div class="p-d-flex p-jc-end">
                        <Button class="p-button-sm p-button-rounded p-button-secondary p-mr-2" 
                            icon="pi pi-sitemap"
                            v-tooltip.bottom="$t('settings.console_user_settings.edit_directory_settings')"
                            @click.prevent="selectedUser = slotProps.data; showUserDirectoryAccessSettingsDialog = true"
                        />
                        <Button class="p-button-sm p-button-rounded p-mr-2" 
                            icon="pi pi-cog"
                            v-tooltip.bottom="$t('settings.console_user_settings.edit_menu_settings')"
                            @click.prevent="selectedUser = slotProps.data; menuRoleDialog = true"
                        />
                        <Button class="p-button-sm p-button-rounded p-button-warning p-mr-2" 
                            icon="pi pi-unlock"
                            v-tooltip.bottom="$t('settings.console_user_settings.change_password')"
                            @click.prevent="selectedUser = slotProps.data; changePasswordDialog = true"
                        />
                        <Button class="p-button-sm p-button-rounded p-mr-2" 
                            icon="pi pi-users"
                            v-tooltip.bottom="$t('settings.console_user_settings.users_groups')"
                            @click.prevent="selectedUser = slotProps.data; userGroupDialog = true"
                        />

                        <Button class="p-button-danger p-button-sm p-button-rounded" 
                            icon="pi pi-trash"
                            v-tooltip.bottom="$t('settings.console_user_settings.delete')"
                            @click.prevent="selectedUser = slotProps.data; showDeleteConsoleUserDialog = true"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
        <MenuRoleDialog v-if="menuRoleDialog"
            :menuRoleDialog="menuRoleDialog"
            :selectedUser="selectedUser"
            :roles="roles"
            @close-menu-role-dialog="menuRoleDialog=false"
            @updated-user-role="updatedUserRole"
        ></MenuRoleDialog>

        <LiderConfirmDialog 
            :showDialog="showDeleteConsoleUserDialog"
            @showDialog="showDeleteConsoleUserDialog = $event;"
            :header="$t('settings.console_user_settings.console_user_authorization_deletion')"
            :message="$t('settings.console_user_settings.console_user_authorization_deletion_question')"
            @accepted="deleteConsoleUser"
        />
        <LiderConfirmDialog 
            :showDialog="showChangePasswordConsoleUserDialog"
            @showDialog="showChangePasswordConsoleUserDialog = $event;"
            :header="$t('settings.console_user_settings.console_user_change_password')"
            :message="$t('settings.console_user_settings.console_user_change_password_question')"
            @accepted="updatePassword"
    />

        <!-- password change dialog -->
        <Dialog 
            :header="$t('settings.console_user_settings.change_password')" 
            v-model:visible="changePasswordDialog"  
            :modal="true" 
            @hide="changePasswordDialog = false">
            <div>
                <password-component ref="password"></password-component>
            </div>
            <template #footer>
            <Button 
                :label="$t('settings.console_user_settings.cancel')" 
                icon="pi pi-times" 
                @click="changePasswordDialog = false" 
                class="p-button-text p-button-sm"
            />
            <Button 
                :label="$t('settings.console_user_settings.change_password')" 
                icon="pi pi-unlock" 
                @click="showUpdatePasswordDialog"
                class="p-button-sm"
            />
            </template>
        </Dialog>
        <add-console-user-dialog v-if="addConsoleUserModalVisible"
            @updateConsoleUsers="getConsoleUsers"
            :modalVisibleValue="addConsoleUserModalVisible" 
            @modalVisibleValue="addConsoleUserModalVisible = $event;"
            @addedConsoleUsers="addedConsoleUser"
        />

        <user-directory-access-settings-dialog v-if="showUserDirectoryAccessSettingsDialog"
            :showUserDirectoryAccessSettingsDialog="showUserDirectoryAccessSettingsDialog"
            @closeUserDirectoryAccessSettingsDialog="showUserDirectoryAccessSettingsDialog=false"
            :selectedUserNode="selectedUser"
            @addedUserToGroup="addedUserToGroup"
        >
        </user-directory-access-settings-dialog>

        <selected-user-groups v-if="userGroupDialog"
            :userGroupDialog="userGroupDialog"
            :selectedUser="selectedUser"
            @closeUserGroupDialog="userGroupDialog = false"
        >
        </selected-user-groups>
    </div>
</template>


<script>
import { consoleUserSettingsService } from "../../../services/Settings/ConsoleUserSettingsService.js";
import MenuRoleDialog from "./Dialogs/MenuRoleDialog.vue";
import PasswordComponent from '@/components/Password/PasswordComponent.vue';
import AddConsoleUserDialog from './Dialogs/AddConsoleUserDialog.vue';
import UserDirectoryAccessSettingsDialog from "./Dialogs/UserDirectoryAccessSettingsDialog.vue";
import {FilterMatchMode} from 'primevue/api';
import SelectedUserGroups from "./Dialogs/SelectedUserGroups.vue";


export default {

    components: {
        MenuRoleDialog,
        PasswordComponent,
        AddConsoleUserDialog,
        UserDirectoryAccessSettingsDialog,
        SelectedUserGroups
    },

    data() {
        return {
            loading: false,
            selectedUser: null,
            records: [],
            addConsoleUserModalVisible: false,
            roles: [],
            menuRoleDialog: false,
            showDeleteConsoleUserDialog:false,
            changePasswordDialog: false,
            showUserDirectoryAccessSettingsDialog: false,
            showChangePasswordConsoleUserDialog:false,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            userGroupDialog: false
        }
    },

    methods: {
        addedUserToGroup() {
            this.$toast.add({
                severity:'success', 
                detail: this.$t('settings.console_user_settings.user_add_to_group'), 
                summary: this.$t('settings.console_user_settings.successful'), 
                life: 3000
            });
            
            this.getConsoleUsers();
        },

        updatedUserRole() {
            this.menuRoleDialog = false;
            this.getConsoleUsers();
        },

        addedConsoleUser() {
            this.addConsoleUserModalVisible = false;
            this.getConsoleUsers();
        },

        async getConsoleUsers(){
            this.loading = true;
            this.showUserDirectoryAccessSettingsDialog = false;
            const { response, error } = await consoleUserSettingsService.getConsoleUsers();
            if (error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.console_user_settings.an_unexpected_problem_was_encountered'),
                    summary: this.$t('settings.console_user_settings.error'),
                    life: 3000
                });
            } else {
                if(response.status == 200){
                    this.records = response.data;
                    this.loading = false;
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.error_417_get_console_user'),
                        summary: this.$t('settings.console_user_settings.error'),
                        life: 3000
                    });
                }
            }      
            this.loading = false;
        },

        async getRoles(){
            const {response,error} = await consoleUserSettingsService.getRoles();
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.console_user_settings.an_unexpected_problem_was_encountered'),
                    summary: this.$t('settings.console_user_settings.user_not_select'),
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.roles = response.data;
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.error_417_get_user_roles'),
                        summary: this.$t('settings.console_user_settings.user_not_select'),
                        life: 3000
                    });
                }
            }
        },

        async deleteConsoleUser() {
            if (this.selectedUser) {
                const { response,error } = await consoleUserSettingsService.deleteConsoleUsers(this.selectedUser.distinguishedName);
                this.getConsoleUsers();
                if(response.status == 200){
                    this.$toast.add({
                        severity:'success', 
                        detail:  this.$t('settings.console_user_settings.user_roles_deleted_successfully'),  
                        summary: this.$t('settings.console_user_settings.successful'), 
                        life: 3000
                    });
                }
                else{
                    if (response.status = 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.console_user_settings.error_417_deleted_user'),
                            summary: this.$t('settings.console_user_settings.error'), 
                            life: 3000
                            });
                    }
                    else if (error){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.console_user_settings.please_select_the_user_whose_authorization_you_want_to_delete'),
                            summary: this.$t('settings.console_user_settings.error'), 
                            life: 3000
                        });
                    }
                }                   
            } 
            else{
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.console_user_settings.please_select_the_user_whose_authorization_you_want_to_delete'),
                    summary: this.$t('settings.console_user_settings.error'), 
                    life: 3000
                });
            }
            this.showDeleteConsoleUserDialog = false;
        }, 

        async updatePassword(){
            let params = new FormData();
            params.append("distinguishedName", this.selectedUser.distinguishedName);
            params.append("userPassword", this.userPassword);

            if (this.selectedUser) {
                const{response,error} = await consoleUserSettingsService.updatePasswd(params);
                if(error){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.change_user_password_error')+ " \n"+error, 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                else{
                    if(response.status == 200){
                        this.$emit('updatedUser', response.data);
                        this.changePasswordDialog = false;
                        this.userPassword = null;
                        this.$refs.password.setPasswordForm('', '');
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('user_management.change_user_password_success'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                    else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.console_user_settings.error_417_change_password'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
            }
            else{
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.console_user_settings.error_change_password'),
                    summary: this.$t('computer.task.toast_summaryta'), 
                    life: 3000
                });
            }
            this.showChangePasswordConsoleUserDialog = false;
        },
        showUpdatePasswordDialog() {
            if (this.selectedUser && this.selectedUser.type === "USER") {
                this.userPassword = this.$refs.password.getPassword();
                if (this.userPassword) {
                    this.showChangePasswordConsoleUserDialog = true;
                }
            } else {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.select_user_warn'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
        },
    },

    mounted() {
        this.getConsoleUsers();
        this.getRoles();
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