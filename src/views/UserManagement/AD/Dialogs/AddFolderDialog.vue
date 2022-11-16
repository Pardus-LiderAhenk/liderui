<template>
    <div>
        <!-- Add Folder Dialog -->
        <Dialog :header="$t('user_management.add_folder')" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="folderName">{{$t('user_management.folder_name')}}</label>
                    <InputText :class="validation.folderName ? 'p-invalid': ''" type="text" v-model="folderName"/>
                    <small v-if="validation.folderName" class="p-error">
                        {{ $t('user_management.folder_name_warn')}}
                    </small>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('user_management.add')" icon="pi pi-plus"
                    @click="addFolder" class="p-button-sm"
                />
            </template>
        </Dialog>
     <!-- Add Folder Dialog End-->
    </div>
</template>

<script>
/**
 * Create Folder to AD tree
 * @see {@link http://www.liderahenk.org/}
 */

import { adManagementService } from "../../../../services/UserManagement/AD/AdManagement";

export default {

    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },

        addFolderDialog: {
            type: Boolean,
            default: false,
            description: "Selected tree node",
        },
    },

    data(){
        return{
            folderName:'',
            validation: {
                folderName: false,
            },
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.addFolderDialog
            },

            set (value) {
                if (!value) {
                    this.$emit('closeAdDialog');
                }
            }
        }
    },

    methods: {
        async addFolder() {
            if (!this.folderName.trim()) {
                this.validation.folderName = true;
                return;
            }
            let params = new FormData();
            params.append("parentName", this.selectedNode.distinguishedName);
            params.append("ou", this.folderName);
            const { response,error } =  await adManagementService.addToOuAd(params);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.add_folder_error'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                    });
            }
            else{
                if(response.status == 200){
                    if (response.data) {
                        this.$emit('appendNode', response.data, this.selectedNode);
                        this.$emit('closeAdDialog');
                        this.$toast.add({
                            severity:'success', 
                            detail: this.$t('user_management.add_folder_success'), 
                            summary:this.$t("computer.task.toast_summary"), 
                            life: 3000
                        });
                    }
            }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.error_417_add_folder'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                    

                    }

            }       
        this.folderName = '';
        },

    }
    
}
</script>

<style lang="scss" scoped>

</style>