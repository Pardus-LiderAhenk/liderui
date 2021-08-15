<template>
  <ConfirmDialog></ConfirmDialog>
    <div class="p-grid">
         
        <div class="p-col-3">
            <Toolbar>
                <template #left>
                    
                    <SplitButton @click="modals.folderAdd = true" label="Klasör Ekle" icon="pi pi-check" :model="folderItems" class="p-button-warning"></SplitButton>
                    <Button label="Yeni Grup" icon="fa fa-users" class="p-mr-2" style="margin-left:5px" @click="modals.agentGroup = true"/>
                </template>
            </Toolbar>
            <tree-component 
                ref="tree"
                loadNodeUrl="/lider/computer_groups/getGroups"
                loadNodeOuUrl="/lider/computer_groups/getOuDetails"
                :treeNodeClick="treeNodeClick"
                />
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
                ref="tree"
                loadNodeUrl="/lider/computer_groups/getGroups"
                loadNodeOuUrl="/lider/computer_groups/getOuDetails"
                :treeNodeClick="treeNodeClick"
        />
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="modals.folderNameChange = false" class="p-button-text"/>
            <Button label="Taşı" icon="pi pi-check" @click="changeFolder" autofocus />
        </template>
    </Dialog>
    <Dialog header="İstemci Grubu Oluştur" v-model:visible="modals.agentGroup" :style="{width: '50vw'}" :modal="true">
        <TabView>
            <TabPanel header="Grup Bilgileri">
                <div class="p-fluid">
                    <div class="p-field">
                        <label for="groupName">İstemci Grup Adı</label>
                        <InputText id="groupName" type="text" v-model="agentGroupModal.groupName" />
                        <small id="username1-help"></small>
                    </div>
                </div>
                <tree-component 
                        ref="tree"
                        loadNodeUrl="/lider/computer/getComputers"
                        loadNodeOuUrl="/lider/computer/getOuDetails"
                        :showCheckbox="agentGroupModal.showCheckbox"
                        :getCheckedNodes="getCheckedAgentNodes"
                        :renderSearchContent="renderSearchContent"
                        :treeNodeClick="setSelectedLiderNode"
                />
            </TabPanel>
            <TabPanel >
                <template #header>
                    <span>Seçili İstemciler <Badge :value="agentGroupModal.checkedNodes.length"></Badge> </span>
                </template>
                <DataTable :value="agentGroupModal.checkedNodes" responsiveLayout="scroll">
                    <Column field="distinguishedName" header="Name"></Column>
                    <Column  >
                        <template #body="slotProps">
                            <Button icon="pi pi-times" class="p-button-rounded p-button-danger" @click="removeAgentFromGroup(slotProps.data)"/>
                        </template>
                    </Column>
                </DataTable>
            </TabPanel>
        </TabView>

            
        
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="modals.folderNameChange = false" class="p-button-text"/>
            <Button label="Oluştur" icon="pi pi-check" @click="changeFolder" autofocus />
        </template>
    </Dialog>
</template>

<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import axios from 'axios';
import { useConfirm } from "primevue/useconfirm";
import { mapActions } from "vuex"

export default {
    setup(){
        const confirm = useConfirm();
         const deleteFolder = () => {
            confirm.require({
                message: 'Bu işlem seçili olan klasörü ve bu klasörün altında yer alan tüm klasör ve grupları silecektir. Bu işlem geri alınamaz.',
                header: 'Klasör Silme Onay',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                   axios.post('/lider/computer_groups/deleteEntry', {
                       dn: this.selectedNode.distinguishedName
                   }).then(response => {
                       console.log(response.data);
                       this.$refs.tree.remove(this.selectedNode);
                   });
                },
                reject: () => {
                    confirm.close();
                }
            });
        }

        return { deleteFolder, };
    },
    components: {
        TreeComponent
    },
    data() {
        return {
            selectedNode: null,
            moveFolderNode: null,
            modals : {
             folderAdd:false,
             folderNameChange: false,
             moveFolder: false,
             agentGroup:false
            },
            folderName:'',
            groupName:'',
            selectedAgents: [],
            folderItems: [
                {
                    label: 'Klasör Adını Değiştir',
                    icon: 'pi pi-refresh',
                    command: () => {
                        this.modals.folderNameChange = true;
                    }
                },
                {
                    label: 'Klasör Sil',
                    icon: 'pi pi-times',
                    command: () => {
                        this.deleteFolder();
                    }
                },
                {
                    label: 'Klasör Taşı',
                    icon: 'pi pi-external-link',
                    command: () => {
                       this.modals.moveFolder = true;
                    }
                },
            ],
            agentGroupModal: {
                showCheckbox: true,
                groupName:'',
                checkedNodes: []
            }
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
        addFolder() {
            axios.post('/lider/computer_groups/addOu', {
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
            console.log('Folder Will Chaneg', this.selectedNode);
            axios.post('/lider/computer_groups/rename/entry', null, {
                params: {
                    oldDN: this.selectedNode.distinguishedName,
                    newName: 'ou=' + this.folderName
                }
            }).then(response => {
                this.selectedNode.distinguishedName = response.data.distinguishedName;
                this.selectedNode.name = response.data.name;
                this.$refs.tree.updateNode(this.selectedNode.distinguishedName, this.selectedNode);
            });
        },
        moveFolder() {
            axios.post('/lider/computer_groups/move/entry', {
                sourceDN: this.selectedNode.distinguishedName,
                destinationDN: this.moveFolderNode.distinguishedName
            }).then(response => {
                console.log(response);
            });
        },
        cretaeAgentGroup() {
            axios.post('/lider/computer_groups/createNewAgentGroup', {
                groupName: this.groupName,
                checkedList: this.selectedAgents,
                selectedOUDN: this.selectedNode.distinguishedName
            }).then(response => {
                console.log(resposense.data);
                this.$refs.tree.append(response.data, this.selectedNode);
            });
        },
        getCheckedAgentNodes(nodes) {
            this.agentGroupModal.checkedNodes = nodes;
        },
        removeAgentFromGroup(node) {
            console.log(node);
            this.agentGroupModal.checkedNodes = this.agentGroupModal.checkedNodes.filter(
                agent => {
                    if (agent.distinguishedName != node.distinguishedName) {
                        return agent;
                    } else {
                         this.$refs.tree.setCheckedNode(node.distinguishedName, false);
                    }
                }
            )
        }, 
         renderSearchContent(h, { node, data, store }) {
            let linuxIcon = require("@/assets/images/icons/linux.png");
            let groupIcon = require("@/assets/images/icons/entry_group.gif");
            let iconSource = "fa fa-folder-open";

            if (data.type === "ORGANIZATIONAL_UNIT") {
                iconSource = "fa fa-folder-open";
            } else if (data.type === "AHENK") {
                iconSource = linuxIcon;
            } else {
                iconSource = groupIcon;
            }

            const result = this.agentGroupModal.checkedNodes.map(agent => {
                if (agent.distinguishedName === data.distinguishedName) {
                    return true;
                }
            });

            let funcText = "Ekle";
            let isAppend = true;
            if (result.length > 0) {
                funcText = "Çıkar";
                isAppend = false;
            }

            return h("span", {
                    class: "custom-tree-node"
                    }, 
                    h("img", {src:iconSource, style:"width:20px"}),
                    h("span", null, node.label), 
                    h("span", null, 
                    h("a", {onClick: () => this.addRemoveAgentToGroup(data,isAppend)}, funcText),
                ));
        },
        addRemoveAgentToGroup(node,isAppend) {
            this.$refs.tree.setCheckedNode(node.distinguishedName, isAppend);
            if (isAppend) {
                this.agentGroupModal.checkedNodes.push(node);
            } else {
                this.agentGroupModal.checkedNodes = this.agentGroupModal.checkedNodes.filter(agent => {
                    if(agent.distinguishedName !== node.distinguishedName) {
                        return agent;
                    }
                });
            }
        }
    
    }, 
}
</script>

<style scoped>

</style>