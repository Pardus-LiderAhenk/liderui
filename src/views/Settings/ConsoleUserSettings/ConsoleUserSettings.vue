<template>
    <div>
        <Card>
            <template #title>{{ $t('settings.console_user_settings.lider_user_management') }}</template>
            <!-- <template #subtitle>Lider arayüz menü erişim ve dizin erişim ayarları</template> -->

            <template #content>
                <div class="p-grid">
                    <div class="p-col-12 p-md-6 p-lg-2">
                        <PanelMenu class="sideMenu" :model="settingsMenu" />
                    </div>
                    <div class="p-col-12 p-md-6 p-lg-10">
                        <MenuAccessSettings  v-show="displayName === 1"/>
                        <DirectoryAccessSettings  v-show="displayName === 2"/>

                    </div>
                </div>
            </template>
        </Card>
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

</template>

<script>

import AgentsDialog from './Dialogs/AgentsDialog.vue';
import AgentGroupDialog from './Dialogs/AgentGroupsDialog.vue';
import UserDialog from './Dialogs/UsersDialog.vue';
import UserGroupDialog from './Dialogs/UserGroupsDialog.vue';
import RoleDialog from './Dialogs/RoleGroupsDialog.vue';
import { consoleUserSettingsService } from "../../../services/Settings/ConsoleUserSettingsService.js";
import MenuAccessSettings from './MenuAccessSettings.vue';
import DirectoryAccessSettings from './DirectoryAccessSettings.vue';

export default {
    components: {
        AgentsDialog,
        AgentGroupDialog,
        UserDialog,
        UserGroupDialog,
        RoleDialog,
        MenuAccessSettings,
        DirectoryAccessSettings
    },
    data(){
        return {
            displayName: 1,
            settingsMenu: [
                {
    				label: this.$t('settings.console_user_settings.menu_access_settings'),
    				command: () => {
    					this.displayName = 1;
    				}
    			},
                {
    				label: this.$t('settings.console_user_settings.directory_access_settings'),
    				command: () => {
    					this.displayName = 2;
    				}
    			}
            ],
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
            showChangePasswordConsoleUserDialog:false,
            showUpdateConsoleUserRolesDialog: false,
            showAccessPermissionUserDeleteDialog:false,
            showAccessPermissionUserChangePasswordDialog:false,
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

    methods: {
        toggle(event) {
            this.$refs.menu.toggle(event);
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
