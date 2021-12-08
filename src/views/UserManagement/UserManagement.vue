<template>
  <ConfirmDialog></ConfirmDialog>
    <div class="p-grid user-management">
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
                        class="el-overlay mycontextmenu"
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
                <div class="p-col-12 p-md-6 p-lg-4">
                    <Card>
                        <template #content>
                            <PanelMenu :model="menuitems" />
                        </template>
                    </Card>
                </div>
                <div class="p-col-12 p-md-6 p-lg-8">
                    <Card>
                        <template #content>
                            <general-informations v-show="displayFormNumber === 1"></general-informations>
                            <password-change v-show="displayFormNumber === 2"></password-change>
                            <user-groups v-show="displayFormNumber === 4"></user-groups>
                            <user-permission-groups v-show="displayFormNumber === 5"></user-permission-groups>
                        </template>
                    </Card>
                </div>
            </div>
        </div>
    </div>
    <Dialog header="Klasör Ekle" v-model:visible="modals.folderAdd" :style="{width: '50vw'}" :modal="true">
        <div class="p-fluid">
            <div class="p-field">
                <label for="folderName">Klasör Adı</label>
                <InputText id="folderName" type="text" v-model="folderName"/>
            </div>
        </div>
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="modals.folderAdd = false" class="p-button-text"/>
            <Button label="Kaydet" icon="pi pi-check" @click="addFolder" autofocus />
        </template>
    </Dialog>
    <Dialog header="Klasör Adını Değiştir" v-model:visible="modals.folderNameChange" :style="{width: '50vw'}" :modal="true">
        <div class="p-fluid">
            <div class="p-field">
                <label for="folderName">Klasör Adını Değiştir</label>
                <InputText id="folderName" type="text" v-model="folderName"/>
            </div>
        </div>
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="modals.folderNameChange = false" class="p-button-text"/>
            <Button label="Güncelle" icon="pi pi-check" @click="changeFolder" autofocus />
        </template>
    </Dialog>
    <Dialog header="Taşınacak Klasörü Seçiniz" v-model:visible="modals.moveFolder" :style="{width: '50vw'}" :modal="true">
        <tree-component 
                ref="movetree"
                loadNodeUrl="/lider/sudo_groups/getGroups"
                loadNodeOuUrl="/lider/sudo_groups/getOuDetails"
                :treeNodeClick="moveTreeNodeClick"
                :isMove="true"
        />
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="modals.folderNameChange = false" class="p-button-text"/>
            <Button label="Taşı" icon="pi pi-check" @click="moveFolder" autofocus />
        </template>
    </Dialog>
    <Dialog header="Taşınacak Klasörü Seçiniz" v-model:visible="modals.moveRecord" :style="{width: '50vw'}" :modal="true">
        <tree-component 
                ref="moverecord"
                loadNodeUrl="/lider/sudo_groups/getGroups"
                loadNodeOuUrl="/lider/sudo_groups/getOuDetails"
                :treeNodeClick="moveTreeNodeClick"
                :isMove="true"
        />
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="modals.folderNameChange = false" class="p-button-text"/>
            <Button label="Taşı" icon="pi pi-check" @click="moveRecord" autofocus />
        </template>
    </Dialog>
</template>

<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import axios from 'axios';
import { useConfirm } from "primevue/useconfirm";
import { mapActions } from "vuex"
import {ref} from 'vue';

import GeneralInformations from './Components/GeneralInformations.vue';
import PasswordChange from './Components/PasswordChange.vue';
import UserGroups from './Components/UserGroups.vue';
import UserPermissionGroups from './Components/UserPermissionGroups.vue';

export default {
    setup(){
        const selectedNode = ref(null);
        const tree = ref(null);
        const confirm = useConfirm();
        const deleteUser = () => {
            confirm.require({
                message: 'Seçili kayıtlar silinecektir. Emin misiniz?',
                header: 'Kullanıcı Silme Onay',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                  
                },
                reject: () => {
                    confirm.close();
                }
            });
        }

        return { deleteUser, selectedNode, tree };
    },
    components: {
        TreeComponent,
        GeneralInformations,
        PasswordChange,
        UserGroups,
        UserPermissionGroups,
    },
    data() {
        return {
            moveFolderNode: null,
            modals : {
             folderAdd:false,
             folderNameChange: false,
             moveFolder: false,
             moveRecord: false
            },
            folderName:'',
            groupName:'',
            selectedAgents: [],
            agentGroupModal: {
                showCheckbox: true,
                groupName:'',
                checkedNodes: []
            },
            showContextMenu: false,
            contextMenuItems: [
                {label: 'View', icon: 'pi pi-fw pi-search'},
                {label: 'Delete', icon: 'pi pi-fw pi-times'}
            ],
            selectedNodeData: [],
            selectedNodeGroupMembers: [],
            sudoGruopEdit: false,
            menuitems: [
                {label:'Genel Bilgiler', command:() => this.displayFormNumber = 1},
                {label:'Parola Sıfırla', command:() => this.displayFormNumber = 2},
                {label:'Login Geçmişi',command:() => this.displayFormNumber = 3},
                {label:'Gruplar',command:() => this.displayFormNumber = 4},
                {label:'Yetki Gurupları',command:() => this.displayFormNumber = 5},
                {label:'Parola Politikası'},
                {label:'Politika Geçmişi'},
                {label:'Taşı', command:() => this.modals.moveRecord = true},
                {label:'Sil', command: () => this.deleteUser()}
            ],
            displayFormNumber: 1,
            searchFields: [
                {
                    key: this.$t('tree.id'),
                    value: "uid"
                },
                {
                    key: this.$t('tree.username'),
                    value: "cn"
                },
                {
                    key: this.$t('tree.surname'),
                    value: "sn"
                },
                {
                    key: this.$t('tree.folder'),
                    value: "ou"
                }
            ],
        }
    },
    created() {
        this.setSelectedLiderNode(null);
    },
    methods: {
        ...mapActions(["setSelectedLiderNode"]),
        treeNodeClick(node) {
            this.selectedNode = node;
            this.setSelectedLiderNode(node);

            let nodeData = [];

            node.attributesMultiValues.objectClass.map(oclas => {
                nodeData.push({
                    'label': 'Nesne Sınıfı', 
                    'value' : oclas
                })
            });
            nodeData.push({
                'label': 'Ad',
                'value': node.name,
            }, 
            {
                'label': 'Kayıt DN',
                'value': node.distinguishedName,
            },
            {
                'label': 'Oluştrulma Tarihi',
                'value': node.attributes.createTimestamp,
            },
            {
                'label': 'Güncelleme Tarihi',
                'value': node.attributes.modifyTimestamp,
            },
            {
                'label': 'Oluşturan Kişi',
                'value': node.attributes.modifiersName,

            });


            this.selectedNodeData = nodeData;


        },
        moveRecord() {},
        moveTreeNodeClick(node) {
            //*** This method for tree that is created for folder move dialog.  */
            this.moveFolderNode = node;
        },
        addFolder() {
            axios.post('/lider/sudo_groups/addOu', {
                parentName: this.selectedNode.distinguishedName,
                type:'ORGANIZATIONAL_UNIT',
                ou: this.folderName,
                distinguishedName: 'ou=' + this.folderName + ',' + this.selectedNode.distinguishedName,
                name: this.folderName
            }).then(response => {
                this.$refs.tree.append(response.data, this.selectedNode);
                this.modals.folderAdd = false;
                this.$toast.add({severity:'success', summary: 'Klasör Oluşturuldu', detail:'Başarı ile eklendi.', life: 3000});
            });
            this.folderName = '';
            this.modals.folderAdd = false;
        },
        changeFolder() {
            axios.post('/lider/sudo_groups/rename/entry', null, {
                params: {
                    oldDN: this.selectedNode.distinguishedName,
                    newName: 'ou=' + this.folderName
                }
            }).then(response => {
                this.selectedNode.distinguishedName = response.data.distinguishedName;
                this.selectedNode.name = response.data.name;
                this.$refs.tree.updateNode(this.selectedNode.distinguishedName, this.selectedNode);
                this.$toast.add({severity:'success', summary: 'Klasör Adı Değişti.', detail:'Başarı ile değiştirme yapıldı.', life: 3000});
                this.modals.folderNameChange = false;
            });
        },
        moveFolder() {
            axios.post('/lider/sudo_groups/move/entry', null ,{
                params: {
                    sourceDN: this.selectedNode.distinguishedName,
                    destinationDN: this.moveFolderNode.distinguishedName
                }
            }).then(response => {
                if (response.data) {
                    this.$refs.tree.remove(this.selectedNode);
                    this.$refs.tree.append(this.selectedNode, this.$refs.tree.getNode(this.moveFolderNode.distinguishedName));
                    this.modals.moveFolder = false;
                    this.$toast.add({severity:'success', summary: 'Klasör Taşındı.', detail:'Başarı ile taşıma yapıldı.', life: 3000});
                } else {
                    this.$toast.add({severity:'error', summary: 'HATA', detail:'Taşıma işlemi yapılamadı.', life: 3000});
                }

            });
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
        deleteSudoUser(user) {
            axios.post('/lider/sudo_groups/delete/sudo/user', null, {
                params : { uid: user ,dn: this.selectedNode.distinguishedName }
            }).then(response => {
                this.selectedNode.attributesMultiValues = response.data.attributesMultiValues;
                this.$refs.tree.updateNode(this.selectedNode.distinguishedName, this.selectedNode);
                this.treeNodeClick(response.data);
            });
        },
        handleContenxtMenu(data, node, treenode, tree){
            
            data.preventDefault();

            this.treeNodeClick(node);

            switch(node.type) {
                case 'ORGANIZATIONAL_UNIT':
                    if (node.isRoot) {
                        this.contextMenuItems = [
                            {label: 'Yeni Yetki Grubu Oluştur', command: () => {this.modals.sudoGroup = true;}},
                            {label: 'Yeni Klasör Oluştur', command: () => {this.modals.folderAdd = true}},
                        ]
                    } else {
                        this.contextMenuItems = [
                            {label: 'Yeni Yetki Grubu Oluştur',command: () => {this.modals.sudoGroup = true;}},
                            {label: 'Yeni Klasör Oluştur', command: () => {this.modals.folderAdd = true}},
                            {label: 'Klasör Adı Düzenle', command: () => {this.modals.folderNameChange = true}},
                            {label: 'Klasör Taşı', command:() => {this.modals.moveFolder = true;}},
                            {label: 'Klasör Sil', command:() => {this.deleteFolder();}},
                        ]
                    }
                    break
                case 'ROLE':
                    this.contextMenuItems = [
                        {label: 'Grubu Düzenle', command:() => {this.sudoGruopEdit = true; this.modals.sudoGroup = true}},
                        {label: 'Kaydı Taşı', command: () => {this.modals.moveFolder = true}},
                        {label: 'Yetki Grubu Sil',command:() => {this.deleteFolder();}},
                    ]
            }



            this.$refs.rightMenu.style.top = data.clientY + 'px';
            this.$refs.rightMenu.style.left = data.clientX + 'px';
            this.$refs.rightMenu.style.position = 'fixed';
            this.$refs.rightMenu.style.margin = '0';
            this.$refs.rightMenu.style.backgroundColor = '0';
            this.showContextMenu = !this.showContextMenu;
        }
    },
}
</script>

<style scoped>
.mycontextmenu {
    background-color: rgba(0,0,0,0.0);
}
.user-management {
    background-color: #e7f2f8;
}
</style>