<template>
    <div>
        <!-- Move node Dialog -->
        <Dialog :header="$t('user_management.sudo.move_node')" 
            v-model:visible="showDialog" 
            :style="{width: '40vw'}" :modal="true"
        >
            <tree-component 
                ref="movetree"
                loadNodeUrl="/api/lider/sudo-groups/groups"
                loadNodeOuUrl="/api/lider/sudo-groups/get-ou-details"
                :treeNodeClick="node => moveNodeData = node"
                :isMove="true"
                :scrollHeight="25"
            />
            <template #footer>
                <Button :label="$t('user_management.sudo.cancel')" 
                    icon="pi pi-times" 
                    @click="showDialog = false" 
                    class="p-button-text p-button-sm"
                />
                <Button :label="$t('user_management.sudo.move')" 
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

import { sudoGroupsService } from "../../../../services/UserManagement/UserPermissionsManagement/SudoGroups.js";

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

        async moveNode() {
            if (!this.moveNodeData) {
                this.$toast.add({
                    severity:'warn', 
                    detail:this.$t('user_management.sudo.select_folder_warn'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            
            const {response,error} = await sudoGroupsService.moveGroups(this.selectedNode.distinguishedName,this.moveNodeData.distinguishedName);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail:this.$t('user_management.sudo.move_node_error'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    if (response.data) {
                        this.$emit('moveNode', this.moveNodeData);
                        this.$toast.add({
                            severity:'success', 
                            detail:this.$t('user_management.sudo.move_node_success'),
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail:this.$t('user_management.sudo.move_node_error'),
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }

            this.$emit('closeSudoDialog');
            this.moveNodeData = null;

        },
    }
}
</script>

<style lang="scss" scoped>

</style>