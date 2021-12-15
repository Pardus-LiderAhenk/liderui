<template>
    <div>
        <Dialog
            :header="$t('node_detail.selected_node_detail')" 
            :modal="true"
            :style="{ width: '40vw'}"
            v-model:visible="showDetailDialog"
            @hide="closeDetailDialog">
            <DataTable class="p-datatable-sm" :value="selectedNodeData" responsiveLayout="scroll">
                <Column field="label" :header="$t('node_detail.attribute')"></Column>
                <Column field="value" :header="$t('node_detail.value')"></Column>
            </DataTable>
            <template #footer>
                <Button 
                    :label="$t('node_detail.close')" 
                    icon="pi pi-times"
                    @click="closeDetailDialog" 
                    class="p-button-text p-button-sm">
                </Button>
            </template>
        </Dialog>    
    </div>    
</template>

<script>
/**
 * This component, node detail in tree by selectedLiderNode. Emit closeNodeDetailDialog event when closed showDetailDialog
 * @event closeNodeDetailDialog
 * @see {@link http://www.liderahenk.org/}
 */

import { mapGetters } from "vuex";

export default {
    props: {
        showNodeDetailDialog: {
            type: Boolean,
            default: false
        },
    },

    data() {
        return {
            showDetailDialog: false,
            selectedNodeData: [],
            members : []
        }
    },

    computed:mapGetters(["selectedLiderNode"]),

    methods: {
        getSelectedNodeAttribute() {
            let nodeData = [];
            let nodeSummaryData = [];
            
            nodeSummaryData.push({
                'label': this.$t('node_detail.name'),
                'value': this.selectedLiderNode.name,
                },
                {
                    'label': this.$t('node_detail.type'),
                    'value': this.selectedLiderNode.type,
                });
            if (this.selectedLiderNode.type == "GROUP") {
                 nodeSummaryData.push({
                     'label': this.$t('node_detail.number_of_member'),
                    'value': this.members.length
                 });
            }
            nodeData.push({
                'label': this.$t('node_detail.name'),
                'value': this.selectedLiderNode.name,
                }, 
                {
                    'label': this.$t('node_detail.node_dn'),
                    'value': this.selectedLiderNode.distinguishedName,
                },
                {
                    'label': this.$t('node_detail.type'),
                    'value': this.selectedLiderNode.type,
                },
                {
                    'label': this.$t('node_detail.created_date'),
                    'value': this.selectedLiderNode.createDateStr,
                },

                {
                    'label': this.$t('node_detail.modified_date'),
                    'value': this.selectedLiderNode.modifyDateStr,
                },
                {
                    'label': this.$t('node_detail.creator_name'),
                    'value': this.selectedLiderNode.attributes.creatorsName,
                },
                {
                    'label': this.$t('node_detail.modifier_name'),
                    'value': this.selectedLiderNode.attributes.modifiersName,
                });
            this.selectedLiderNode.attributesMultiValues.objectClass.map(oclas => {
                nodeData.push({
                    'label': this.$t('node_detail.objectclass'),
                    'value' : oclas
                })
            });
            this.selectedNodeData = nodeData;
            this.selectedNodeSummaryData = nodeSummaryData;
        },

        closeDetailDialog() {
            this.showDetailDialog = false;
            this.$emit("closeNodeDetailDialog");
        }
    },

    watch: {
        showNodeDetailDialog() {
            this.showDetailDialog = this.showNodeDetailDialog;
            this.getSelectedNodeAttribute();
        },
    }
}
</script>

<style lang="scss" scoped>

</style>