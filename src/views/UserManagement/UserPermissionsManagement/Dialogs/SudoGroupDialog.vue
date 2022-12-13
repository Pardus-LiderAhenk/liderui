<template>
    <Dialog :header="isEdit ? $t('user_authorization_sudo.update_authority_group'): $t('user_authorization_sudo.add_authority_group')" 
        v-model:visible="modalVisible" 
        :style="{width: '40vw'}" 
        :modal="true"
        :selectedTreeNode="selectedTreeNode"
    >
        <div class="p-fluid">
            <div class="p-field">
                <label for="groupName">{{$t('user_authorization_sudo.authority_group_name')}}</label>
                <InputText :class="validation.groupName ? 'p-invalid': ''" type="text" v-model="groupName"/>
                <small v-if="validation.groupName" class="p-error">
                    {{$t('user_authorization_sudo.group_name_cannot_be_null')}}
                </small>
            </div>
        </div>
         <div class="p-fluid">
            <div class="p-field ">
                <label for="groupName">{{$t('user_authorization_sudo.feauter')}}</label>
                <div class="p-inputgroup">
                    <Dropdown class="featureDopdown" 
                        v-model="selectedFeature" 
                        :options="featureDropdownOptions"
                        optionLabel="label"
                    >
                    </Dropdown>
                    <InputText
                        :placeholder="selectedFeature.value == 'sudoUser' ? $t('user_authorization_sudo.username'): selectedFeature.value == 'sudoCommand'?'ALL':'pardus'" 
                        v-model="featureValue" 
                    />
                   
                    <Button icon="pi pi-sitemap" v-if="selectedFeature.value == 'sudoUser'"
                        :title="$t('user_authorization_sudo.select_user')" 
                        class="p-button-warning" 
                        @click="showUserTreeModal = true"
                    />
                    <Button icon="pi pi-plus" 
                        :label="$t('user_authorization_sudo.add')" 
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
                            :placeholder="$t('user_authorization_sudo.search')" 
                            />
                        </span>
                    </div>
                </div>
            </template>
            <Column field="type" :header="$t('user_authorization_sudo.feauter')" ></Column>
            <Column field="value" header="Özellik Değeri"></Column>
            <Column :exportable="false">
                <template #body="slotProps">
                    <div class="p-d-flex p-jc-end">
                        <Button 
                            :title="$t('user_authorization_sudo.delete')"
                            icon="pi pi-trash" 
                            class="p-button-rounded p-button-danger p-button-sm" 
                            @click.prevent="deleteFeature(slotProps.data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
        <template #footer>
            <Button :label="$t('user_authorization_sudo.close')" 
                icon="pi pi-times" 
                @click="modalVisible = false" 
                class="p-button-text p-button-sm"
            />
            <Button v-if="!isEdit" :label="$t('user_authorization_sudo.add')" 
                icon="pi pi-plus" 
                @click="createSudoGroup" class="p-button-sm" 
            />
            <Button v-if="isEdit" :label="$t('user_authorization_sudo.update')" 
                icon="pi pi-refresh" 
                @click="updateSudoGroup" class="p-button-sm" 
            />
        </template>
    </Dialog>
    <Dialog :header="$t('user_authorization_sudo.select_user')" 
        v-model:visible="showUserTreeModal" 
        :style="{width: '40vw'}" :modal="true"
    >
        <tree-component 
            loadNodeUrl="/api/lider/sudo-groups/users"
            loadNodeOuUrl="/api/lider/sudo-groups/get-ou-details"
            :showCheckbox="true"
            :getCheckedNodes="getCheckedUserNodes"
            :searchFields="userSearchFields"
            :scrollHeight="40"
        />
        <template #footer>
            <Button :label="$t('user_authorization_sudo.close')" 
                icon="pi pi-times" 
                @click="showUserTreeModal = false" 
                class="p-button-text p-button-sm"
            />
            <Button :label="$t('user_authorization_sudo.add')" 
                icon="pi pi-user-plus" @click="addUsersToData" 
                class="p-button-sm"
            />
        </template>
    </Dialog>
</template>

<script>
import TreeComponent from '@/components/Tree/TreeComponent.vue';
import {FilterMatchMode} from 'primevue/api';
import { sudoGroupsService } from '../../../../services/UserManagement/UserPermissionsManagement/SudoGroups';

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

        async createSudoGroup() {
            if (!this.groupName.trim()) {
                this.validation.groupName = true;
                return;
            }
            let params = this.getSudoGroupParams();

            const{ response,error } = await sudoGroupsService.createGroups(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_authorization_sudo.an_error_occurred_while_creating_the_authorization_group'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    if (response.data) {
                        this.$emit('sudoGroupCreated', response.data, this.isEdit);
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('user_authorization_sudo.authorization_group_successfully_created'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }else {
                      this.$toast.add({
                          severity:'error', 
                          detail: this.$t('user_authorization_sudo.an_error_occurred_while_creating_the_authorization_group'), 
                          summary:this.$t("computer.task.toast_summary"), 
                          life: 3000
                        });
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                          severity:'error', 
                          detail: this.$t('user_authorization_sudo.an_error_occurred_while_creating_the_authorization_group'), 
                          summary:this.$t("computer.task.toast_summary"), 
                          life: 3000
                    });
                }
            }
        },

        async updateSudoGroup() {
            if (!this.groupName.trim()) {
                this.validation.groupName = true;
                return;
            }

            let params = this.getSudoGroupParams();

            const{response,error} = await sudoGroupsService.editGroups(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_authorization_sudo.an_error_occurred_while_updating_the_authorization_group'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    if (response.data) {
                        this.$emit('sudoGroupCreated', response.data, this.isEdit);
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('user_authorization_sudo.authorization_group_successfully_update'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
                else if(response.status == 417){
                    return "error";
                }
                }
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
                    detail: this.$t('user_authorization_sudo.value_cannot_be_null'), 
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
