<template>
    <node-detail :showNodeDetailDialog="showNodeDetailDialog"
        @close-node-detail-dialog="showNodeDetailDialog = false"
        :selectedNode="selectedNodeTable">
    </node-detail>
    <div>
        <Card>
            <template #title>
                <div class="p-d-flex p-jc-between">
                    <div style="font-size:15px;">
                        {{$t('user_management.ad.node_detail_title')}}
                    </div>
                </div>
            </template>
            <template #content>
                <div class="p-grid p-flex-column">
                    <div class="p-col">
                        <DataTable :value="nodes" class="p-datatable-sm p-col"
                            :paginator="true" :rows="10" ref="dt"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                            :rowsPerPageOptions="[10,25,50,100]"  style="margin-top: 2em"
                            v-model:filters="filters"
                            responsiveLayout="scroll"
                            :loading="loading"
                        >
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
                                    <span>{{$t('group_management.selected_node_empty_message')}}</span>
                                </div>
                            </template>
                            <Column field="name" :header="$t('user_management.name')" style="width:20%"></Column>
                            <Column field="type" :header="$t('user_management.type')" style="width:20%"></Column>
                            <Column field="attributes.description" :header="$t('user_management.description')" style="width:50%"></Column>
                            <Column :exportable="false">
                                <template #body="slotProps">
                                    <div class="p-d-flex p-jc-end">
                                        <Button
                                            class="p-button-sm p-button-rounded"
                                            icon="pi pi-list"
                                            :title="$t('user_management.node_detail')"
                                            @click.prevent="selectedNodeDetail(slotProps.data)">
                                        </Button>
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script>

import {FilterMatchMode} from 'primevue/api';
import NodeDetail from '@/views/UserManagement/AD/Dialogs/NodeDetail.vue';
import { adManagementService } from '../../../../services/UserManagement/AD/AdManagement.js';

export default {
    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },
    },

    components: {
        NodeDetail,
    },

    data() {
        return {
            selectedNodeTable: null,
            showNodeDetailDialog: false,
            nodes: [],
            loading: false,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
        }
    },

    mounted() {
        if (this.selectedNode) {
            this.getChildEntries();
        } else {
            this.nodes = [];
        }
    },

    methods: {
        async getChildEntries() {
            this.nodes = [];
            if (this.selectedNode.type != "USER" && this.selectedNode.type != "GROUP") {
                this.loading = true;
                let params = new FormData();
                params.append("distinguishedName", this.selectedNode.distinguishedName);
                params.append("name", this.selectedNode.name);
                params.append("parent", this.selectedNode.parent);
                const{ response,error } = await adManagementService.childEntriesList(params);

                if(error){
                    this.$toast.add({
                            severity:'error', 
                            detail: this.$t('user_management.ad.error_ad_child_entries'),
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                    });
                }
                else{
                    if(response.status == 200){
                        this.loading = false;
                        if (response.data) {
                            this.nodes = response.data;
                        }
                    }
                    else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('user_management.ad.error_417_ad_child_entries'),
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
            }
            else{
            
                this.nodes.push(this.selectedNode);
            
            }                

    },

        selectedNodeDetail(node) {
            this.selectedNodeTable = node;
            this.showNodeDetailDialog = true;
        }
    },

    watch: {
        selectedNode() {
            if (this.selectedNode) {
                this.getChildEntries();
            }
        },
    },

    unmounted() {
        this.loading = false;
    }
    
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

