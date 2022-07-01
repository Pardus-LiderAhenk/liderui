<template>
    <div>
        <Dialog
            :header="$t('node_detail.selected_node_detail')" 
            :modal="true"
            :style="{ width: '40vw'}"
            v-model:visible="showDialog"
            @hide="showDialog = false">
            <DataTable class="p-datatable-sm" :value="selectedNodeData" 
                v-model:filters="filters"
                responsiveLayout="scroll" :loading="loading"
            >
                <template #header>
                    <div class="p-d-flex p-jc-end">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"/>
                            <InputText v-model="filters['global'].value" 
                            class="p-inputtext-sm" 
                            :placeholder="$t('node_detail.search')" 
                            />
                        </span>
                    </div>
                </template>
                <Column field="label" :header="$t('node_detail.attribute')" style="width:20%"></Column>
                <Column field="value" :header="$t('node_detail.value')" style="width:80%"></Column>
            </DataTable>
            <template #footer>
                <Button 
                    :label="$t('node_detail.close')" 
                    icon="pi pi-times"
                    @click="showDialog = false" 
                    class="p-button-text p-button-sm">
                </Button>
            </template>
        </Dialog>    
    </div>    
</template>

<script>
/**
 * This component, node detail in tree by selectedNode. Emit closeNodeDetailDialog event when closed showDetailDialog
 * @event closeNodeDetailDialog
 * @see {@link http://www.liderahenk.org/}
 */

import {FilterMatchMode} from 'primevue/api';

export default {
    props: {
        showNodeDetailDialog: {
            type: Boolean,
            default: false
        },

        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },
    },

    data() {
        return {
            showDetailDialog: false,
            selectedNodeData: [],
            members : [],
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            loading: false
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.showNodeDetailDialog
            },

            set (value) {
                if (!value) {
                    this.$emit('closeNodeDetailDialog')
                }
            }
        }
    },

    methods: {
        getSelectedNodeAttribute() {
            let nodeData = [];
            let nodeSummaryData = [];
            
            nodeSummaryData.push({
                'label': this.$t('node_detail.name'),
                'value': this.selectedNode.name,
                },
                {
                    'label': this.$t('node_detail.type'),
                    'value': this.selectedNode.type,
                });
            if (this.selectedNode.type == "GROUP") {
                 nodeSummaryData.push({
                     'label': this.$t('node_detail.number_of_member'),
                    'value': this.members.length
                 });
            }
            nodeData.push({
                'label': this.$t('node_detail.name'),
                'value': this.selectedNode.name,
                }, 
                {
                    'label': this.$t('node_detail.node_dn'),
                    'value': this.selectedNode.distinguishedName,
                },
                {
                    'label': this.$t('node_detail.type'),
                    'value': this.selectedNode.type,
                },
                {
                    'label': this.$t('node_detail.created_date'),
                    'value': this.selectedNode.createDateStr,
                },

                {
                    'label': this.$t('node_detail.modified_date'),
                    'value': this.selectedNode.modifyDateStr,
                },
                {
                    'label': this.$t('node_detail.creator_name'),
                    'value': this.selectedNode.attributes.creatorsName,
                },
                {
                    'label': this.$t('node_detail.modifier_name'),
                    'value': this.selectedNode.attributes.modifiersName,
                },
                {
                    'label': this.$t('node_detail.description'),
                    'value': this.selectedNode.attributes.description,
                });
            this.selectedNode.attributesMultiValues.objectClass.map(oclas => {
                nodeData.push({
                    'label': this.$t('node_detail.objectclass'),
                    'value' : oclas
                })
            });
            if (this.selectedNode.type == "USER" && this.selectedNode.attributesMultiValues.memberOf) {
                this.selectedNode.attributesMultiValues.memberOf.map(memberOf => {
                    nodeData.push({
                        'label': this.$t('node_detail.member_of_group'),
                        'value' : memberOf
                    })
                });
            }
            // if (this.selectedNode.type == "GROUP" && this.selectedNode.attributesMultiValues.member) {
            //     this.selectedNode.attributesMultiValues.member.map(member => {
            //         nodeData.push({
            //             'label': this.$t('node_detail.member'),
            //             'value' : member
            //         })
            //     });
            // }
            this.selectedNodeData = nodeData;
            this.selectedNodeSummaryData = nodeSummaryData;
        },
    },

    watch: {
        showNodeDetailDialog() {
            this.getSelectedNodeAttribute();
        },
    }
}
</script>

<style lang="scss" scoped>

</style>