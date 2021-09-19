<template>

    <!---
        Sudo grup oluşturma ekranı
        /lider/sudo_groups/createSudoGroup
        groupName: deneme123
        selectedOUDN: ou=Role,ou=Groups,dc=liderahenk,dc=org
        sudoUserList[]: lider
        sudoUserList[]: test_ldap_user
        sudoCommandList[]: mycommand
        sudoHostList[]: myhost

        /lider/sudo_groups/editSudoGroup
     --->

  <ConfirmDialog></ConfirmDialog>
    <div class="p-grid">
         
        <div class="p-col-3" style="min-height:90vh; background-color:#fff;margin-left:10px;margin-top:10px;">
            <tree-component 
                ref="tree"
                loadNodeUrl="/lider/sudo_groups/getGroups"
                loadNodeOuUrl="/lider/sudo_groups/getOuDetails"
                :treeNodeClick="treeNodeClick"
                @handleContextMenu="handleContenxtMenu"
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
        <div class="p-col-9">

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
    <sudo-group-dialog 
        :modalVisibleValue="modals.sudoGroup" 
        @modalVisibleValue="modals.sudoGroup = $event"
        :selectedTreeNode="selectedNode"
        @sudoGroupCreated="sudoGroupCreated"/>
</template>

<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import axios from 'axios';
import { useConfirm } from "primevue/useconfirm";
import { mapActions } from "vuex"
import {ref} from 'vue';
import SudoGroupDialog from './Dialogs/SudoGroupDialog.vue';

export default {
    setup(){
        const selectedNode = ref(null);
        const tree = ref(null);
        const confirm = useConfirm();
        const deleteFolder = () => {
            confirm.require({
                message: 'Bu işlem seçili olan klasörü ve bu klasörün altında yer alan tüm klasör ve grupları silecektir. Bu işlem geri alınamaz.',
                header: 'Klasör Silme Onay',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                   axios.post('/lider/sudo_groups/deleteEntry', null, {
                       params : { dn: selectedNode.value.distinguishedName }
                   }).then(response => {
                       tree.value.remove(selectedNode.value);
                   });
                },
                reject: () => {
                    confirm.close();
                }
            });
        }

        return { deleteFolder, selectedNode, tree };
    },
    components: {
        TreeComponent,
        SudoGroupDialog,
    },
    data() {
        return {
            moveFolderNode: null,
            modals : {
             folderAdd:false,
             folderNameChange: false,
             moveFolder: false,
             sudoGroup:false
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
            ]
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
        },
        moveTreeNodeClick(node) {
            //*** This method for tree that is created for folder move dialog.  */
            this.moveFolderNode = node;
        },
        addFolder() {
            console.log('selectd node ', this.selectedNode)
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
            console.log(this.selectedNode.distinguishedName);
            axios.post('/lider/sudo_groups/rename/entry', null, {
                params: {
                    oldDN: this.selectedNode.distinguishedName,
                    newName: 'ou=' + this.folderName
                }
            }).then(response => {
                console.log('Change Folder Response', response)
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
        sudoGroupCreated(data) {
            console.log('Sudo group oluşturuldu....', data);
            this.$refs.tree.append(data, this.selectedNode);
            this.modals.sudoGroup = false;
        },
        handleContenxtMenu(data, node, treenode, tree){
            console.log('Handle click event ', data);
            console.log('Handle click node ', node);
            console.log('Handle click treenode ', treenode);
            console.log('Handle click tree ', tree);

            data.preventDefault();

            this.selectedNode = node;
            this.setSelectedLiderNode(node);

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
                        {label: 'Grubu Düzenle'},
                        {label: 'Kaydı Taşı', command: () => {this.modals.moveFolder = true}},
                        {label: 'Yetki Grubu Sil',command:() => {this.deleteFolder();}},
                    ]
            }



            this.$refs.rightMenu.style.top = data.clientY + 'px';
            this.$refs.rightMenu.style.left = data.clientX + 'px';
            this.$refs.rightMenu.style.position = 'fixed';
            this.$refs.rightMenu.style.margin = '0';
            this.$refs.rightMenu.style.backgroundColor = '0';
            console.log('Refs', this.$refs)
            this.showContextMenu = !this.showContextMenu;
            console.log('Handle node click', data);
        }
    },
}
</script>

<style scoped>
.mycontextmenu {
    background-color: rgba(0,0,0,0.0);
}
</style>