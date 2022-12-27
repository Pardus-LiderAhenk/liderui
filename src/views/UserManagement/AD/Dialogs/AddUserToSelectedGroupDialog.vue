<template>
    <div>
        <!-- Add User to Selected Group Dialog -->
        <Dialog :header="$t('user_management.ad.add_member_to_group')" v-model:visible="showDialog" 
            :style="{width: '40vw'}" :modal="true">
            <div class="p-fluid p-formgrid p-grid p-col">
                <div class="p-field p-col-12 p-md-4">
                    <label>{{$t('user_management.ad.search_field')}}</label>
                    <Dropdown
                        v-model="selectedUserField" 
                        :options="searchUserFields" optionLabel="key"
                        :showClear="true" 
                        :placeholder="$t('user_management.select')">
                    </Dropdown>
                </div>
                <div class="p-field p-col-12 p-md-8">
                    <label>{{$t('user_management.ad.search_value')}}</label>
                    <div class="p-inputgroup">
                    <InputText :class="validation.userSearchValue ? 'p-invalid': ''" type="text" v-model="userSearchValue"/>
                    <Button type="button"
                        class="p-button-sm" 
                        :label="$t('computer.plugins.file_management.search')" 
                        icon="pi pi-search" 
                        @click.prevent="searchUser" 
                    />
                    </div>
                    <small v-if="validation.userSearchValue" class="p-error">
                        {{ $t('user_management.search_value_warn')}}
                    </small>
                </div>
            </div>
            <div class="p-field">
                <DataTable :value="users" class="p-datatable-sm" v-model:filters="filters" :loading="searchLoading">
                    <template #loading>
                        <div class="p-d-flex p-jc-center">
                            {{$t('user_management.ad.searching')}}
                        </div>
                    </template>
                    <template #header>
                        <div class="p-d-flex p-jc-end">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search"/>
                                <InputText v-model="filters['global'].value" 
                                class="p-inputtext-sm" 
                                :placeholder="$t('user_management.search')" 
                                />
                            </span>
                        </div>
                    </template>
                    <template #empty>
                        <div class="p-d-flex p-jc-center">
                            <span>{{$t('user_management.ad.user_table_empty_message')}}</span>
                        </div>
                    </template>
                    <Column field="name" :header="$t('user_management.name')" style="width:20%"></Column>
                    <Column field="type" :header="$t('user_management.type')" style="width:20%"></Column>
                    <Column field="distinguishedName" :header="$t('user_management.dn')" style="width:50%"></Column>
                    <Column :exportable="false" style="width:10%">
                        <template #body="slotProps">
                            <div class="p-d-flex p-jc-end">
                                <Button class="p-button-sm p-button-rounded" 
                                    icon="pi pi-user-plus" 
                                    :title="$t('user_management.add')"
                                    @click.prevent="addUserToGroup(slotProps.data)">
                                </Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
            <template #footer>
                <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
            </template>
        </Dialog>
        <!--  Add User to Selected Group Dialog End-->
    </div>
</template>

<script>
/**
 * Add member to selected group as user in AD tree
 * @see {@link http://www.liderahenk.org/}
 */

import {FilterMatchMode} from 'primevue/api';
import { adManagementService } from "../../../../services/UserManagement/AD/AdManagement";
import { mapGetters } from "vuex"

export default {

    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },

        addMemberDialog: {
            type: Boolean,
            default: false,
            description: "Selected tree node",
        },
    },

    data(){
        return{
            selectedUserField: null,
            users: null,
            userSearchValue: '',
            validation: {
                userSearchValue: false,
            },
            searchUserFields: [
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
            ],
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            searchLoading: false
        }
    },

    computed: {
        ...mapGetters(["selectedLiderNode"]),

        showDialog: {
            get () {
                return this.addMemberDialog
            },

            set (value) {
                if (!value) {
                    this.$emit('closeAdDialog')
                }
            }
        }
    },

    methods: {
        async searchUser() {
            if (!this.searchUserFields) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.search_field_warn'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            if (!this.userSearchValue.trim()) {
                this.validation.userSearchValue = true;
                return;
            }
            this.searchLoading = true;
            let params = new FormData();
            params.append("searchDn", "");
            params.append("key", this.selectedUserField.value);
            params.append("value", this.userSearchValue);
            const{response,error} =  await adManagementService.searchEntryUserList(params);
            this.searchLoading = false;
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.user_not_found'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                    });
            }
            else{
                if(response.status = 200){
                    if (response.data) {
                        this.users = response.data;
                    } 
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.error_417_user_not_found'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }                
        },

        async addUserToGroup(data) {
            if (this.isExistMember(data.distinguishedName)) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('user_management.user_already_exist_in_group'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            let params = new FormData();
            params.append("searchDn", "");
            params.append("parentName", this.selectedNode.distinguishedName);
            params.append("distinguishedName", data.distinguishedName);

            const { response,error } = await  adManagementService.addMemberToAdGroup(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.add_user_to_group_error'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                    });
            }
            else{
                if(response.status == 200){
                    if (response.data) {
                        let updatedNode = this.selectedNode;
                        updatedNode.attributesMultiValues.member = response.data.attributesMultiValues.member;
                        this.$emit('updateNode', response.data, updatedNode);
                        
                        this.$emit('closeAdDialog');
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('user_management.add_user_to_group_success'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    } 
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.error_417_add_user_to_group'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
        },

        isExistMember(userDn) {
            let isExist = false;
            for (const key in this.selectedLiderNode.attributesMultiValues) {
                if (Object.hasOwnProperty.call(this.selectedLiderNode.attributesMultiValues, key)) {
                    const element = this.selectedLiderNode.attributesMultiValues[key];
                    if (key == "member" && element.length > 0) {
                        for (let index = 0; index < element.length; index++) {
                            const member = element[index];
                            if(userDn == member) {
                                isExist = true;
                            }
                        }
                    }
                }
            }
            return isExist;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
