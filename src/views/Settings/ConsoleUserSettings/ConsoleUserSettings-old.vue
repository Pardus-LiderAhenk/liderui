<template>
    <div class="p-grid">
        <div class="p-col-12">
            <h5>{{$t('settings.console_user_settings.lider_users_and_access_settings')}}</h5>
        </div>
        <div class="p-col-12">
            <TabView>
                <TabPanel :header="$t('settings.console_user_settings.lider_user_management')">
                    <div class="p-grid">
                        <div class="p-col-6">
                            <div class="p-col-12">
                                <DataTable :value="records" responsiveLayout="scroll"
                                    v-model:filters="filters"
                                    v-model:selection="selectedUser"
                                    selectionMode="single"
                                    class="p-datatable-sm"
                                >
                                <template #header>
                                    <div class="p-d-flex p-jc-between">
                                        <h5>{{$t('settings.console_user_settings.existing_console_users')}}</h5>
                                        <Button :label="$t('settings.console_user_settings.add_console_user')"  
                                            class="p-button-sm" icon="pi pi-user-plus"
                                            @click="addConsoleUserModalVisible = true"
                                        />
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
                                                <Button class="p-button-sm p-button-rounded p-mr-2" 
                                                    icon="pi pi-unlock"
                                                    v-tooltip.bottom="$t('settings.console_user_settings.change_password')"
                                                    @click.prevent="selectedUser = slotProps.data; changePasswordDialog = true"/>

                                                <Button class="p-button-danger p-button-sm p-button-rounded" 
                                                    icon="pi pi-trash"
                                                    v-tooltip.bottom="$t('settings.console_user_settings.delete')"
                                                    @click.prevent="selectedUser = slotProps.data; showDeleteConsoleUserDialog = true"/>
                                            </div>
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </div>
                        <div class="p-col-6" v-if="selectedUser">
                            <div class="p-col-12 ">
                                <p style="font-weight:bold">{{$t('settings.console_user_settings.selected_users_roles')}} 
                                    {{selectedUser ? selectedUser.distinguishedName: $t('settings.console_user_settings.please_select')}})
                                </p>
                            </div>
                            <div class="p-col-12 p-d-flex p-jc-end">
                                <Button :label="$t('settings.console_user_settings.save')" @click="showUpdateConsoleUserRolesDialog=true"/>
                            </div>
                            <DataTable :value="roles" responsiveLayout="scroll">
                                <Column header="#">
                                    <template #body="slotProps">
                                        <p>{{slotProps.index + 1}}</p>
                                    </template>
                                </Column>
                                <Column field="name" :header="$t('settings.console_user_settings.role_name')"></Column>
                                <Column :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                    <InputSwitch 
                                        :modelValue="selectedUser ? (selectedUser.attributesMultiValues.liderPrivilege.includes(slotProps.data.value) ? true : false) : false"  
                                        @change="roleSwitchChanged(slotProps.data)"
                                    />
                                    </template>
                                 </Column>
                            </DataTable>
                        </div>
                        <div class="p-col-6 p-d-flex" v-if="selectedUser === null">
                            <p 
                            style="width:100%;text-align:center;" 
                            class="p-as-center p-ai-center p-ac-center">
                                {{$t('settings.console_user_settings.please_select_the_user_whose_privileges_you_want_to_edit')}}</p>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel :header="$t('settings.console_user_settings.lider_user_directory_access_settings')">
                    <div class="p-grid">
                        <div class="p-col-3">
                            <tree-component 
                                ref="groupstree"
                                loadNodeUrl="/api/lider/user-groups/groups"
                                loadNodeOuUrl="/api/lider/user-groups/ou-details"
                                :treeNodeClick="setSelectedGroupNode"
                                :searchFields="searchFields"
                            />
                        </div>
                        <div class="p-col-3">
                            <div class="p-col-12">
                                <p>{{$t('settings.console_user_settings.group_member')}}</p>
                            </div>
                            <DataTable :value="groupMembers" responsiveLayout="scroll">
                                <Column header="#">
                                    <template #body="slotProps">
                                        <p>{{slotProps.index + 1}}</p>
                                    </template>
                                </Column>
                                <Column field="uid" :header="$t('settings.console_user_settings.member_dn')"></Column>
                            </DataTable>
                        </div>
                        <div class="p-col-6">
                            <div class="p-col-12 p-d-flex p-jc-end">
                                <Button type="button" :label="$t('settings.console_user_settings.add_new_authority_group')" 
                                    icon="pi pi-angle-down" iconPos="right" @click="toggle" 
                                />
                                <Menu ref="menu" :model="privilegeActions" :popup="true" />
                            </div>
                            <DataTable :value="groupPrivilages" responsiveLayout="scroll">
                                <Column header="#">
                                    <template #body="slotProps">
                                        <p>{{slotProps.index + 1}}</p>
                                    </template>
                                </Column>
                                <Column field="accessDN" :header="$t('settings.console_user_settings.access_granted_dn')"></Column>
                                <Column :header="$t('settings.console_user_settings.authorization')">
                                    <template #body="slotProps">
                                        {{
                                            slotProps.data != null && slotProps.data.accessType == "write" ? $t('settings.console_user_settings.read_and_write') : $t('settings.console_user_settings.read')
                                        }}
                                    </template>
                                </Column>
                                <Column :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-outlined"  
                                            @click="showAccessPermissionUserDeleteDialog = true; selectedOlcAccess = slotProps.data"
                                        />
                                    </template>
                                 </Column>
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </div>
    </div>

    <agents-dialog 
        :modalVisibleValue="agentsModalVisible" 
        @modalVisibleValue="agentsModalVisible = $event;"
        @addOlcAccessRule="addOlcAccessRule"
     />

     <agent-group-dialog 
        :modalVisibleValue="agentGroupModalVisible" 
        @modalVisibleValue="agentGroupModalVisible = $event;"
        @addOlcAccessRule="addOlcAccessRule"
     />
     <user-dialog 
        :modalVisibleValue="userModalVisible" 
        @modalVisibleValue="userModalVisible = $event;"
        @addOlcAccessRule="addOlcAccessRule"
     />
     <user-group-dialog 
        :modalVisibleValue="userGroupModalVisible" 
        @modalVisibleValue="userGroupModalVisible = $event;"
        @addOlcAccessRule="addOlcAccessRule"
     />
     <role-dialog 
        :modalVisibleValue="roleGroupModalVisible" 
        @modalVisibleValue="roleGroupModalVisible = $event;"
        @addOlcAccessRule="addOlcAccessRule"
     />
     <add-console-user-dialog 
        @updateConsoleUsers="getConsoleUsers"
        :modalVisibleValue="addConsoleUserModalVisible" 
        @modalVisibleValue="addConsoleUserModalVisible = $event;"
     />
    
    
    <LiderConfirmDialog 
        :showDialog="showDeleteConsoleUserDialog"
        @showDialog="showDeleteConsoleUserDialog = $event;"
        :header="$t('settings.console_user_settings.console_user_authorization_deletion')"
        :message="$t('settings.console_user_settings.console_user_authorization_deletion_question')"
        @accepted="deleteConsoleUser"
    />

    <LiderConfirmDialog 
        :showDialog="showUpdateConsoleUserRolesDialog"
        @showDialog="showUpdateConsoleUserRolesDialog = $event;"
        :header="$t('settings.console_user_settings.authority_update')"
        :message="$t('settings.console_user_settings.authority_update_question')"
        @accepted="updateUserRoles"
    />

    <LiderConfirmDialog 
        :showDialog="showAccessPermissionUserDeleteDialog"
        @showDialog="showAccessPermissionUserDeleteDialog = $event;"
        :header="$t('settings.console_user_settings.console_user_permission_deletion_question')"
        :message="$t('settings.console_user_settings.console_user_permission_deletion_question')"
        @accepted="deleteOlcAccessRule"
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

</template>

<script>

import TreeComponent from '@/components/Tree/TreeComponent.vue';
import AgentsDialog from './Dialogs/AgentsDialog.vue';
import AgentGroupDialog from './Dialogs/AgentGroupsDialog.vue';
import UserDialog from './Dialogs/UsersDialog.vue';
import UserGroupDialog from './Dialogs/UserGroupsDialog.vue';
import RoleDialog from './Dialogs/RoleGroupsDialog.vue';
import AddConsoleUserDialog from './Dialogs/AddConsoleUserDialog.vue';
import { consoleUserSettingsService } from "../../../services/Settings/ConsoleUserSettingsService.js";
import { userService } from '../../../services/Settings/UserService';
import PasswordComponent from '@/components/Password/PasswordComponent.vue';

export default {
    components: {
        TreeComponent,
        AgentsDialog,
        AgentGroupDialog,
        UserDialog,
        UserGroupDialog,
        RoleDialog,
        AddConsoleUserDialog,
        PasswordComponent,
    },
    data(){
        return {
            selectedUser: null,
            records: [
                {}
            ],
            roles: [],
            groupMembers: [],
            groupPrivilages: [],
            privilegeActions: [
                {
    				label: this.$t('settings.console_user_settings.computers'),
    				icon: 'fas fa-desktop',
    				command: () => {
    					this.agentsModalVisible = true;
    				}
    			},
                 {
    				label: this.$t('settings.console_user_settings.users'),
    				icon: 'fas fa-user',
    				command: () => {
    					this.userModalVisible = true;
    				}
    			},
                {
    				label: this.$t('settings.console_user_settings.computers_groups'),
    				icon: 'fas fa-network-wired',
    				command: () => {
    					this.agentGroupModalVisible = true;
    				}
    			},
                {
    				label: this.$t('settings.console_user_settings.users_groups'),
    				icon: 'fas fa-users',
    				command: () => {
    					this.userGroupModalVisible = true;
    				}
    			},
                {
    				label: this.$t('settings.console_user_settings.role_users'),
    				icon: 'fas fa-user-cog',
    				command: () => {
    					this.roleGroupModalVisible = true;
    				}
    			},
            ],
            agentsModalVisible: false,
            agentGroupModalVisible: false,
            userModalVisible:false,
            userGroupModalVisible:false,
            roleGroupModalVisible:false,
            addConsoleUserModalVisible:false,
            showDeleteConsoleUserDialog:false,
            showChangePasswordConsoleUserDialog:false,
            showUpdateConsoleUserRolesDialog: false,
            showAccessPermissionUserDeleteDialog:false,
            showAccessPermissionUserChangePasswordDialog:false,
            changePasswordDialog: false,
            userPassword: null,
            selectedGroupNode:null,
            searchFields: [
                {
                    key: this.$t('tree.name'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
            ],
            selectedOlcAccess: null
        }
    },  
    mounted() {
        this.getRoles();
        this.getConsoleUsers();
    },

    methods: {
        toggle(event) {
            this.$refs.menu.toggle(event);
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
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.console_user_settings.user_roles_get_successfully'),
                        summary: this.$t('settings.console_user_settings.successful'),
                        life: 3000
                    });
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

        async getConsoleUsers(){
            const { response, error } = await consoleUserSettingsService.getConsoleUsers();
                if (error){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.an_unexpected_problem_was_encountered'),
                        summary: this.$t('settings.console_user_settings.error'),
                        life: 3000
                    });
                }
                else{
                    if(response.status == 200){
                        this.records = response.data;
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
        },

        async updateUserRoles() {
            this.showUpdateConsoleUserRolesDialog = false;
            if(this.selectedUser) {
                var data = new FormData();
                data.append('dn', this.selectedUser.distinguishedName);
                data.append('roles[]', this.selectedUser.attributesMultiValues.liderPrivilege);
                

                const { response,error } = await consoleUserSettingsService.editUserRoles(data);
                if(error) {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.please_select_the_user_you_want_to_be_authorized'),
                        summary: this.$t('settings.console_user_settings.error'),
                        life: 3000
                    });
                }
                else {
                    if(response.status == 200){
                        this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.console_user_settings.users_role_successfully_update'), 
                        summary: this.$t('settings.console_user_settings.successful'), 
                        life: 3000
                    });
                    // FIXME 
                    this.getConsoleUsers();

                    }

                    else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.console_user_settings.error_417_edit_user_roles'),
                            summary: this.$t('settings.console_user_settings.error'),
                            life: 3000
                        });
                    }                      
                }
            }
        },

        roleSwitchChanged(data) {
            if (this.selectedUser) {
                if (this.selectedUser.attributesMultiValues.liderPrivilege.includes(data.value)) {
                    this.selectedUser.attributesMultiValues.liderPrivilege = this.selectedUser.attributesMultiValues.liderPrivilege.filter(val => val != data.value);
                } else {
                    this.selectedUser.attributesMultiValues.liderPrivilege.push(data.value);
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
                const{response,error} = await userService.updatePasswd(params);
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

        setSelectedGroupNode(node) {
            this.groupMembers = [];
            this.selectedGroupNode = node;
            node.attributesMultiValues.member.forEach((mem,index) => {
                this.groupMembers.push({
                    id : index + 1,
                    uid : mem
                })
            });
            this.getOlcAccessRules();
        },
        async deleteOlcAccessRule() {
            this.showAccessPermissionUserDeleteDiolog = false;
            this.selectedOlcAccess = this.groupPrivilages.filter(p => p.accessDN === this.selectedOlcAccess.accessDN);
            if(this.selectedOlcAccess && this.selectedOlcAccess.length > 0) {
                const { response,error } = await consoleUserSettingsService.deleteOLCAccessRule(this.selectedOlcAccess[0]);
                if(response.status == 200) {
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.console_user_settings.olc_success_rule_deleted'),
                        summary: this.$t('settings.console_user_settings.successful'),
                        life: 3000
                    });
                    this.selectedOlcAccess = null;
                    this.getOlcAccessRules();
                }
                else{
                    if(error){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.console_user_settings.error_olc_rule_deleted'),
                            summary: this.$t('settings.console_user_settings.error'), 
                            life: 3000
                        });
                    }
                    else if(response.status = 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.console_user_settings.error_417_olc_rule_deleted'),
                            summary: this.$t('settings.console_user_settings.error'), 
                            life: 3000
                        });
                    }
                }
            }
        }, 

        async addOlcAccessRule(olcAccessDn, accessType) {
            let data = new FormData();
            data.append('type', 'computers');
            data.append('groupDN', this.selectedGroupNode.distinguishedName);
            data.append('olcAccessDN', olcAccessDn, );
            data.append('accessType',accessType);


            const { response,error } = await consoleUserSettingsService.addOLCAccessRule(data);
            if (response.status === 200) {
                if(response.data) {
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.console_user_settings.access_authorization_added_successfully'),
                        summary: this.$t('settings.console_user_settings.successful'),
                        life: 3000
                    });
                    this.getOlcAccessRules();
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.an_error_occurred_while_adding_access_authorization'),
                        summary: this.$t('settings.console_user_settings.error'),
                        life: 3000
                    });
                }
            }
        },

        async getOlcAccessRules() {
            if(this.selectedGroupNode) {
                let data = new FormData();
                data.append('dn',this.selectedGroupNode.distinguishedName);

                const { response,error} = await consoleUserSettingsService.getOLCAccessRule(this.selectedGroupNode.distinguishedName);
                if(response.status == 200){
                    this.groupPrivilages = response.data
                    
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('settings.console_user_settings.olc_access_rule_get'),
                        summary: this.$t('settings.console_user_settings.successful'),
                        life: 3000
                    });

                }
                else{
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.error_417_olc_access_rule'),
                        summary: this.$t('settings.console_user_settings.error'),
                        life: 3000
                    });
                    }                    
                }
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
    }
   
}
</script>
