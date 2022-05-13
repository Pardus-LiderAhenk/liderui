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
                                <h5>{{$t('settings.console_user_settings.existing_console_users')}}</h5>
                            </div>
                            <div class="p-col-12 p-d-flex p-jc-end ">
                                <Button :label="$t('settings.console_user_settings.add_console_user')"  class="p-mr-2" @click="addConsoleUserModalVisible = true"/>
                                <Button :label="$t('settings.console_user_settings.delete_users_console_authority')" @click="showDeleteConsoleUserDialog = true"/>
                            </div>
                            <div class="p-col-12">
                                <DataTable :value="records" responsiveLayout="scroll"
                                    v-model:filters="filters"
                                    v-model:selection="selectedUser"
                                    selectionMode="single"
                                    >
                                    
                                        
                                    <Column header="#">
                                         <template #body="slotProps">
                                            <p>{{slotProps.index + 1}}</p>
                                        </template>
                                    </Column>
                                    <Column field="uid" header="UID"></Column>
                                    <Column field="distinguishedName" :header="$t('settings.console_user_settings.registiration_dn')"></Column>
                                   
                                
                                </DataTable>
                            </div>
                        </div>
                        <div class="p-col-6" v-if="selectedUser">
                            <div class="p-col-12 ">
                                <p style="font-weight:bold">{{$t('settings.console_user_settings.selected_users_roles')}} {{selectedUser ? selectedUser.distinguishedName: $t('settings.console_user_settings.please_select')}})</p>
                            </div>
                            <div class="p-col-12 p-d-flex p-jc-end">
                                <Button :label="$t('settings.console_user_settings.save')" @click="showUpdateConsoleUserRolesDialog=true"/>
                            </div>
                            <DataTable :value="roles" responsiveLayout="scroll" 
                                >
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
                                        @change="roleSwitchChanged(slotProps.data)"/>
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
                                loadNodeUrl="/lider/user_groups/getGroups"
                                loadNodeOuUrl="/lider/user_groups/getOuDetails"
                                :treeNodeClick="setSelectedGroupNode"
                                :searchFields="searchFields"
                            />
                        </div>
                        <div class="p-col-3">
                            <div class="p-col-12">
                                <p>{{$t('settings.console_user_settings.group_member')}}</p>
                            </div>
                            <DataTable :value="groupMembers" responsiveLayout="scroll" 
                                >
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
                                <Button type="button" :label="$t('settings.console_user_settings.add_new_authority_group')" icon="pi pi-angle-down" iconPos="right" @click="toggle" />
                                <Menu ref="menu" :model="privilegeActions" :popup="true" />
                            </div>
                            <DataTable :value="groupPrivilages" responsiveLayout="scroll" 
                                >
                                <Column header="#">
                                        <template #body="slotProps">
                                        <p>{{slotProps.index + 1}}</p>
                                    </template>
                                </Column>
                                <Column field="accessDN" :header="$t('settings.console_user_settings.access_granted_dn')"></Column>
                                <Column header="Yetki">
                                    <template #body="slotProps">
                                        {{
                                                slotProps.data != null && slotProps.data.accessType == "write" ? $t('settings.console_user_settings.read_and_write') : $t('settings.console_user_settings.read')
                                        }}
                                    </template>
                                </Column>
                                <Column :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                    <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-outlined"  @click="deleteOlcAccessRule(slotProps.data)"/>
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
  

  
</template>

<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import AgentsDialog from './Dialogs/AgentsDialog.vue';
import AgentGroupDialog from './Dialogs/AgentGroupsDialog.vue';
import UserDialog from './Dialogs/UsersDialog.vue';
import UserGroupDialog from './Dialogs/UserGroupsDialog.vue';
import RoleDialog from './Dialogs/RoleGroupsDialog.vue';
import AddConsoleUserDialog from './Dialogs/AddConsoleUserDialog.vue';
import axios from 'axios';

export default {
    components: {
        TreeComponent,
        AgentsDialog,
        AgentGroupDialog,
        UserDialog,
        UserGroupDialog,
        RoleDialog,
        AddConsoleUserDialog,
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
					icon: 'pi pi-refresh',
					command: () => {
						this.agentsModalVisible = true;
					}
				},
                 {
					label: this.$t('settings.console_user_settings.users'),
					icon: 'pi pi-refresh',
					command: () => {
						this.userModalVisible = true;
					}
				},
                {
					label: this.$t('settings.console_user_settings.computers_groups'),
					icon: 'pi pi-refresh',
					command: () => {
						this.agentGroupModalVisible = true;
					}
				},
                {
					label: this.$t('settings.console_user_settings.users_groups'),
					icon: 'pi pi-refresh',
					command: () => {
						this.userGroupModalVisible = true;
					}
				},
                {
					label: this.$t('settings.console_user_settings.role_users'),
					icon: 'pi pi-refresh',
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
            showUpdateConsoleUserRolesDialog: false,
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

        }
    },
    methods: {
        toggle(event) {
            this.$refs.menu.toggle(event);
        },
        getRoles(){
            axios.get('/lider/settings/getRoles').then(response => {
                this.roles = response.data;
            });
        },
        getConsoleUsers(){
            axios.get('/lider/settings/getConsoleUsers').then(response => {
                this.records = response.data;
            });
        },
        updateUserRoles() {
            this.showUpdateConsoleUserRolesDialog = false;
            if(this.selectedUser) {
                var data = new FormData();
                data.append('dn', this.selectedUser.distinguishedName);
                data.append('roles[]', this.selectedUser.attributesMultiValues.liderPrivilege);
                
                axios.post('/lider/settings/editUserRoles', data).then(response => {
                     if(response.status === 200) {
                         this.$toast.add({
                            severity:'success', 
                            detail: this.$t('settings.console_user_settings.users_role_successfully_update'), 
                            summary: this.$t('settings.console_user_settings.successful'), 
                            life: 3000
                        });
                        // FIXME 
                        this.getConsoleUsers();
                     } else {
                          this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.console_user_settings.an_unexpected_error_occurred_while_deauthorizing'), 
                            summary: this.$t('settings.console_user_settings.error'), 
                            life: 3000
                        });
                     }
                });
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
        deleteConsoleUser() {
            if (this.selectedUser) {
                let data = new FormData();
                data.append('dn',this.selectedUser.distinguishedName);
                axios.post('/lider/settings/deleteConsoleUser', data).then(response => {
                    console.log('Kullanıcı silindi', response);
                    this.getConsoleUsers();
                    this.$toast.add({
                        severity:'success', 
                        detail:  this.$t('settings.console_user_settings.user_roles_deleted_successfully'),  
                        summary: this.$t('settings.console_user_settings.successful'), 
                        life: 3000
                    });
                });
            } else {
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('settings.console_user_settings.please_select_the_user_whose_authorization_you_want_to_delete'),
                    summary: this.$t('settings.console_user_settings.no_user_selected'), 
                    life: 3000
                });
            }


            this.showDeleteConsoleUserDialog = false;
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
        deleteOlcAccessRule(rule) {
            let rules = this.groupPrivilages.filter(p => p.accessDN === rule.accessDN);

            if(rules && rules.length > 0) {
                axios.post('/lider/settings/deleteOLCAccessRule', rules[0]).then(response => {
                    if(response.status === 200) {
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('settings.console_user_settings.role_successfully_deleted'),
                            summary: this.$t('settings.console_user_settings.successful'),
                            life: 3000
                        });

                        this.getOlcAccessRules();
                    }
                });
            }
        }, 
        addOlcAccessRule(olcAccessDn, accessType) {
            let data = new FormData();
            data.append('type', 'computers');
            data.append('groupDN', this.selectedGroupNode.distinguishedName);
            data.append('olcAccessDN', olcAccessDn, );
            data.append('accessType',accessType);

            axios.post('/lider/settings/addOLCAccessRule', data).then(response => {
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
            });

        },
        getOlcAccessRules() {
            if(this.selectedGroupNode) {
                let data = new FormData();
                data.append('dn',this.selectedGroupNode.distinguishedName);
                axios.post('/lider/settings/getOLCAccessRules', data ).then(response => {
                    this.groupPrivilages = response.data;
                });
            }
        }
    },
    mounted() {
        this.getRoles();
        this.getConsoleUsers();
    }
}
</script>
