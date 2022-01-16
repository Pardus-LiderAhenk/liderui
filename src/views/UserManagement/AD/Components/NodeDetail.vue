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
 * This component, node detail in tree by selectedNode for AD tree. Emit closeNodeDetailDialog event when closed showDetailDialog
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
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },
    },

    data() {
        return {
            showDetailDialog: false,
            selectedNodeData: [],
            members : []
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
                    'value': this.getFormattedDate(this.selectedNode.attributes.whenCreated),
                },

                {
                    'label': this.$t('node_detail.modified_date'),
                    'value': this.getFormattedDate(this.selectedNode.attributes.whenChanged),
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
            this.selectedNodeData = nodeData;
            this.selectedNodeSummaryData = nodeSummaryData;
        },

        closeDetailDialog() {
            this.showDetailDialog = false;
            this.$emit("closeNodeDetailDialog");
        },

        getFormattedDate(date) {
            // "2021 11 29 14 08 25.0Z"
            let strDate = null;
            let year = date.substring(0,4);
            let month = date.substring(4,6);
            let day = date.substring(6,8);
            let hour = date.substring(8,10);
            let minute = date.substring(10,12);
            strDate = day+"/"+ month+"/"+ year+" "+ hour +":"+minute;
            return strDate
        },
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