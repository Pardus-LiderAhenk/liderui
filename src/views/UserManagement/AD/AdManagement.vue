<template>
    <!-- context menu Dialog -->
    <node-detail :showNodeDetailDialog="showNodeDetailDialog"
        :selectedNode="selectedNode"
        @close-node-detail-dialog="showNodeDetailDialog = false">
    </node-detail>

    <add-folder-dialog :addFolderDialog="modals.addFolderDialog"
        :selectedNode="selectedNode"
        @appendNode="appendNode"
        @close-ad-dialog="modals.addFolderDialog = false">
    </add-folder-dialog>

    <add-group-dialog :addGroupDialog="modals.addGroupDialog"
        :selectedNode="selectedNode"
        @appendNode="appendNode"
        @close-ad-dialog="modals.addGroupDialog = false">
    </add-group-dialog>
    
    <add-user-to-selected-group-dialog :addMemberDialog="modals.addMemberDialog"
        :selectedNode="selectedNode"
        @updateNode="updateNode"
        @close-ad-dialog="modals.addMemberDialog = false">
    </add-user-to-selected-group-dialog>

    <add-selected-user-to-group-dialog :addSelectedUserDialog="modals.addSelectedUserDialog"
        :selectedNode="selectedNode"
        @updateNode="updateNode"
        @close-ad-dialog="modals.addSelectedUserDialog = false">
    </add-selected-user-to-group-dialog>

    <add-user-dialog :addUserDialog="modals.addUserDialog"
        :selectedNode="selectedNode"
        @appendNode="appendNode"
        @close-ad-dialog="modals.addUserDialog = false">
    </add-user-dialog>

    <give-console-access-dialog :giveConsoleAccessDialog="modals.giveConsoleAccessDialog"
        :selectedNode="selectedNode"
        @close-ad-dialog="modals.giveConsoleAccessDialog = false">
    </give-console-access-dialog>
     <!--Context menu Dialog END -->

    <div class="p-grid ad-management">
        <div class="p-col-12 p-md-6 p-lg-3" style="min-height:90vh; background-color:#fff;padding-left:20px;margin-top:10px;">
            <tree-component ref="tree" class="border-card"
                loadNodeUrl="/ad/getDomainEntry"
                loadNodeOuUrl="/ad/getChildEntriesOu"
                :treeNodeClick="treeNodeClick"
                @handleContextMenu="handleContenxtMenu"
                :searchFields="searchFields"
                searchNodeUrl="/ad/searchEntry"
            >
                <template #contextmenu>
                    <div
                        ref="treecontextmenu"
                        class="el-overlay mycontextmenu"
                        v-show="showContextMenu"
                        @click="showContextMenu = false"
                        >
                        <div  ref="rightMenu">
                            <Menu :model="contextMenuItems" />
                        </div>
                    </div>
                </template>
            </tree-component>
        </div>
        <div class="p-col-12 p-md-6 p-lg-9" style="min-height:90vh; margin-top:3px">
            <node-table-content v-if="selectedNode && selectedNode.type != 'USER' && selectedNode.type != 'GROUP'"
                :selectedNode="selectedNode">
            </node-table-content>
            <user-management v-if="selectedNode && selectedNode.type == 'USER'"
                :selectedUser="selectedNode">
            </user-management>
            <group-management v-if="selectedNode && selectedNode.type == 'GROUP'"
                :selectedUser="selectedNode">
            </group-management>
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


export default {

    data() {
        return {
            showContextMenu: false,
            selectedNode: null,
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
                giveConsoleAccessDialog: false
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
        GiveConsoleAccessDialog
    },

    created() {
        this.setSelectedLiderNode(null);
    },

    methods:{
        ...mapActions(["setSelectedLiderNode"]),

        treeNodeClick(node) {
            this.selectedNode = node;
            this.setSelectedLiderNode(node);
        },

        handleContenxtMenu(data, node, treenode, tree){
            data.preventDefault();
            this.selectedNode = node;
            switch(node.type) {
                // case is null for only root dn in ad tree
                case null:
                    if (node.isRoot) {
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
                    }
                    break
                case 'ORGANIZATIONAL_UNIT':
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
                    break
                case 'USER':
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
                        {
                            label: this.$t('user_management.delete_user'), 
                            icon:"pi pi-user-minus", 
                            command:() => {this.modals.deleteNode = true;}
                        },
                    ]
                    break
                case 'CONTAINER':
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
                    break
                case 'GROUP':
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
                }
            this.$refs.rightMenu.style.top = data.clientY + 'px';
            this.$refs.rightMenu.style.left = data.clientX + 'px';
            this.$refs.rightMenu.style.position = 'fixed';
            this.$refs.rightMenu.style.margin = '0';
            this.$refs.rightMenu.style.backgroundColor = '0';
            this.showContextMenu = !this.showContextMenu;
        },

        appendNode(node, parentNode) {
            this.$refs.tree.append(node, parentNode);
        },

        updateNode(node, selectedNode) {
            this.selectedNode = node;
            this.setSelectedLiderNode(node);
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