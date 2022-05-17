<template>
    <div>
        <!-- Change Folder Name Dialog -->
        <Dialog header="Klasör Adını Değiştir" v-model:visible="showDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="folderName">Klasör Adı</label>
                    <InputText :class="validation.folderName ? 'p-invalid': ''" type="text" 
                        v-model="folderName"/>
                    <small v-if="validation.folderName" class="p-error">
                        Klasör adı boş bırakılamaz
                    </small>
                </div>
            </div>
            <template #footer>
                <Button label="İptal" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
                <Button label="Güncelle" icon="pi pi-refresh"
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

import axios from "axios";

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
        changeFolderName() {
            if (!this.folderName.trim()) {
                this.validation.folderName = true;
                return;
            }

            axios.post('/lider/sudo_groups/rename/entry', null, {
                params: {
                    oldDN: this.selectedNode.distinguishedName,
                    newName: 'ou=' + this.folderName
                }
            }).then(response => {
                this.$emit('updateNode', response.data, this.selectedNode);
                this.$toast.add({
                    severity:'success', 
                    detail: "Klasör adı başaryla değiştirildi", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                this.$emit('closeSudoDialog');
                this.folderName = '';
            });
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