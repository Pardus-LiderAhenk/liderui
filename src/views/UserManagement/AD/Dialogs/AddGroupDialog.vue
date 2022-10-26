<template>
    <div>
        <Dialog :header="$t('user_management.ad.add_group')" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="groupName">{{$t('user_management.ad.group_name')}}</label>
                    <InputText :class="validation.groupName ? 'p-invalid': ''" type="text" v-model="groupName"/>
                    <small v-if="validation.groupName" class="p-error">
                        {{ $t('user_management.ad.group_name_warn')}}
                    </small>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('user_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button :label="$t('user_management.add')" icon="pi pi-plus"
                    @click="addGroup" class="p-button-sm"
                />
            </template>
        </Dialog>
    <!-- Add Group Dialog End-->
    </div>
</template>


<script>
/**
 * Create Group to AD tree
 * @see {@link http://www.liderahenk.org/}
 */
import { adManagementService } from "../../../../services/UserManagement/AD/AdManagement.js"

export default {

    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },

        addGroupDialog: {
            type: Boolean,
            default: false,
            description: "Selected tree node",
        },
    },

    data(){
        return{
            groupName:'',
            validation: {
                groupName: false,
            },
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.addGroupDialog
            },

            set (value) {
                if (!value) {
                    this.$emit('closeAdDialog')
                }
            }
        }
    },

    methods: {
        async addGroup() {
            if (!this.groupName.trim()) {
                this.validation.groupName = true;
                return;
            }
            let params = new FormData();
            params.append("parentName", this.selectedNode.distinguishedName);
            params.append("cn", this.groupName);

            const { response,error } = await adManagementService.addGroupToAd(params);
            if (error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.ad.added_group_error'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                    });
            }
            else{
                if(response.status == 200){
                    this.$emit('appendNode', response.data, this.selectedNode);
                    this.$emit('closeAdDialog');
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.ad.added_group_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });

                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.ad.error_417_added_group_error'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            }
            
            this.groupName = '';
        },
    }
    
}
</script>

<style lang="scss" scoped>

</style>