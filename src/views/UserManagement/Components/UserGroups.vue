<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>Grup Listesi</h3>
        </div>
        
        <div class="p-col-12">
             <DataTable :value="groups" responsiveLayout="scroll">
                <Column field="name" header="Kullanıcı Grup Adı"></Column>
                <Column  >
                     <template #body="slotProps">
                        <Button class="p-button-danger" label="Delete" @click="deleteRecord(slotProps.data)"></Button>
                    </template>
                </Column>
            </DataTable>
        </div>
        
    </div>
</template>


<script>
export default {
    data() {
        return {
            groups: []
        }
    }
}
</script>