<template>
    <div>
        <!-- Delete Node Dialog -->
        <Dialog :header="$t('user_management.selected_delete_node')" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <div v-if="selectedNode && selectedNode.type == 'USER'">
                        <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                        <span>
                            {{selectedNode.name}} adlı kullanıcı silinecektir. Emin misiniz?
                        </span>
                    </div>
                    <div v-if="selectedNode && selectedNode.type == 'ORGANIZATIONAL_UNIT'">
                        <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" /> 
                        <span>
                            Bu işlem seçili olan organizasyon birimini silecektir. Birim içeriğinin boş olduğundan emin olunuz. Bu işlem geri alınamaz.
                        </span>
                    </div>
                    <div v-if="selectedNode && selectedNode.type == 'GROUP'">
                        <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                        <span>
                            Bu işlem seçili olan kullanıcı grubunu ve bu grubun içerisinde yer alan tüm kullanıcıları silecektir. Bu işlem geri alınamaz.
                        </span>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('user_management.yes')" icon="pi pi-check"
                    @click="deleteNode" class="p-button-sm"
                />
            </template>
        </Dialog>
     <!-- Delete Node Dialog End-->
    </div>
</template>

<script>
/**
 * Delete Selected Node in AD tree
 * @see {@link http://www.liderahenk.org/}
 */

import { adManagementService } from "../../../../services/UserManagement/AD/AdManagement.js";

export default {

    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },

        deleteNodeDialog: {
            type: Boolean,
            default: false,
            description: "delete node dialog prop",
        },
    },

    computed: {
        showDialog: {
            get () {
                return this.deleteNodeDialog
            },

            set (value) {
                if (!value) {
                    this.$emit('closeAdDialog');
                }
            }
        }
    },

    methods: {
        async deleteNode() {
            let params = new FormData();
            params.append("distinguishedName", this.selectedNode.distinguishedName);

            const{ response,error } = await  adManagementService.deleteEntry(params);
            this.$emit('closeAdDialog');
            if(error){
                if (this.selectedNode.type == 'ORGANIZATIONAL_UNIT') {
                    this.$toast.add({
                        severity:'warn', 
                        detail: this.$t('user_management.ad.delete_ou_warn'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.delete_node_error'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
            else{
                if(response.status == 200){
                    this.$emit('deleteNode', this.selectedNode);
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.delete_node_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                
                else if(response.status == 404){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.error_404_delete_node'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });                    
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>