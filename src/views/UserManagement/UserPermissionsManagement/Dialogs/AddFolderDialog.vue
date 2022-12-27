<template>
    <div>
        <!-- Add Folder Dialog -->
        <Dialog :header="$t('user_management.sudo.add_folder')" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="folderName">{{$t('user_management.sudo.folder_name')}}</label>
                    <InputText :class="validation.folderName ? 'p-invalid': ''" type="text" v-model="folderName"/>
                    <small v-if="validation.folderName" class="p-error">
                        {{$t('user_management.sudo.folder_name_warn')}}
                    </small>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('user_management.sudo.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('user_management.sudo.add')" icon="pi pi-plus"
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

import { sudoGroupsService } from "../../../../services/UserManagement/UserPermissionsManagement/SudoGroups.js";

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
                return this.addFolderDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeSudoDialog');
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

            const{ response,error } = await sudoGroupsService.addOu({
                parentName: this.selectedNode.distinguishedName,
                type:'ORGANIZATIONAL_UNIT',
                ou: this.folderName,
                distinguishedName: 'ou=' + this.folderName + ',' + this.selectedNode.distinguishedName,
                name: this.folderName
            });
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.sudo.error_add_folder'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.$emit('appendNode', response.data, this.selectedNode);
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.sudo.add_folder_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.sudo.error_417_add_folder'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
            this.folderName = '';
            this.$emit('closeSudoDialog');
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