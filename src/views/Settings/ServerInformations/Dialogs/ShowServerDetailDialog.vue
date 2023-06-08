<template>
    <Dialog :header="$t('Sunucu Bilgileri')" v-model:visible="modalVisible" style="width:30vw;">            
                <div class="p-grid">
                    <div class="p-col-9">
                        <div class="p-fluid p-formgrid">
                            
                            
                        </div>
                    </div>
                </div>
        <template #footer>

            <Button :label="$t('Kapat')" icon="pi pi-times" @click="modalVisible = false" class="p-button-text"/>
            
        </template>
    </Dialog>

</template>
<script>

export default {
    components:{

    },
    
    props: ['modalVisibleValue'],
    emits:['updateConsoleUsers'],
    data(){
        return {
            selectedUserNode:null,
            searchFields: [
               
            ],
            
            groupMembers: [],
            selectedGroupNode: null,
            groupPrivilages: [],
        }
    },
    computed: {
        modalVisible: {
            get() {
                return this.modalVisibleValue;
            },
            set() {
                this.$emit('modalVisibleValue', false);
            }
        },
    }
}

</script>