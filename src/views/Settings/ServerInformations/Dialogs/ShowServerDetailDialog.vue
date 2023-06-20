<template>
    <Dialog
        :header="$t('Sunucu Bilgileri')" 
        :modal="true"
        :style="{ width: '40vw'}"
        v-model:visible="modalVisible"
        @hide="modalVisible = false">
        <DataTable class="p-datatable-sm" :value="selectedNodeData" 
         v-model:filters="filters" responsiveLayout="scroll">
            <template #header>
                
            </template>
            <Column field="label" :header="$t('node_detail.attribute')"></Column>
            <Column field="value" :header="$t('node_detail.value')"></Column>
        </DataTable>
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