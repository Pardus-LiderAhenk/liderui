<template>
    <node-detail :showNodeDetailDialog="showNodeDetailDialog"
        :selectedNode="selectedNode"
        @close-node-detail-dialog="showNodeDetailDialog = false">
    </node-detail>
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
            <node-table-content v-if="selectedNode && selectedNode.type != 'USER'"
                :selectedNode="selectedNodeTable">
            </node-table-content>
        </div>
    </div>
    
</template>

<script>
/**
 * AD management main page. User, group, ou and container operations are applied at this page,
 * @see {@link http://www.liderahenk.org/}
 */

import { mapActions } from "vuex"
import NodeDetail from '@/views/UserManagement/AD/Components/NodeDetail.vue';
import NodeTableContent from '@/views/UserManagement/AD/Components/NodeTableContent.vue';


export default {

    data() {
        return {
            showContextMenu: false,
            selectedNode: null,
            selectedNodeTable: null,
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
        };
    },

    components: {
        NodeDetail,
        NodeTableContent
    },

    created() {
        this.setSelectedLiderNode(null);
    },

    methods:{

        ...mapActions(["setSelectedLiderNode"]),

        treeNodeClick(node) {
            console.log(node)
            this.selectedNode = node;
            this.selectedNodeTable = node;
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
                                command: () => {this.modals.addUser = true;}
                            },
                            {
                                label: this.$t('user_management.add_folder'),
                                icon:"pi pi-folder-open", 
                                command: () => {this.validation.folderName = false; this.modals.folderAdd = true}
                            },
                            {
                                label: this.$t('user_management.ad.add_group'),
                                icon:"fas fa-users", 
                                command: () => {this.validation.folderName = false; this.modals.folderAdd = true}
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
                            command: () => {this.modals.addUser = true;}
                        },
                        {
                            label: this.$t('user_management.add_folder'),
                            icon:"pi pi-folder-open", 
                            command: () => {this.validation.folderName = false; this.modals.folderAdd = true}
                        },
                        {
                            label: this.$t('user_management.ad.add_group'),
                            icon:"fas fa-users", 
                            command: () => {this.validation.folderName = false; this.modals.folderAdd = true}
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
                            command: () => {this.modals.moveUser = true}
                        },
                        {
                            label: this.$t('user_management.ad.add_to_group'), 
                            icon:"pi pi-plus", 
                            command:() => {this.modals.deleteNode = true;}
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
                            command: () => {this.modals.moveUser = true}
                        },
                        {
                            label: this.$t('user_management.ad.add_group'),
                            icon:"fas fa-users",
                            command:() => {this.modals.deleteNode = true;}
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
                            label: this.$t('user_management.add_user'), 
                            icon:"pi pi-user-plus",
                            command: () => {this.modals.moveUser = true}
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