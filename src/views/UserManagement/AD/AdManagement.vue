<template>
    <div>


    
    <!-- context menu Dialog -->
    <node-detail
        :showNodeDetailDialog="showNodeDetailDialog"
        :selectedNode="selectedNode"
        @close-node-detail-dialog="showNodeDetailDialog = false">
    </node-detail>

    <add-folder-dialog
        :addFolderDialog="modals.addFolderDialog"
        :selectedNode="selectedNode"
        @appendNode="appendNode"
        @close-ad-dialog="modals.addFolderDialog = false">
    </add-folder-dialog>

    <add-group-dialog
        :addGroupDialog="modals.addGroupDialog"
        :selectedNode="selectedNode"
        @appendNode="appendNode"
        @close-ad-dialog="modals.addGroupDialog = false">
    </add-group-dialog>
    
    <add-user-to-selected-group-dialog
        :addMemberDialog="modals.addMemberDialog"
        :selectedNode="selectedNode"
        @updateNode="updateNode"
        @close-ad-dialog="modals.addMemberDialog = false">
    </add-user-to-selected-group-dialog>

    <add-selected-user-to-group-dialog
        :addSelectedUserDialog="modals.addSelectedUserDialog"
        :selectedNode="selectedNode"
        @updateNode="updateNode"
        @close-ad-dialog="modals.addSelectedUserDialog = false">
    </add-selected-user-to-group-dialog>

    <add-user-dialog
        :addUserDialog="modals.addUserDialog"
        :selectedNode="selectedNode"
        @appendNode="appendNode"
        @close-ad-dialog="modals.addUserDialog = false">
    </add-user-dialog>

    <give-console-access-dialog
        :giveConsoleAccessDialog="modals.giveConsoleAccessDialog"
        :selectedNode="selectedNode"
        @close-ad-dialog="modals.giveConsoleAccessDialog = false">
    </give-console-access-dialog>

    <delete-node-dialog
        :deleteNodeDialog="modals.deleteNodeDialog"
        :selectedNode="selectedNode"
        @delete-node="deleteNode"
        @close-ad-dialog="modals.deleteNodeDialog = false">
    </delete-node-dialog>

    <user-synchronization-dialog v-if="modals.userSyncDialog"
        :userSyncDialog="modals.userSyncDialog"
        :selectedNode="selectedNode"
        @close-ad-dialog="modals.userSyncDialog = false">
    </user-synchronization-dialog>

    <group-synchronization-dialog v-if="modals.groupSyncDialog"
        :groupSyncDialog="modals.groupSyncDialog"
        :selectedNode="selectedNode"
        @close-ad-dialog="modals.groupSyncDialog = false">
    </group-synchronization-dialog>
     <!--Context menu Dialog END -->

    <div class="p-grid ad-management">
        <div class="p-col-12 p-md-6 p-lg-3" style="min-height:90vh; background-color:#fff;padding-left:20px;margin-top:10px;">
            <tree-component ref="adTree" class="border-card"
                loadNodeUrl="/api/ad/domain-entry"
                loadNodeOuUrl="/api/ad/child-entries-ou"
                :treeNodeClick="treeNodeClick"
                @handleContextMenu="handleContenxtMenu"
                :searchFields="searchFields"
                searchNodeUrl="/api/ad/search-entry"
                @directoryConnection="directoryConnection"
            >
                <template #contextmenu>
                    <div
                        ref="treecontextmenu"
                        class="el-overlay mycontextmenu"
                        v-show="showContextMenu"
                        @click="showContextMenu = false"
                    >
                        <div  ref="rightMenu">
                            <Menu :model="contextMenuItems"/>
                        </div>
                    </div>
                </template>
            </tree-component>
        </div>
        <div class="p-col-12 p-md-6 p-lg-9" style="min-height:90vh; margin-top:3px" v-if="isAdConnection">
            <Message v-if="isAdConnection" :closable="false" :life="3000" :sticky="false" severity="success">
                {{$t('user_management.ad.ad_connect_successfully')}}
            </Message>
            <div v-if="domainType == 'ACTIVE_DIRECTORY'">
                <node-table-content v-if="selectedNode && selectedNode.type != 'USER' && selectedNode.type != 'GROUP'"
                    :selectedNode="selectedNode">
                </node-table-content>
                <user-management v-if="selectedNode && selectedNode.type == 'USER'" 
                    :selectedUser="selectedNode">
                </user-management>
                <group-management v-if="selectedNode && selectedNode.type == 'GROUP'"
                    :selectedNode="selectedNode">
                </group-management>
            </div>
            <div v-else>
                <node-table-content
                    :selectedNode="selectedNode">
                </node-table-content>
            </div>
        </div>
        <div v-if="!isAdConnection" class="p-col-12 p-md-6 p-lg-9" style="min-height:90vh; margin-top:3px">
            <Card>
                <template #content>
                    <div class="p-grid p-flex-column">
                        <Message v-if="!isAdConnection && !loading" :closable="false" severity="info">
                            {{$t('user_management.ad.ad_connect_not_successfully')}}
                        </Message>
                        <Message v-if="loading" :closable="false" severity="info">
                            <i style="font-size: 1.5rem" class="el el-icon-loading"></i>&nbsp; 
                            {{$t('user_management.ad.ad_connecting_wait')}}
                        </Message>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</div>
</template>

<script>
/**
 * AD management main page. User, group, ou and container operations are applied at this page,
 * @see {@link http://www.liderahenk.org/}
 */

import { mapActions } from "vuex"
import NodeTableContent from './Components/NodeTableContent.vue';
import GroupManagement from './Components/GroupManagement.vue';
import UserManagement from './Components/UserManagement/UserManagement.vue';
import NodeDetail from './Dialogs/NodeDetail.vue';
import {FilterMatchMode} from 'primevue/api';
import AddFolderDialog from './Dialogs/AddFolderDialog.vue';
import AddGroupDialog from './Dialogs/AddGroupDialog.vue';
import AddUserToSelectedGroupDialog from './Dialogs/AddUserToSelectedGroupDialog.vue';
import AddSelectedUserToGroupDialog from './Dialogs/AddSelectedUserToGroupDialog.vue';
import AddUserDialog from './Dialogs/AddUserDialog.vue';
import GiveConsoleAccessDialog from './Dialogs/GiveConsoleAccessDialog.vue';
import DeleteNodeDialog from './Dialogs/DeleteNodeDialog.vue';
import UserSynchronizationDialog from './Dialogs/UserSynchronizationDialog.vue'
import GroupSynchronizationDialog from './Dialogs/GroupSynchronizationDialog.vue'
import { adManagementService } from '../../../services/UserManagement/AD/AdManagement.js'


export default {

    data() {
        return {
            showContextMenu: false,
            selectedNode: null,
            domainType: "LDAP", // LDAP, ACTIVE_DIRECTORY, NONE
            enableDeleteUpdate: false,
            isAdConnection: false,
            loading: true,
            searchFields: [
                {
                    key: "SAM-Account-Name",
                    value: "sAMAccountName"
                },
                {
                    key: this.$t('tree.cn'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.surname'),
                    value: "sn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                },
                {
                    key: this.$t('tree.description'),
                    value: "description"
                },
                {
                    key: this.$t('tree.address'),
                    value: "streetAddress"
                },
                {
                    key: this.$t('tree.telephone_number'),
                    value: "telephoneNumber"
                },
                {
                    key: this.$t('tree.objectclass'),
                    value: "objectclass"
                }
            ],
            showNodeDetailDialog: false,
            modals: {
                addGroupDialog: false,
                addFolderDialog: false,
                addMemberDialog: false,
                addSelectedUserDialog: false,
                addUserDialog: false,
                giveConsoleAccessDialog: false,
                deleteNodeDialog: false,
                userSyncDialog: false,
                groupSyncDialog: false
            },
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
        };
    },

    components: {
        NodeDetail,
        NodeTableContent,
        UserManagement,
        AddFolderDialog,
        AddGroupDialog,
        AddUserToSelectedGroupDialog,
        AddSelectedUserToGroupDialog,
        AddUserDialog,
        GroupManagement,
        GiveConsoleAccessDialog,
        DeleteNodeDialog,
        UserSynchronizationDialog,
        GroupSynchronizationDialog,
    },
    
    created() {

        this.configurations();
    },

    methods:{

        ...mapActions(["setSelectedLiderNode"]),

        directoryConnection(status) {
            this.isAdConnection = status;
            this.loading = false;
        },

        treeNodeClick(node) {
            this.selectedNode = node;
            this.setSelectedLiderNode(node);
        },

        async configurations(){
            const{ response,error } =  await adManagementService.configuration();
            if(error){
            this.$toast.add({
                severity:'error', 
                detail: this.$t('user_management.ad.error_configuraton'),
                summary:this.$t("computer.task.toast_summary"), 
                life: 3000
                });
            }
            else{

                if(response.status == 200){
                    if (response.data) {
                        this.enableDeleteUpdate = response.data.enableDelete4Directory;
                        this.domainType = response.data.domainType;
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.ad.error_417_configuration'),
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                        });
                    }
                }
                
                this.setSelectedLiderNode(null);
        },

        handleContenxtMenu(data, node, treenode, tree){
            data.preventDefault();
            this.selectedNode = node;
            switch(node.type) {
                // case is null for only root dn in ad tree
                case null:
                    if (node.isRoot) {
                        if (this.domainType == "ACTIVE_DIRECTORY") {
                            this.contextMenuItems = [
                                {
                                    label: this.$t('user_management.node_detail'), 
                                    icon:'pi pi-list', 
                                    command: () => {this.showNodeDetailDialog = true}
                                },
                                {
                                    label: this.$t('user_management.add_user'), 
                                    icon:"pi pi-user-plus", 
                                    command: () => {this.modals.addUserDialog = true;}
                                },
                                {
                                    label: this.$t('user_management.add_folder'),
                                    icon:"pi pi-folder-open", 
                                    command: () => {this.modals.addFolderDialog = true;}
                                },
                                {
                                    label: this.$t('user_management.ad.add_group'),
                                    icon:"fas fa-users", 
                                    command: () => {this.modals.addGroupDialog = true}
                                },
                            ]
                        } else {
                            this.contextMenuItems = [
                                {
                                    label: this.$t('user_management.node_detail'), 
                                    icon:'pi pi-list', 
                                    command: () => {this.showNodeDetailDialog = true}
                                },
                                {
                                    label: this.$t('user_management.ad.sync_selected_user'), 
                                    icon:'pi pi-replay', 
                                    command: () => {this.modals.userSyncDialog = true}
                                },
                                {
                                    label: this.$t('user_management.ad.sync_selected_group'), 
                                    icon:'pi pi-replay', 
                                    command: () => {this.modals.groupSyncDialog = true}
                                },
                            ]
                        }
                    }
                    break
                case 'ORGANIZATIONAL_UNIT':
                    if (this.domainType == "ACTIVE_DIRECTORY") {
                        this.contextMenuItems = [
                            {
                                label: this.$t('user_management.node_detail'), 
                                icon:'pi pi-list', 
                                command: () => {this.showNodeDetailDialog = true}
                            },
                            {
                                label: this.$t('user_management.add_user'), 
                                icon:"pi pi-user-plus", 
                                command: () => {this.modals.addUserDialog = true;}
                            },
                            {
                                label: this.$t('user_management.add_folder'),
                                icon:"pi pi-folder-open", 
                                command: () => {this.modals.addFolderDialog = true;}
                            },
                            {
                                label: this.$t('user_management.ad.add_group'),
                                icon:"fas fa-users", 
                                command: () => {this.modals.addGroupDialog = true;}
                            },
                        ]
                        if (this.enableDeleteUpdate == true) {
                            this.contextMenuItems.push({
                                label: this.$t('user_management.delete_folder'), 
                                icon:"pi pi-trash", 
                                command:() => {this.modals.deleteNodeDialog = true;}
                            });
                        }
                    } else {
                        this.contextMenuItems = [
                            {
                                label: this.$t('user_management.node_detail'), 
                                icon:'pi pi-list', 
                                command: () => {this.userSyncDialog = true}
                            },
                            {
                                label: this.$t('user_management.ad.sync_selected_user'), 
                                icon:'pi pi-replay', 
                                command: () => {this.modals.userSyncDialog = true}
                            },
                            {
                                label: this.$t('user_management.ad.sync_selected_group'), 
                                icon:'pi pi-replay', 
                                command: () => {this.modals.groupSyncDialog = true}
                            },
                        ]
                    }
                    break
                case 'USER':
                    if (this.domainType == "ACTIVE_DIRECTORY") {
                        this.contextMenuItems = [
                            {
                                label: this.$t('user_management.node_detail'), 
                                icon: 'pi pi-list', 
                                command: () => {this.showNodeDetailDialog = true}
                            },
                            {
                                label: this.$t('user_management.ad.give_console_access'), 
                                icon:"pi pi-check-square", 
                                command: () => {this.modals.giveConsoleAccessDialog = true}
                            },
                            {
                                label: this.$t('user_management.ad.add_to_group'), 
                                icon:"pi pi-plus", 
                                command:() => {this.modals.addSelectedUserDialog = true;}
                            },
                            
                        ]
                        if (this.enableDeleteUpdate == true) {
                            this.contextMenuItems.push({
                                label: this.$t('user_management.delete_user'), 
                                icon:"pi pi-user-minus", 
                                command:() => {this.modals.deleteNodeDialog = true;}
                            });
                        }
                    } else {
                        this.contextMenuItems = [
                            {
                                label: this.$t('user_management.node_detail'), 
                                icon:'pi pi-list', 
                                command: () => {this.showNodeDetailDialog = true}
                            },
                            {
                                label: this.$t('user_management.ad.sync_selected_user'), 
                                icon:'pi pi-replay', 
                                command: () => {this.modals.userSyncDialog = true}
                            },
                        ]
                    }
                    break
                case 'AHENK':
                    this.contextMenuItems = [
                        {
                            label: this.$t('user_management.node_detail'), 
                            icon:'pi pi-list', 
                            command: () => {this.showNodeDetailDialog = true}
                        },
                    ]
                    break
                case 'CONTAINER':
                    if (this.domainType == "ACTIVE_DIRECTORY") {
                        this.contextMenuItems = [
                            {
                                label: this.$t('user_management.node_detail'), 
                                icon: 'pi pi-list', 
                                command: () => {this.showNodeDetailDialog = true}
                            },
                            {
                                label: this.$t('user_management.add_user'), 
                                icon:"pi pi-user-plus", 
                                command: () => {this.modals.addUserDialog = true}
                            },
                            {
                                label: this.$t('user_management.ad.add_group'),
                                icon:"fas fa-users",
                                command:() => {this.modals.addGroupDialog = true;}
                            },
                        ]
                    } else {
                        this.contextMenuItems = [
                            {
                                label: this.$t('user_management.node_detail'), 
                                icon:'pi pi-list', 
                                command: () => {this.showNodeDetailDialog = true}
                            },
                            {
                                label: this.$t('user_management.ad.sync_selected_user'), 
                                icon:'pi pi-replay', 
                                command: () => {this.modals.userSyncDialog = true}
                            },
                            {
                                label: this.$t('user_management.ad.sync_selected_group'), 
                                icon:'pi pi-replay', 
                                command: () => {this.modals.groupSyncDialog = true}
                            },
                        ]
                    }
                    break
                case 'GROUP':
                    if (this.domainType == "ACTIVE_DIRECTORY") {
                        this.contextMenuItems = [
                            {
                                label: this.$t('user_management.node_detail'), 
                                icon: 'pi pi-list', 
                                command: () => {this.showNodeDetailDialog = true}
                            },
                            {
                                label: this.$t('user_management.ad.add_member_to_group'), 
                                icon:"pi pi-user-plus",
                                command: () => {this.modals.addMemberDialog = true}
                            },
                        ]
                        if (this.enableDeleteUpdate == true) {
                            this.contextMenuItems.push({
                                label: this.$t('user_management.delete_group'), 
                                icon:"pi pi-trash", 
                                command:() => {this.modals.deleteNodeDialog = true;}
                            });
                        }
                    } else {
                        this.contextMenuItems = [
                            {
                                label: this.$t('user_management.node_detail'), 
                                icon:'pi pi-list', 
                                command: () => {this.showNodeDetailDialog = true}
                            },
                            {
                                label: this.$t('user_management.ad.sync_selected_group'), 
                                icon:'pi pi-replay', 
                                command: () => {this.modals.groupSyncDialog = true}
                            },
                        ]
                    }
                }
            this.$refs.rightMenu.style.top = data.clientY + 'px';
            this.$refs.rightMenu.style.left = data.clientX + 'px';
            this.$refs.rightMenu.style.position = 'fixed';
            this.$refs.rightMenu.style.margin = '0';
            this.$refs.rightMenu.style.backgroundColor = '0';
            this.showContextMenu = !this.showContextMenu;
        },

        appendNode(node, parentNode) {
            this.$refs.adTree.append(node, parentNode);
        },

        updateNode(node, updatedNode) {
            this.selectedNode = node;
            this.$refs.adTree.updateNode(node.distinguishedName, updatedNode);
            this.setSelectedLiderNode(node);
        },

        deleteNode(selectedNode) {
            this.$refs.adTree.remove(selectedNode);
            this.selectedNode = null;
            this.setSelectedLiderNode(null);
        },
    }
}
</script>

<style lang="scss" scoped>
.mycontextmenu {
    background-color: rgba(0,0,0,0.0);
}
.ad-management {
    background-color: #e7f2f8;
}
</style>