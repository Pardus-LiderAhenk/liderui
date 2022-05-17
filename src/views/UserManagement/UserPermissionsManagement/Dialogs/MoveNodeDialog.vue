<template>
    <div>
        <!-- Move node Dialog -->
        <Dialog header="Kayıt Taşı" 
            v-model:visible="showDialog" 
            :style="{width: '40vw'}" :modal="true"
        >
            <tree-component 
                ref="movetree"
                loadNodeUrl="/lider/sudo_groups/getGroups"
                loadNodeOuUrl="/lider/sudo_groups/getOuDetails"
                :treeNodeClick="node => moveNodeData = node"
                :isMove="true"
            />
            <template #footer>
                <Button label="İptal" 
                    icon="pi pi-times" 
                    @click="showDialog = false" 
                    class="p-button-text p-button-sm"
                />
                <Button label="Taşı" 
                    icon="el el-icon-rank" 
                    @click="moveNode" 
                    class="p-button-sm" 
                />
            </template>
        </Dialog>
        <!-- Move node Dialog End-->
    </div>
</template>

<script>
/**
 * Move node Dialog
 * @see {@link http://www.liderahenk.org/}
 */

import axios from "axios";

export default {

    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },

        moveNodeDialog: {
            type: Boolean,
            default: false,
        },
    },

    data(){
        return{
            moveNodeData: null,
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.moveNodeDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeSudoDialog');
                }
            }
        }
    },

    methods: {

        // moveTreeNodeClick(node) {
        //     this.moveNodeData = node;
        // },

        moveNode() {
            if (!this.moveNodeData) {
                this.$toast.add({
                    severity:'warn', 
                    detail: "Lütfen klasör seçiniz", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }

            axios.post('/lider/sudo_groups/move/entry', null ,{
                params: {
                    sourceDN: this.selectedNode.distinguishedName,
                    destinationDN: this.moveNodeData.distinguishedName
                }
            }).then(response => {
                if (response.data) {
                    this.$emit('moveNode', this.moveNodeData);
                    this.$toast.add({
                        severity:'success', 
                        detail: "Kayıt başarıyla taşındı", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: "Kayıt taşınırken hata oluştu", 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                this.$emit('closeSudoDialog');
                this.moveNodeData = null;
            });
        },
    }
}
</script>

<style lang="scss" scoped>

</style>