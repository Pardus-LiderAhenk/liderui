<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>Yetki Grupları</h3>
        </div>
        
        <div class="p-col-12">
             <DataTable :value="groups" responsiveLayout="scroll">
                <Column field="name" header="Yetki Grup Adı"></Column>
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