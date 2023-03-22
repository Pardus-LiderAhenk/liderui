<template>
    <div>
        <Dialog
            :header="type && type == 'user'? 'Kullanıcı Ekle': 'Grup Ekle'" 
            :modal="true"
            :style="{ width: '40vw'}"
            v-model:visible="showDialog">
            <div class="p-fluid">
                <div class="p-field p-grid">
                    <div class="p-col">
                        <label>Adı</label>
                        <InputText type="text" class="p-inputtext-sm" v-model="label"/>
                    </div>
                    <div class="p-col">
                        <label>Açıklama</label>
                        <InputText type="text" class="p-inputtext-sm" v-model="description"/>
                    </div>
                </div>
                <div class="p-field" v-if="type=='user'">
                    <tree-component 
                        ref="usertree"
                        loadNodeUrl="/api/lider/user-groups/users"
                        loadNodeOuUrl="/api/lider/user-groups/ou-details"
                        :showCheckbox="true"
                        :getCheckedNodes="getCheckedUserNodes"
                        :searchFields="searchUserFields"
                        :scrollHeight="40"
                    />
                    <div class="p-col p-text-center">
                        <small>{{$t('group_management.select_user')}}</small>
                    </div>
                </div>

                <div class="p-field" v-if="type=='group'">
                    <tree-component 
                        ref="usergrouptree"
                        loadNodeUrl="/api/lider/user-groups/groups"
                        loadNodeOuUrl="/api/lider/user-groups/ou-details"
                        :showCheckbox="true"
                        :getCheckedNodes="getCheckedUserGroupNodes"
                        :searchFields="searchFields"
                        :scrollHeight="40"
                    />
                    <div class="p-col p-text-center">
                        <small>{{$t('group_management.select_user')}}</small>
                    </div>
                </div>

            </div>
            
            <template #footer>
                <Button 
                    :label="$t('group_management.close')" 
                    icon="pi pi-times"
                    @click="showDialog = false" 
                    class="p-button-text p-button-sm">
                </Button>
                <Button :label="$t('group_management.add')" icon="pi pi-plus"
                    @click="addPolicyException" class="p-button-sm"
                />
            </template>
        </Dialog>
    </div>  
</template>

<script>

/**
 * Add policy exception dialog
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import {FilterMatchMode} from 'primevue/api';

export default {

    props: {
        addPolicyExceptionDialog: {
            type: Boolean,
            default: false,
        },
        selectedPolicy: {
            type: Object,
            description: "selected policy",
        },
        type: {
            type: String,
            default: "user",
        },
    },

    data() {
        return {
            members: [],
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            },
            selectedNodeSummaryData: [],
            attributesMultiValue: false,
            loading: false,
            isDomainAdmin: false,
            selectedMembers: [],
            label: "",
            description: "",
            checkedNodes: [],
            searchUserFields: [
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
        }
    },


    computed: {
        showDialog: {
            get () {
                return this.addPolicyExceptionDialog
            },

            set (value) {
                if (!value) {
                    this.$emit('closePolicyExceptionDialog');
                }
            }
        },
    },


    methods: {
        getCheckedUserNodes(nodes) {
            this.checkedNodes = [];
            nodes.forEach(element => {
                if (element.type == "USER") {
                    this.checkedNodes.push(element.distinguishedName)    
                }
            });
        },

        getCheckedUserGroupNodes(nodes) {
            this.checkedNodes = [];
            nodes.forEach(element => {
                if (element.type == "GROUP") {
                    this.checkedNodes.push(element.distinguishedName)    
                }
            });
        },

        async addPolicyException() {
            if (this.checkedNodes.length == 0) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t("group_management.select_least_one_member"), 
                    summary: this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            let params = {
                "members": this.checkedNodes,
                // "dn": data.member,
                "policy": this.selectedPolicy,
                "label": this.label,
                "description": this.description,
                // "dnType": this.selectedLiderNode.type,
            }
            this.$emit('addPolicyException', params);
            this.showDialog = false;
        },
    },
}
</script>

<style lang="scss" scoped>

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