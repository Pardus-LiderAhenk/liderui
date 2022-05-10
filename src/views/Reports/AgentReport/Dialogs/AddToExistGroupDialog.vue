<template>
    <div>
        <Dialog header="Mevcut Gruba Ekle" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="groupName">Grup Adı</label>
                    <InputText :class="validation.groupName ? 'p-invalid': ''" type="text" v-model="groupName"/>
                    <small v-if="validation.groupName" class="p-error">
                        Grup adı boş bırakılamaz
                    </small>
                </div>
            </div>
            <template #footer>
                <Button label="İptal" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button label="Ekle" icon="pi pi-plus"
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

import axios from "axios";

export default {

    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },

        addExistGroupDialog: {
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
                return this.addExistGroupDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeGroupDialog');
                }
            }
        }
    },

    methods: {
        addGroup() {
            if (!this.groupName.trim()) {
                this.validation.groupName = true;
                return;
            }
            let params = new FormData();
            params.append("parentName", this.selectedNode.distinguishedName);
            params.append("cn", this.groupName);
            axios.post('/ad/addGroup2AD', params).then(response => {
                if (response.data) {
                    this.$emit('appendNode', response.data, this.selectedNode);
                    this.$emit('closeAdDialog');
                    this.$toast.add({
                        severity:'success', 
                        detail: this.$t('user_management.ad.added_group_success'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('user_management.ad.added_group_error'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });
                }
            });
            this.groupName = '';
        },
    }
    
}
</script>

<style lang="scss" scoped>

</style>