<template>
    <div>
        <div class="p-field">
            <h4>Dizin Erişim Ayarları</h4>
        </div>
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
    </div>
</template>

<script>
import { consoleUserSettingsService } from "../../../services/Settings/ConsoleUserSettingsService.js";

export default {

    data() {
        return {
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
    },
    
}
</script>
