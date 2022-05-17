<template>
    <div class="p-grid user-permission-management">
        <div class="p-col-12 p-md-6 p-lg-3" style="min-height:90vh; background-color:#fff;padding-left:20px;margin-top:10px;">
            <tree-component 
                ref="tree"
                loadNodeUrl="/lider/sudo_groups/getGroups"
                loadNodeOuUrl="/lider/sudo_groups/getOuDetails"
                :treeNodeClick="treeNodeClick"
                @handleContextMenu="handleContenxtMenu"
                :searchFields="searchFields"
            >
                <template #contextmenu>
                    <div
                        ref="treecontextmenu"
                        class="el-overlay sudocontextmenu"
                        v-show="showContextMenu"
                        @click="showContextMenu = false"
                    >
                        <div  ref="rightMenu">
                            <Menu :model="contextMenuItems"  />
                        </div>
                    </div>
                </template>
            </tree-component>
        </div>
        <div class="p-col-12 p-md-6 p-lg-9" style="min-height:90vh; margin-top:3px">
            <div class="p-grid">
                <div class="p-col-12 p-md-6 p-lg-6">
                    <Card>
                        <template #title>
                           <div style="font-size:15px;">
                                Kayıt Bilgisi
                            </div>
                        </template>
                        <template #content>
                            <DataTable class="p-datatable-sm" 
                                :value="selectedNodeData" responsiveLayout="scroll">
                                <template #empty>
                                    <div class="p-d-flex p-jc-center">
                                        Lütfen kayıt seçiniz
                                    </div>
                                </template>
                                <Column field="label" header="Öznitelik"></Column>
                                <Column field="value" header="Değer"></Column>
                            </DataTable>
                        </template>
                    </Card>
                </div>
                <div class="p-col-12 p-md-6 p-lg-6">
                    <Card>
                        <template #title>
                            <div style="font-size:15px;">
                                Kullanıcı Listesi
                            </div>
                        </template>
                        <template #content>
                            <DataTable class="p-datatable-sm" 
                                :value="sudoUser" 
                                v-model:filters="filters"
                                :paginator="true" :rows="10" ref="dt"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                                :rowsPerPageOptions="[10,25,50,100]"  style="margin-top: 2em">
                                <template #header>
                                    <div class="p-d-flex p-jc-end">
                                        <div>
                                            <span class="p-input-icon-left">
                                                <i class="pi pi-search"/>
                                                <InputText v-model="filters['global'].value" 
                                                class="p-inputtext-sm" 
                                                placeholder="Ara" 
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </template>
                                <template #empty>
                                    <div class="p-d-flex p-jc-center">
                                        <div v-if="selectedNode && selectedNode.type=='ROLE'">
                                            Yetkili kullanıcı bulunamadı
                                        </div>
                                        <div v-else>
                                            Lütfen yetki grubu seçiniz
                                        </div>
                                    </div>
                                </template>
                                <Column field="index" header="#" style="width:10%"></Column>
                                <Column header="Kullanıcı Adı" field="uid"></Column>
                                <Column>
                                    <template #body="slotProps">
                                        <div class="p-d-flex p-jc-end">
                                            <Button 
                                                label="Sil"
                                                icon="pi pi-trash" 
                                                class="p-button-rounded p-button-sm p-button-danger" 
                                                @click="modals.deleteSudoUser = true; deletedSudoUser = slotProps.data;"
                                            />
                                        </div>
                                    </template>
                                </Column>
                            </DataTable>
                        </template>
                    </Card>
                </div>
            </div>
        </div>
    </div>

    <!-- Dialogs -->
    <add-folder-dialog v-if="modals.folderAdd"
        :selectedNode="selectedNode"
        :addFolderDialog="modals.folderAdd"
        @close-sudo-dialog="modals.folderAdd = false"
        @append-node="appendNode">
    </add-folder-dialog>

    <change-folder-name-dialog v-if="modals.folderNameChange"
        :selectedNode="selectedNode"
        :folderNameChange="modals.folderNameChange"
        @close-sudo-dialog="modals.folderNameChange = false"
        @update-node="updateNode">
    </change-folder-name-dialog>

    <move-node-dialog v-if="modals.moveNode"
        :selectedNode="selectedNode"
        :moveNodeDialog="modals.moveNode"
        @close-sudo-dialog="modals.moveNode = false"
        @move-node="moveNode">
    </move-node-dialog>
    
    <sudo-group-dialog v-if="modals.sudoGroup"
        :modalVisibleValue="modals.sudoGroup" 
        @modalVisibleValue="modals.sudoGroup = $event; sudoGruopEdit = false"
        :selectedTreeNode="selectedNode"
        @sudoGroupCreated="sudoGroupCreated"
        :isEdit="sudoGruopEdit">
    </sudo-group-dialog>

    <Dialog :header="selectedNode && selectedNode.type == 'ROLE' ? 'Yetki Grubu Sil': 'Klasör Sil'" 
        v-model:visible="modals.deleteNode"  
        :modal="true" :style="{width: '30vw'}">
        <div class="confirmation-content">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 2rem" />
            <span v-if="selectedNode.type == 'ROLE'">Yetki grubu silinecektir, emin misiniz?</span>
            <span v-if="selectedNode.type == 'ORGANIZATIONAL_UNIT'">
                Klasör silinecektir, emin misiniz?
                Bu işlem seçili olan klasörü ve bu klasörün altında yer alan tüm klasör ve grupları silecektir. Bu işlem geri alınamaz.
            </span>
        </div>
        <template #footer>
        <Button 
            label="İptal" 
            icon="pi pi-times" 
            @click="modals.deleteNode = false" 
            class="p-button-text p-button-sm"
        />
        <Button 
            label="Evet"
            icon="pi pi-check" 
            @click="deleteNode"
            class="p-button-sm"
        />
        </template>
    </Dialog>
    <Dialog header="Kullanıcı Sil" 
        v-model:visible="modals.deleteSudoUser"  
        :modal="true" :style="{width: '30vw'}">
        <div class="confirmation-content">
            <i class="pi pi-info-circle p-mr-3" style="font-size: 2rem" />
            <span>Kullanıcı yetki grubundan silinecektir, emin misiniz?</span>
        </div>
        <template #footer>
        <Button 
            label="İptal" 
            icon="pi pi-times" 
            @click="modals.deleteSudoUser = false" 
            class="p-button-text p-button-sm"
        />
        <Button 
            label="Evet"
            icon="pi pi-check" 
            @click="deleteSudoUser"
            class="p-button-sm"
        />
        </template>
    </Dialog>
    <!-- Dialogs End -->
</template>

<script>
/**
 * User Permission management as sudoUser, sudoCommand and sudoHost
 * @see {@link http://www.liderahenk.org/}
 */


import TreeComponent from '@/components/Tree/TreeComponent.vue';
import axios from 'axios';
import { mapActions } from "vuex"
import SudoGroupDialog from './Dialogs/SudoGroupDialog.vue';
import {FilterMatchMode} from 'primevue/api';
import AddFolderDialog from './Dialogs/AddFolderDialog.vue'
import ChangeFolderNameDialog from './Dialogs/ChangeFolderNameDialog.vue'
import MoveNodeDialog from './Dialogs/MoveNodeDialog.vue'

export default {
    data() {
        return {
            modals : {
                folderAdd:false,
                folderNameChange: false,
                moveNode: false,
                sudoGroup:false,
                deleteNode: false,
                deleteSudoUser: false
            },
            sudoUser: [],
            showContextMenu: false,
            contextMenuItems: [],
            selectedNodeData: [],
            sudoGruopEdit: false,
            deletedSudoUser: null,
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
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
            },
        }
    },
    components: {
        TreeComponent,
        SudoGroupDialog,
        AddFolderDialog,
        ChangeFolderNameDialog,
        MoveNodeDialog
    },

    created() {
        this.setSelectedLiderNode(null);
    },

    methods: {
        ...mapActions(["setSelectedLiderNode"]),

        treeNodeClick(node) {
            this.selectedNode = node;
            if (this.selectedNode.type == "ROLE") {
                this.sudoUser = [];
                if (this.selectedNode.attributesMultiValues.sudoUser) {
                    this.selectedNode.attributesMultiValues.sudoUser.forEach(element => {
                        this.sudoUser.push({
                            "uid":element
                        });
                    });
                    this.updateRowIndex();
                }
            } else {
                this.sudoUser = [];
            }
            this.setSelectedNodeData(node);
            this.setSelectedLiderNode(node);
        },

        setSelectedNodeData(node){
            if (node) {
                let nodeData = [];
                nodeData.push({
                    'label': 'Ad',
                    'value': node.name,
                }, 
                {
                    'label': 'Tipi',
                    'value': node.type
                },
                {
                    'label': 'Kayıt DN',
                    'value': node.distinguishedName,
                },
                {
                    'label': 'Oluştrulma Tarihi',
                    'value': node.createDateStr,
                },
                {
                    'label': 'Güncelleme Tarihi',
                    'value': node.modifyDateStr,
                },
                {
                    'label': 'Oluşturan Kişi',
                    'value': node.attributes.modifiersName,

                },
                {
                    'label': 'Güncelleyen Kişi',
                    'value': node.attributes.modifiersName,
                },
                {
                    'label': 'Açıklama',
                    'value': node.attributes.description,
                });
                node.attributesMultiValues.objectClass.map(oclas => {
                    nodeData.push({
                        'label': 'Nesne Sınıfı', 
                        'value' : oclas
                    })
                });
                this.selectedNodeData = nodeData;
            } else {
                this.selectedNodeData = [];
            }
        },

        appendNode(node, parentNode) {
            this.$refs.tree.append(node, parentNode);
        },

        updateNode(response, data) {
            this.selectedNode.distinguishedName = response.distinguishedName;
            this.selectedNode.name = response.name;
            this.$refs.tree.updateNode(this.selectedNode.distinguishedName, this.selectedNode);
            this.setSelectedLiderNode(response);
            this.setSelectedNodeData(response);
        },

        moveNode(destinationNode) {
            this.$refs.tree.remove(this.selectedNode);
            this.$refs.tree.append(this.selectedNode, this.$refs.tree.getNode(destinationNode.distinguishedName));
            this.setSelectedNodeData(null);
            this.setSelectedNodeData(null);
        },

        sudoGroupCreated(data, isEdit) {
            if (isEdit) {
                this.isEdit = false;
                this.selectedNode.attributesMultiValues = data.attributesMultiValues;
                this.selectedNode.distinguishedName = data.distinguishedName;
                this.selectedNode.name = data.name;
                this.$refs.tree.updateNode(this.selectedNode.distinguishedName, this.selectedNode);
                this.treeNodeClick(this.selectedNode);
            } else {
                this.$refs.tree.append(data, this.selectedNode);
            }
            this.modals.sudoGroup = false;
        },

        deleteNode() {
            axios.post('/lider/sudo_groups/deleteEntry', null, {
                params : { dn: this.selectedNode.distinguishedName }
            }).then(response => {
                if (response.data) {
                    this.$refs.tree.remove(this.selectedNode);
                    this.setSelectedLiderNode(null);
                    this.$toast.add({
                        severity:'success', 
                        detail: "Kayıt başarıyla silindi", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else{
                    this.$toast.add({
                        severity:'error', 
                        detail: "Kayıt silinirken hata oluştu", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                this.modals.deleteNode = false;
            });
        },

        deleteSudoUser() {
            axios.post('/lider/sudo_groups/delete/sudo/user', null, {
                params : { uid: this.deletedSudoUser.uid ,dn: this.selectedNode.distinguishedName }
            }).then(response => {
                if (response.data) {
                   this.$toast.add({
                        severity:'success', 
                        detail: "Kullanıcı yetki grubundan başarıyla silindi", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    }); 
                    this.sudoUser = this.sudoUser.filter(user => user.uid != this.deletedSudoUser.uid);
                    this.selectedNode.attributesMultiValues = response.data.attributesMultiValues;
                    this.$refs.tree.updateNode(this.selectedNode.distinguishedName, this.selectedNode);
                    this.treeNodeClick(this.selectedNode);
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: "Kullanıcı yetki grubundan silinirken hata oluştu", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                
            });
            this.modals.deleteSudoUser = false;
            
        },

        handleContenxtMenu(data, node, treenode, tree){
            data.preventDefault();
            this.treeNodeClick(node);
            switch(node.type) {
                case 'ORGANIZATIONAL_UNIT':
                    if (node.isRoot) {
                        this.contextMenuItems = [
                            {label: 'Yetki Grubu Ekle', icon:"fas fa-user-tag", command: () => {this.modals.sudoGroup = true;}},
                            {label: 'Klasör Ekle', icon:"pi pi-folder-open",  command: () => {this.modals.folderAdd = true}},
                        ]
                    } else {
                        this.contextMenuItems = [
                            {label: 'Yetki Grubu Ekle', icon:"fas fa-user-tag", command: () => {this.modals.sudoGroup = true;}},
                            {label: 'Klasör Ekle', icon:"pi pi-folder-open",  command: () => {this.modals.folderAdd = true}},
                            {label: 'Klasör Adı Düzenle', icon:"pi pi-pencil", command: () => {this.modals.folderNameChange = true}},
                            {label: 'Klasör Taşı', icon:"el-icon-rank",  command:() => {this.modals.moveNode = true;}},
                            {label: 'Klasör Sil', icon:"pi pi-trash", command:() => {this.modals.deleteNode = true}}
                        ]
                    }
                    break
                case 'ROLE':
                    this.contextMenuItems = [
                        {label: 'Yetki Grubu Düzenle', icon:"pi pi-pencil", command:() => {this.sudoGruopEdit = true; this.modals.sudoGroup = true}},
                        {label: 'Yetki Grubu Taşı', icon:"el-icon-rank",  command: () => {this.modals.moveNode = true}},
                        {label: 'Yetki Grubu Sil', icon:"pi pi-trash", command:() => {this.modals.deleteNode = true}}
                    ]
            }

            this.$refs.rightMenu.style.top = data.clientY + 'px';
            this.$refs.rightMenu.style.left = data.clientX + 'px';
            this.$refs.rightMenu.style.position = 'fixed';
            this.$refs.rightMenu.style.margin = '0';
            this.$refs.rightMenu.style.backgroundColor = '0';
            this.showContextMenu = !this.showContextMenu;
        },

        updateRowIndex() {
            for (let index = 0; index < this.sudoUser.length; index++) {
                const element = this.sudoUser[index];
                element.index = index + 1;
            }
        }
    },
}
</script>

<style lang="scss" scoped>

.sudocontextmenu {
    background-color: rgba(0,0,0,0.0);
}
.user-permission-management {
    background-color: #e7f2f8;
}
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