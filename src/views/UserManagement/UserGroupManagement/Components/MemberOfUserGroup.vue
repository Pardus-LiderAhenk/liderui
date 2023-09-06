<template>
    <div>
        <Dialog
            :header="$t('group_management.members_of_group')" 
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
                                :placeholder="$t('group_management.search')" 
                            />
                        </span>
                    </div>
                </template>
                <template #empty>
                    <div class="p-d-flex p-jc-center">
                        <span>{{ $t('group_management.member_empty_message') }}</span>
                    </div>
                </template>
                <Column field="index" header="#" style="width: 10%"></Column>
                <Column field="memberDn" 
                    :header="$t('group_management.member')"
                    style="min-width: 80%">
                </Column>
                <Column :exportable="false" style="width: 10%">
                    <template #body="slotProps">
                        <div class="p-d-flex p-jc-end">
                            <Button
                                class="p-button-sm p-button-danger p-button-rounded"
                                icon="pi pi-trash"
                                :title="$t('group_management.delete')"
                                @click.prevent="deleteMemberFromGroup(slotProps.data)">
                            </Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
            <template #footer>
                <Button 
                    :label="$t('group_management.close')" 
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
                        {{ $t("group_management.selected_node_title") }}
                    </div>
                    <div>
                        <Button class="p-button-sm" v-if="selectedLiderNode && selectedLiderNode.type === 'GROUP'"
                            :title="$t('group_management.members_of_group')" 
                            @click="showMemberDetail"
                            icon="fas fa-users">
                        </Button>
                    </div>
                </div>
                <hr style="margin-bottom:-5px">
            </template>
            <template #content>
                <div class="p-grid p-flex-column">
                    <div class="p-fluid">
                        <DataTable class="p-field p-datatable-sm" 
                            :value="selectedNodeSummaryData"
                            responsiveLayout="scroll"
                        >
                            <template #empty>
                                <div class="p-d-flex p-jc-center">
                                    <span>{{$t('group_management.selected_node_empty_message')}}</span>
                                </div>
                            </template>
                            <Column field="label" :header="$t('group_management.attribute')" style="width:40%"></Column>
                            <Column field="value" :header="$t('group_management.value')" style="width:60%"></Column>
                        </DataTable>
                        <div class="p-field" style="margin-left:5px;"
                            v-if="selectedLiderNode && selectedLiderNode.type == 'GROUP'">
                            <div class="p-grid">
                                <div class="p-col-12 p-md-6 p-lg-5">
                                    <label>{{ $t('group_management.domain_admin_privilege') }}</label>
                                </div>
                                <div class="p-col-12 p-md-6 p-lg-7">
                                    <InputSwitch v-model="isDomainAdmin" 
                                        v-tooltip.bottom="$t('group_management.domain_admin_description')"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <div v-if="selectedLiderNode && selectedLiderNode.type == 'GROUP'"
                    class="p-d-flex p-jc-end">
                    <Button label="Güncelle" icon="pi pi-sync"
                        @click="domainAdminConfirmDialog = true" class="p-button-sm"
                    />
                </div>
            </template>
        </Card>

        <Dialog :header="$t('computer.task.toast_summary')" 
            v-model:visible="domainAdminConfirmDialog"  
            :modal="true" :style="{width: '20vw'}"
            @hide="domainAdminConfirmDialog = false">
            <div class="confirmation-content">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span v-if="isDomainAdmin">
                    {{ $t('group_management.domain_admin_privilege_confirm_message')}}
                </span>
                <span v-else>
                    {{ $t('group_management.domain_admin_delete_confirm_message')}}
                </span>
            </div>
            <template #footer>
                <Button 
                    :label="$t('group_management.cancel')" 
                    icon="pi pi-times" 
                    @click="domainAdminConfirmDialog = false" 
                    class="p-button-text p-button-sm"
                />
                <Button 
                    :label="$t('group_management.yes')"
                    icon="pi pi-check" 
                    @click="updateDomainAdmin"
                    class="p-button-sm"
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
import { userGroupsService } from '../../../../services/Settings/UserGroupsService.js';

export default {

      data() {
        return {
            members: [],
            filters: {},
            showMemberDialog: false,
            selectedNodeSummaryData: [],
            attributesMultiValue: false,
            loading: false,
            isDomainAdmin: false,
            domainAdminConfirmDialog: false
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
                    detail: this.$t('group_management.select_node_warn'), 
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
            if (this.selectedLiderNode.attributesMultiValues.liderPrivilege && 
                this.selectedLiderNode.attributesMultiValues.liderPrivilege.includes("ROLE_DOMAIN_ADMIN")) {
                this.isDomainAdmin = true;
            } else {
                this.isDomainAdmin = false;
            }
        },

        async deleteMemberFromGroup(data) {
            if (this.attributesMultiValue == false) {
                this.$toast.add({
                        severity:'warn', 
                        detail: this.$t('group_management.delete_member_warning_message'), 
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
            const{response,error} = await  userGroupsService.deleteGroupMember(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('group_management.delete_member_error_message')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if (response.status == 200) {
                    if (response.data != null) {
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('group_management.delete_member_success_message'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                        this.setSelectedLiderNode(response.data);
                        this.getMemberOfSelectedGroup(this.selectedLiderNode);
                        this.$emit('deleteMember', this.selectedLiderNode);
                        this.loading = false;
                    }
                }
            }
        },

        getSelectedNodeAttribute() {
            let nodeSummaryData = [];
            nodeSummaryData.push({
                'label': this.$t('group_management.name'),
                'value': this.selectedLiderNode.name,
                },
                {
                    'label': this.$t('group_management.type'),
                    'value': this.selectedLiderNode.type,
                });
            if (this.selectedLiderNode.type == "GROUP") {
                nodeSummaryData.push({
                'label': this.$t('group_management.number_of_member'),
                'value': this.members.length
                });
            }
            this.selectedNodeSummaryData = nodeSummaryData;
        },

        async updateDomainAdmin() {
            const params = new FormData();
            params.append("isDomainAdmin", this.isDomainAdmin);
            params.append("dn", this.selectedLiderNode.distinguishedName);
            const {response,error} = await  userGroupsService.updateDomainAdmin(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('group_management.domain_admin_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if (response.status == 200) {
                    this.setSelectedLiderNode(response.data);
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('group_management.domain_admin_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('group_management.domain_admin_error')+ " \n"+error, 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
            this.domainAdminConfirmDialog = false;
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
            } else {
                this.selectedNodeSummaryData = [];
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