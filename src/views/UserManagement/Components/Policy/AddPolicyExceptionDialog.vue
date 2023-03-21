<template>
    <div>
        <Dialog
            :header="$t('group_management.members_of_group')" 
            :modal="true"
            :style="{ width: '40vw'}"
            v-model:visible="showDialog">
            <div class="p-fluid">
                <div class="p-field p-grid">
                    <div class="p-col">
                        <label>{{$t('group_management.name')}}</label>
                        <InputText type="text" class="p-inputtext-sm" v-model="label"/>
                    </div>
                    <div class="p-col">
                        <label>{{$t('group_management.description')}}</label>
                        <InputText type="text" class="p-inputtext-sm" v-model="description"/>
                    </div>
                </div>
                <div class="p-field">
                    <DataTable  
                        :value="members" class="p-datatable-sm"
                        style="margin-top: 2em"
                        v-model:filters="filters"
                        responsiveLayout="stack" :loading="loading"
                        :paginator="true" :rows="10"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        v-model:selection="selectedMembers"
                        @rowSelect="onRowSelect" 
                        :rowsPerPageOptions="[10,25,50]">
                        <template #header>
                            <div class="p-d-flex p-jc-end">
                                <div>
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search"/>
                                        <InputText 
                                            v-model="filters['global'].value" 
                                            class="p-inputtext-sm" 
                                            :placeholder="$t('group_management.search')" 
                                        />
                                    </span>
                                </div>
                            </div>
                        </template>
                        <template #empty>
                            <div class="p-d-flex p-jc-center">
                                <span>{{ $t('group_management.member_empty_message') }}</span>
                            </div>
                        </template>
                        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
                        <Column header="#" style="width: 10%">
                            <template #body="{index}">
                                <span>{{ index + 1 }}</span>
                            </template>
                        </Column>
                        <Column field="member" 
                            :header="$t('group_management.member')"
                            style="min-width: 80%">
                        </Column>
                        <!-- <Column :exportable="false" style="width: 10%">
                            <template #body="slotProps">
                                <div class="p-d-flex p-jc-end">
                                    <Button
                                        class="p-button-sm p-button-rounded"
                                        icon="pi pi-plus"
                                        :title="$t('group_management.add')"
                                        @click.prevent="addPolicyException(slotProps.data)">
                                    </Button>
                                </div>
                            </template>
                        </Column> -->
                    </DataTable>
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
 * User Group Management. Member Of User Group component
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import {FilterMatchMode} from 'primevue/api';
import { mapGetters, mapActions } from "vuex"

export default {

    props: ["addPolicyExceptionDialog", "selectedPolicy", "selectedPolicyException"],

    data() {
        return {
            members: [],
            filters: {},
            selectedNodeSummaryData: [],
            attributesMultiValue: false,
            loading: false,
            isDomainAdmin: false,
            selectedMembers: [],
            label: "",
            description: ""

        }
    },

    created() {
        this.initFilters();
    },

    computed: {
        ...mapGetters(["selectedLiderNode"]),
        
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
        initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            }
        },

        getMemberOfSelectedGroup(node) {
            if (this.selectedPolicyException) {
                this.selectedPolicyException.forEach(element => {
                    this.selectedMembers.push({
                        member: element
                    });
                });
            }

            this.members = [];
            for (var key in node.attributesMultiValues) {
				if (node.attributesMultiValues.hasOwnProperty(key) && key == "member") {
					if(node.attributesMultiValues[key].length > 1) {
                        this.attributesMultiValue = true;
						for(var i = 0; i< node.attributesMultiValues[key].length; i++) {
                            this.members.push({
                                "member": node.attributesMultiValues[key][i],
                            });
                        }
                    } else {
                        this.attributesMultiValue = false;
                        this.members.push({
                            "member": node.attributesMultiValues[key][0],
                        });
                    }
                }
            }
        },

        async addPolicyException() {
            let members = [];
            this.selectedMembers.forEach(element => {
                members.push(element.member);
            });
            if (members.length == 0) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t("group_management.select_least_one_member"),
                    summary: this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            // if (!this.label.trim()) {
            //     this.$toast.add({
            //         severity:'warn', 
            //         detail: "Ad giriniz", 
            //         summary: this.$t("computer.task.toast_summary"), 
            //         life: 3000
            //     });
            //     return;
            // }

            let params = {
                "members": members,
                // "dn": data.member,
                "policy": this.selectedPolicy,
                "label": this.label,
                "description": this.description,
                // "dnType": this.selectedLiderNode.type,
                "groupDn": this.selectedLiderNode.distinguishedName
            }
            this.$emit('addPolicyException', params);
            this.showDialog = false;
        },
    },

    mounted() {
        this.getMemberOfSelectedGroup(this.selectedLiderNode);
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