<template>
    <div>
        <Dialog
            :header="$t('group_management.computer_group.members_of_group')" 
            :modal="true"
            :style="{ width: '40vw'}"
            v-model:visible="showMemberDialog">
            <DataTable  
                :value="members" class="p-datatable-sm"
                style="margin-top: 2em"
                v-model:filters="filters"
                responsiveLayout="stack" :loading="loading"
                :paginator="true" :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                :rowsPerPageOptions="[10,25,50]">
                <template #header>
                    <div class="p-d-flex p-jc-end">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"/>
                            <InputText 
                                v-model="filters['global'].value" 
                                class="p-inputtext-sm" 
                                :placeholder="$t('group_management.computer_group.search')" 
                            />
                        </span>
                    </div>
                </template>
                <template #empty>
                    <div class="p-d-flex p-jc-center">
                        <span>{{ $t('group_management.computer_group.member_empty_message') }}</span>
                    </div>
                </template>
                <Column field="index" header="#" style="width: 10%"></Column>
                <Column field="memberDn" 
                    :header="$t('group_management.computer_group.member')"
                    style="min-width: 80%">
                </Column>
                <Column :exportable="false" style="width: 10%">
                    <template #body="slotProps">
                        <div class="p-d-flex p-jc-end">
                            <Button
                                class="p-button-sm p-button-danger p-button-rounded"
                                icon="pi pi-trash"
                                :title="$t('group_management.computer_group.delete')"
                                @click.prevent="deleteMemberFromGroup(slotProps.data)">
                            </Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
            <template #footer>
                <Button 
                    :label="$t('group_management.computer_group.close')" 
                    icon="pi pi-times"
                    @click="showMemberDialog = false" 
                    class="p-button-text p-button-sm">
                </Button>
            </template>
        </Dialog>
        <Card>
            <template #title>
                <div class="p-d-flex p-jc-between">
                    <div style="font-size:15px;">
                        {{ $t("group_management.computer_group.selected_node_title") }}
                    </div>
                    <div>
                        <Button class="p-button-sm" 
                            :title="$t('group_management.computer_group.members_of_group')" 
                            @click="showMemberDetail"
                            icon="fas fa-users">
                        </Button>
                    </div>
                </div>
                <hr style="margin-bottom:-5px">
            </template>
            <template #content>
                <div class="p-grid p-flex-column">
                    <div class="p-col">
                        <DataTable class="p-datatable-sm" 
                            :value="selectedNodeSummaryData"
                            responsiveLayout="scroll"
                        >
                            <template #empty>
                                <div class="p-d-flex p-jc-center">
                                    <span>{{$t('group_management.computer_group.selected_node_empty_message')}}</span>
                                </div>
                            </template>
                            <Column field="label" :header="$t('group_management.computer_group.attribute')" style="width:40%"></Column>
                            <Column field="value" :header="$t('group_management.computer_group.value')" style="width:60%"></Column>
                        </DataTable>
                    </div>
                </div>
            </template>
        </Card>
    </div>  
</template>

<script>

/**
 * Computer Group Managemet.
 * @see {@link http://www.liderahenk.org/}
 * 
 */

import {FilterMatchMode} from 'primevue/api';
import { mapGetters, mapActions } from "vuex"
import axios from "axios";

export default {

      data() {
        return {
            members: [],
            filters: {},
            showMemberDialog: false,
            selectedNodeSummaryData: [],
            attributesMultiValue: false,
            loading: false
        }
    },

    created() {
        this.initFilters();
    },

    computed:mapGetters(["selectedLiderNode"]),

      methods: {
        ...mapActions(["setSelectedLiderNode"]),

        initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            }
        },

        showMemberDetail() {
            if (this.selectedLiderNode) {
                this.showMemberDialog = true;
            } else {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('group_management.computer_group.select_node_warn'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
        },

        getMemberOfSelectedGroup(node) {
            this.members = [];
            for (var key in node.attributesMultiValues) {
				if (node.attributesMultiValues.hasOwnProperty(key) && key == "member") {
					if(node.attributesMultiValues[key].length > 1) {
                        this.attributesMultiValue = true;
						for(var i = 0; i< node.attributesMultiValues[key].length; i++) {
                            this.members.push({
                                "memberDn": node.attributesMultiValues[key][i],
                                "index": i + 1
                            });
                        }
                    } else {
                        this.attributesMultiValue = false;
                        this.members.push({
                            "memberDn": node.attributesMultiValues[key][0],
                            "index": 1
                        });
                    }
                }
            }
        },

        deleteMemberFromGroup(data) {
            if (this.attributesMultiValue == false) {
                this.$toast.add({
                        severity:'success', 
                        detail: this.$t('group_management.computer_group.delete_member_warning_message'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                return;
            }
            this.loading = true;
            const params = new FormData();
            var dnList = [];
            dnList.push(data.memberDn)
            params.append("dnList[]", dnList);
            params.append("dn", this.selectedLiderNode.distinguishedName);
            axios.post("/lider/computer_groups/delete/group/members", params).then((response) => {
                if (response.data != null) {
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('group_management.computer_group.delete_member_success_message'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    this.setSelectedLiderNode(response.data);
                    this.getMemberOfSelectedGroup(this.selectedLiderNode);
                    this.loading = false;
                }
            }).catch((error) => {
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('group_management.computer_group.delete_member_error_message')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            })
        },

        getSelectedNodeAttribute() {
            let nodeSummaryData = [];
            nodeSummaryData.push({
                'label': this.$t('group_management.computer_group.name'),
                'value': this.selectedLiderNode.name,
                },
                {
                    'label': this.$t('group_management.computer_group.type'),
                    'value': this.selectedLiderNode.type,
                });
            if (this.selectedLiderNode.type == "GROUP") {
                 nodeSummaryData.push({
                    'label': this.$t('group_management.computer_group.number_of_member'),
                    'value': this.members.length
                 });
            }
            this.selectedNodeSummaryData = nodeSummaryData;
        }
    },

    watch: {
        selectedLiderNode() {
            this.members = [];
            if (this.selectedLiderNode) {
                if (this.selectedLiderNode.type == "GROUP") {
                    this.getMemberOfSelectedGroup(this.selectedLiderNode);
                }
                this.getSelectedNodeAttribute();
            }
        }
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