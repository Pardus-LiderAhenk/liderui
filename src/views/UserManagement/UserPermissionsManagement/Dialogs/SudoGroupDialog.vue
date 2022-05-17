<template>
    <Dialog :header="isEdit ? 'Yetki Grubu Güncelle': 'Yetki Grubu Ekle'" 
        v-model:visible="modalVisible" 
        :style="{width: '40vw'}" 
        :modal="true"
        :selectedTreeNode="selectedTreeNode"
    >
        <div class="p-fluid">
            <div class="p-field">
                <label for="groupName">Yetki Grup Adı</label>
                <InputText :class="validation.groupName ? 'p-invalid': ''" type="text" v-model="groupName"/>
                <small v-if="validation.groupName" class="p-error">
                    Grup adı boş bırakılamaz
                </small>
            </div>
        </div>
         <div class="p-fluid">
            <div class="p-field ">
                <label for="groupName">Özellik</label>
                <div class="p-inputgroup">
                    <Dropdown class="featureDopdown" 
                        v-model="selectedFeature" 
                        :options="featureDropdownOptions"
                        optionLabel="label"
                    >
                    </Dropdown>
                    <InputText
                        :placeholder="selectedFeature.value == 'sudoUser' ? 'Kullanıcı Adı': selectedFeature.value == 'sudoCommand'?'ALL':'pardus'" 
                        v-model="featureValue" 
                    />
                   
                    <Button icon="pi pi-sitemap" v-if="selectedFeature.value == 'sudoUser'"
                        title="Kullanıcı Seç" 
                        class="p-button-warning" 
                        @click="showUserTreeModal = true"
                    />
                    <Button icon="pi pi-plus" 
                        label="Ekle" 
                        @click="addNewFeature()"
                    />
                </div>
            </div>
         </div>
         <DataTable :value="featureData" 
            class="p-datatable-sm"
            v-model:filters="filters"
            :paginator="true" :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
            :rowsPerPageOptions="[10,25,50,100]"  style="margin-top: 2em"
          >
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
            <Column field="type" header="Özellik"></Column>
            <Column field="value" header="Özellik Değeri"></Column>
            <Column :exportable="false">
                <template #body="slotProps">
                    <div class="p-d-flex p-jc-end">
                        <Button 
                            title="Sil"
                            icon="pi pi-trash" 
                            class="p-button-rounded p-button-danger p-button-sm" 
                            @click.prevent="deleteFeature(slotProps.data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
        <template #footer>
            <Button label="Kapat" 
                icon="pi pi-times" 
                @click="modalVisible = false" 
                class="p-button-text p-button-sm"
            />
            <Button v-if="!isEdit" label="Ekle" 
                icon="pi pi-plus" 
                @click="createSudoGroup" class="p-button-sm" 
            />
            <Button v-if="isEdit" label="Güncelle" 
                icon="pi pi-refresh" 
                @click="updateSudoGroup" class="p-button-sm" 
            />
        </template>
    </Dialog>
    <Dialog header="Kullanıcı seç" 
        v-model:visible="showUserTreeModal" 
        :style="{width: '40vw'}" :modal="true"
    >
        <tree-component 
            loadNodeUrl="/lider/sudo_groups/getUsers"
            loadNodeOuUrl="/lider/sudo_groups/getOuDetails"
            :showCheckbox="true"
            :getCheckedNodes="getCheckedUserNodes"
            :searchFields="userSearchFields"
        />
        <template #footer>
            <Button label="İptal" 
                icon="pi pi-times" 
                @click="showUserTreeModal = false" 
                class="p-button-text p-button-sm"
            />
            <Button label="Ekle" 
                icon="pi pi-user-plus" @click="addUsersToData" 
                class="p-button-sm"
            />
        </template>
    </Dialog>
</template>

<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import axios from 'axios';
import {FilterMatchMode} from 'primevue/api';

export default {
    components: {
        TreeComponent
    },

    props: ['modalVisibleValue','selectedTreeNode', 'isEdit'],

    data() {
        return {
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
            },
            featureDropdownOptions: [
                {label: 'sudoCommand', value:'sudoCommand'},
                {label: 'sudoHost', value:'sudoHost'},
                {label: 'sudoUser', value:'sudoUser'}
            ],
            selectedFeature: {
                label: 'sudoUser', 
                value:'sudoUser'
            },
            featureValue: '',
            groupName: '',
            featureData: [],
            showUserTreeModal: false,
            checkedUserNodes: [],
            deleteSudoUserDialog: false,
            validation: {
                groupName: false,
            },
            userSearchFields: [
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

    methods: {
        updateRecord() {
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
            if (!this.groupName.trim()) {
                this.validation.groupName = true;
                return;
            }
            let params = this.getSudoGroupParams();
            axios.post("/lider/sudo_groups/createSudoGroup",params).then(response => {
                if (response.data) {
                    this.$emit('sudoGroupCreated', response.data, this.isEdit);
                    this.$toast.add({
                        severity:'success', 
                        detail: "Yetki grubu başarıyla oluşturuldu", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'success', 
                        detail: "Yetki grubu oluşturulurken hata oluştu", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            });
        },

        updateSudoGroup() {
            if (!this.groupName.trim()) {
                this.validation.groupName = true;
                return;
            }

            let params = this.getSudoGroupParams();
            axios.post("/lider/sudo_groups/editSudoGroup",params).then(response => {
                if (response.data) {
                    this.$emit('sudoGroupCreated', response.data, this.isEdit);
                    this.$toast.add({
                        severity:'success', 
                        detail: "Yetki grubu başarıyla güncellendi", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: "Yetki grubu güncellenirken hata oluştu", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            });
        },

        getSudoGroupParams() {
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
            let params = this.isEdit ? {
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
            return params;
        },

        deleteFeature(data) {
            var index = this.featureData.findIndex(function(item, i){
                return (item.value === data.value && item.type === data.type);
            });
            if (index > -1) {
                this.featureData.splice(index, 1);
            }
        },

        addNewFeature() {
            if (this.selectedFeature === '' || this.featureValue === '') {
                this.$toast.add({
                    severity:'warn', 
                    detail: "Kullanıcı adı, bilgisayar adı veya komut değeri boş bırakılamaz", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            this.featureData.push(
                {
                   'type': this.selectedFeature.label,
                   'value': this.featureValue
                }
            );
            this.selectedFeature = {
                label: 'sudoUser', 
                value:'sudoUser'
            };
            this.featureValue = '';
        },

        addUsersToData () {
            this.checkedUserNodes.map(user => {
                this.featureData.push({
                    'type': this.selectedFeature.label,
                    'value': user
                });
            });
            this.showUserTreeModal = false;
        },

        getCheckedUserNodes(nodes) {
            this.checkedUserNodes = nodes.map(node => {
                return node.uid;
            });
        },
    },

    watch : {
        groupName() {
            if (this.groupName.trim()) {
                this.validation.groupName = false;
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.featureDopdown {
    width: 100px;
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
