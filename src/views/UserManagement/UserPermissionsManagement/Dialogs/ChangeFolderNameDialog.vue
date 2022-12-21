<template>
    <div>
        <!-- Change Folder Name Dialog -->
        <Dialog :header="$t('user_management.sudo.edit_folder_name')" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="folderName">{{$t('user_management.sudo.folder_name')}}</label>
                    <InputText :class="validation.folderName ? 'p-invalid': ''" type="text" 
                        v-model="folderName"/>
                    <small v-if="validation.folderName" class="p-error">
                        {{$t('user_management.sudo.folder_name_warn')}}
                    </small>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('user_management.sudo.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('user_management.sudo.update')" icon="pi pi-refresh"
                    @click="changeFolderName" class="p-button-sm"
                />
            </template>
        </Dialog>
     <!-- Change Folder Name Dialog End-->
    </div>
</template>

<script>
/**
 * Change Folder Name Dialog
 * @see {@link http://www.liderahenk.org/}
 */

import { sudoGroupsService } from "../../../../services/UserManagement/UserPermissionsManagement/SudoGroups.js";

export default {

    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },

        folderNameChange: {
            type: Boolean,
            default: false,
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

    mounted() {
        this.folderName = this.selectedNode.name;
    },

    computed: {
        showDialog: {
            get () {
                return this.folderNameChange;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeSudoDialog');
                }
            }
        }
    },

    methods: {
        async changeFolderName() {
            if (!this.folderName.trim()) {
                this.validation.folderName = true;
                return;
            }

            const{response,error} = await sudoGroupsService.renameGroups(this.selectedNode.distinguishedName,'ou=' + this.folderName);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.sudo.error_update_folder_name'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                
            }
            else{
                if(response.status == 200){
                    this.$emit('updateNode', response.data, this.selectedNode);
                    this.$toast.add({
                        severity:'success', 
                        detail:this.$t('user_management.sudo.update_folder_name_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.sudo.error_417_update_folder_name'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
                
            this.$emit('closeSudoDialog');
            this.folderName = '';

        },
    },

     watch : {
        folderName() {
            if (this.folderName.trim()) {
                this.validation.folderName = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>