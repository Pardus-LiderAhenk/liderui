<template>
    <Dialog header="Yetki Grubu Oluştur" 
            v-model:visible="modalVisible" 
            :style="{width: '80vw'}" 
            :modal="true" position="top"
            :selectedTreeNode="selectedTreeNode"
            :breakpoints="{'960px': '90vw'}">
        <div class="p-fluid">
            <div class="p-field">
                <label for="groupName">Kullanıcı Grup Adı</label>
                <InputText id="groupName" type="text" v-model="groupName" />
                <small id="username1-help"></small>
            </div>
        </div>
         <div class="p-fluid">
            <div class="p-field ">
                <label for="groupName">Özellik</label>
                <div class="p-inputgroup">
                    <Dropdown class="featureDopdown" v-model="selectedFeature" :options="featureDropdownOptions"
                            optionLabel="label" 
                            style="{width: '50%'}"
                            >
                    </Dropdown>
                    <InputText placeholder="" v-model="featureValue" />
                    <Button icon="pi pi-check"  class="p-button-success" @click="showUserTreeModal = true"/>
                    <Button label="Ekle" @click="addNewFeature()"/>
                </div>
            </div>
         </div>
         <DataTable :value="featureData" responsiveLayout="scroll">
            <Column field="type" header="Özellik"></Column>
            <Column field="value" header="Özellik Değeri"></Column>
            <Column  >
                <template #body="slotProps">
                    <Button icon="pi pi-times" class="p-button-rounded p-button-danger" @click="deleteFeature(slotProps.data)"/>
                </template>
            </Column>
        </DataTable>
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="closeModal()" class="p-button-text"/>
            <Button label="Oluştur" icon="pi pi-check" @click="createSudoGroup" autofocus />
        </template>
    </Dialog>
    <Dialog header="Kullanıcı seç" v-model:visible="showUserTreeModal" :style="{width: '60vw'}" :modal="true" :breakpoints="{'960px': '80vw'}">
        <tree-component 
            loadNodeUrl="/lider/sudo_groups/getUsers"
            loadNodeOuUrl="/lider/sudo_groups/getOuDetails"
            :showCheckbox="true"
            :getCheckedNodes="getCheckedUserNodes"
        />
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="showUserTreeModal = false" class="p-button-text"/>
            <Button label="Ekle" icon="pi pi-check" @click="addUsersToData" autofocus />
        </template>
    </Dialog>
</template>

<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import axios from 'axios';
export default {
    components: {
        TreeComponent
    },
    props: ['modalVisibleValue','selectedTreeNode', 'isEdit'],
    data() {
        return {
            featureDropdownOptions: [
                {label: 'sudoCommand', value:'sudoCommand'},
                {label: 'sudoHost', value:'sudoHost'},
                {label: 'sudoUser', value:'sudoUser'}
            ],
            selectedFeature: '',
            featureValue: '',
            groupName: '',
            featureData:[],
            showUserTreeModal: false,
            checkedUserNodes: [],
        }
    },
    computed: {
        modalVisible: {
            get() {
                 this.updateRecord();
                return this.modalVisibleValue;
            },
            set() {
                this.$emit('modalVisibleValue', false);
            }
        },
    },
    beforeUpdate() {
        
    },
    methods: {
        updateRecord() {
            console.log('İs Edit ? ', this.isEdit);
            if (this.isEdit) {
                this.featureData = [];
                this.groupName = '';
                if (this.selectedTreeNode.attributesMultiValues.sudoUser) {
                    this.selectedTreeNode.attributesMultiValues.sudoUser.map(user => {
                        this.featureData.push(
                                {
                                'type': 'sudoUser',
                                'value': user
                                }
                            )
                    });
                }

                if (this.selectedTreeNode.attributesMultiValues.sudoCommand) {
                    this.selectedTreeNode.attributesMultiValues.sudoCommand.map(command => {
                        this.featureData.push(
                                {
                                'type': 'sudoCommand',
                                'value': command
                                }
                            )
                    });
                }
                if(this.selectedTreeNode.attributesMultiValues.sudoHost) {
                    this.selectedTreeNode.attributesMultiValues.sudoHost.map(host => {
                        this.featureData.push(
                                {
                                'type': 'sudoHost',
                                'value': host
                                }
                            )
                    });
                }
                

                this.groupName = this.selectedTreeNode.name;
            } else {
                this.groupName = '';
                this.featureData = [];
            }
            
        },
        createSudoGroup() {
            let sudoUserList = [];
            let sudoCommandList = [];
            let sudoHostList = [];

            this.featureData.map ( data => {
                if ( data.type === 'sudoUser') {
                    sudoUserList.push(data.value);
                } else if (data.type === 'sudoCommand') {
                    sudoCommandList.push(data.value);
                } else {
                    sudoHostList.push(data.value);
                }
            });
            console.log('Edit modda mıyız ? ', this.isEdit);
            let postUrl = this.isEdit ? '/lider/sudo_groups/editSudoGroup' : '/lider/sudo_groups/createSudoGroup'; 


            let postData = this.isEdit ? {
                'newName': 'cn=' + this.groupName,
                'selectedDN': this.selectedTreeNode.distinguishedName,
                'sudoUserList': sudoUserList,
                'sudoCommandList': sudoCommandList,
                'sudoHostList': sudoHostList
            } : {
                groupName: this.groupName,
                selectedOUDN: this.selectedTreeNode.distinguishedName,
                sudoUserList: sudoUserList,
                sudoCommandList: sudoCommandList,
                sudoHostList: sudoHostList
            };


            axios.post(postUrl,postData).then(response => {
                    if (response.data === "") {
                        this.$toast.add({severity:'error', summary: 'HATA', detail:'Ekleme başarısız. Lütfen grup adını kontrol edip tekrar deneyiniz.', life: 3000});
                    } else {
                        console.log('sudo group cevap geldi', response);
                        this.$emit('sudoGroupCreated', response.data, this.isEdit);

                    }
            });
        },
        deleteFeature(data) {
            this.featureData = this.featureData.filter( val => val === data.value);
        },
        addNewFeature() {

            if (this.selectedFeature === '' || this.featureValue === '') {
                console.log('Seçmedin')
                return;
            }

            this.featureData.push(
                {
                   'type': this.selectedFeature.label,
                   'value': this.featureValue
                }
            )

            this.selectedFeature = '';
            this.featureValue = '';
        },
        addUsersToData () {
            this.checkedUserNodes.map(user => {
                this.featureData.push({
                    'type': this.selectedFeature.label,
                    'value': user
                });
            });
        },
        getCheckedUserNodes(nodes) {
            this.checkedUserNodes = nodes.map(node => {
                return node.uid;
            });
        },
        closeModal() {
           this.$emit('modalVisibleValue', false);
        }
    },
}

</script>

<style scoped>

.featureDopdown {
    width: 100px;
}

</style>
