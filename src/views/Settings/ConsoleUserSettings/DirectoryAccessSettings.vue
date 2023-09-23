<template>
    <div>
        <Toolbar class="p-field">
            <template #start>
                <h5>{{$t('settings.console_user_settings.directory_access_settings')}}</h5>
            </template>
        </Toolbar>
        <div class="p-grid">
            <div class="p-col-12 p-md-6 p-lg-3">
                <tree-component 
                    ref="groupstree"
                    loadNodeUrl="/api/lider/user-groups/groups"
                    loadNodeOuUrl="/api/lider/user-groups/ou-details"
                    :treeNodeClick="setSelectedGroupNode"
                    :searchFields="searchFields"
                />
            </div>
            <div class="p-col-12 p-md-6 p-lg-4">
                <Panel :header="$t('settings.console_user_settings.group_member')">
                    <DataTable :value="groupMembers" 
                        v-model:filters="filters"
                        responsiveLayout="scroll"
                        class="p-datatable-sm"
                        :paginator="true" :rows="10" ref="dt"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        :rowsPerPageOptions="[10,25,50,100]" style="margin-top: 2em"
                    >
                        <template #header>
                            <div class="p-d-flex p-jc-end">
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search"/>
                                    <InputText v-model="filters['global'].value" 
                                        class="p-inputtext-sm" 
                                        :placeholder="$t('settings.script_definition.search')" 
                                    />
                                </span>
                            </div>
                        </template>
                        <template #empty>
                            <div class="p-d-flex p-jc-center">
                                <span>Not found member</span>
                            </div>
                        </template>
                        <Column header="#">
                            <template #body="slotProps">
                                <p>{{slotProps.index + 1}}</p>
                            </template>
                        </Column>
                        <Column field="uid" :header="$t('settings.console_user_settings.member_dn')"></Column>
                    </DataTable>
                </Panel>
            </div>
            <div class="p-col-12 p-md-6 p-lg-5">
                <Panel :header="$t('settings.console_user_settings.access_granted_dn')">
                    <template #icons>
                        <div class="p-d-flex p-jc-between">
                            <Button type="button" class="p-button-sm"
                                :label="$t('settings.console_user_settings.add_new_authority_group')" 
                                icon="pi pi-angle-down" iconPos="right" @click="toggle" 
                            />
                            <Menu ref="menu" :model="privilegeActions" :popup="true" />
                        </div>
                    </template>
                    <DataTable :value="groupPrivilages" responsiveLayout="scroll"
                        v-model:filters="filters2"
                        class="p-datatable-sm"
                    >
                        <template #header>
                            <div class="p-d-flex p-jc-end">
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search"/>
                                    <InputText v-model="filters2['global'].value" 
                                        class="p-inputtext-sm" 
                                        :placeholder="$t('settings.script_definition.search')" 
                                    />
                                </span>
                            </div>
                        </template>
                        <template #empty>
                            <div class="p-d-flex p-jc-center">
                                <span>Not found dn</span>
                            </div>
                        </template>
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
                        <Column :exportable="false">
                            <template #body="slotProps">
                                <div class="p-d-flex p-jc-end">
                                    <Button icon="pi pi-trash" 
                                        class="p-button-rounded p-button-danger p-button-sm"  
                                        v-tooltip.bottom="$t('settings.console_user_settings.delete')"
                                        @click="showAccessPermissionUserDeleteDialog = true;
                                        selectedOlcAccess = slotProps.data"
                                    />
                                </div>
                            </template>
                            </Column>
                    </DataTable>
                </Panel>
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

        <LiderConfirmDialog 
            :showDialog="showAccessPermissionUserDeleteDialog"
            @showDialog="showAccessPermissionUserDeleteDialog = $event;"
            :header="$t('settings.console_user_settings.console_user_change_password')"
            :message="$t('settings.console_user_settings.console_user_permission_deletion_question')"
            @accepted="deleteOlcAccessRule"
        />
    </div>
</template>

<script>
import { consoleUserSettingsService } from "../../../services/Settings/ConsoleUserSettingsService.js";
import AgentsDialog from './Dialogs/AgentsDialog.vue';
import AgentGroupDialog from './Dialogs/AgentGroupsDialog.vue';
import UserDialog from './Dialogs/UsersDialog.vue';
import UserGroupDialog from './Dialogs/UserGroupsDialog.vue';
import RoleDialog from './Dialogs/RoleGroupsDialog.vue';
import {FilterMatchMode} from 'primevue/api';

export default {
    components: {
        AgentsDialog,
        AgentGroupDialog,
        UserDialog,
        UserGroupDialog,
        RoleDialog,
    },

    data() {
        return {
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            filters2: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            groupPrivilages: [],
            groupMembers: [],
            showAccessPermissionUserDeleteDialog: false,
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

            agentsModalVisible: false,
            agentGroupModalVisible: false,
            userModalVisible:false,
            userGroupModalVisible:false,
            roleGroupModalVisible:false,
            
        }
    },

    methods: {
        toggle(event) {
            this.$refs.menu.toggle(event);
        },

        setSelectedGroupNode(node) {
            this.groupMembers = [];
            this.selectedGroupNode = node;
            if (node.type == "GROUP") {
                node.attributesMultiValues.member.forEach((mem,index) => {
                    this.groupMembers.push({
                        id : index + 1,
                        uid : mem
                    })
                });
                this.getOlcAccessRules();
            }
        },

        async getOlcAccessRules() {
            if(this.selectedGroupNode) {
                let data = new FormData();
                data.append('dn',this.selectedGroupNode.distinguishedName);

                const { response,error} = await consoleUserSettingsService.getOLCAccessRule(this.selectedGroupNode.distinguishedName);
                if(response.status == 200){
                    this.groupPrivilages = response.data;
                } else{
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.error_417_olc_access_rule'),
                        summary: this.$t('settings.console_user_settings.error'),
                        life: 3000
                    });
                }                    
            }
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
