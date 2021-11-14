<template>
<Card>
    <template #title>
        Lider Arayüz Kullanım Geçmişi
    </template>
    <template #content>

        <DataTable :value="records" responsiveLayout="scroll"
            dataKey="id"
            filterDisplay="row" 
            showGridlines
            >
            <template #header>
                <div class="p-d-flex p-ac-end p-grid" style="justify-content:flex-end;">
                    <div class="p-flex p-ac-end p-col-12" style="justify-conten:flex-end; text-align:right;">
                        <span class="p-input-icon-left">
                            <span>Durumu: </span>
                            <Dropdown v-model="selectedStatus" :options="statusOptions" optionLabel="name" optionValue="value" />
                        </span>
                    </div>
                </div>
            </template>
            <Column header="#">
                    <template #body="slotProps">
                    <p>{{slotProps.index + 1}}</p>
                </template>
            </Column>
            <Column field="username" header="Kullanıcı Adı"></Column>
            <Column field="date" header="Tarih"></Column>
            <Column field="ip" header="IP Adresi"></Column>
            <Column field="status" header="Durum"></Column>
        </DataTable>
        
    </template>
</Card>
</template>


<script>

export default {
    data() {
        return {
            selectedStatus:'',
            statusOptions: [
                {
                    name: 'Hepsi',
                    value: 1
                },
                {
                    name: 'Oturum Açıldı',
                    value: 2
                },
                {
                    name: 'Oturum Kapatıldı',
                    value: 3
                }
            ],
            records: [
                {
                    username: 'lider',
                    date: '20/10/2021 13:41:50',
                    ip: '172.26.140.30',
                    status: 'Oturum Açıldı'
                },
                {
                    username: 'lider',
                    date: '20/10/2021 13:41:50',
                    ip: '172.26.140.30',
                    status: 'Oturum Açıldı'
                },
                {
                    username: 'lider',
                    date: '20/10/2021 13:41:50',
                    ip: '172.26.140.30',
                    status: 'Oturum Açıldı'
                }
            ]
        }
    }
}

</script>
