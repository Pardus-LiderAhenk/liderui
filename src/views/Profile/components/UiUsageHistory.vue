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
                            <Dropdown v-model="operationType" :options="statusOptions" optionLabel="name" optionValue="value" />
                        </span>
                    </div>
                </div>
            </template>
            <Column header="#">
                    <template #body="slotProps">
                    <p>{{slotProps.index + 1}}</p>
                </template>
            </Column>
            <Column field="userId" header="Kullanıcı Adı"></Column>
            <Column field="createDate" header="Tarih"></Column>
            <Column field="requestIp" header="IP Adresi"></Column>
            <Column header="Durum">
                 <template #body="{ data }">
                    {{ 
                        data.crudType === 'LOGIN' ? 'Oturum Açıldı' : 'Oturum Kapatıldı'
                    }}
                </template>
            </Column>
        </DataTable>
        <Paginator
        :rows="10"
        :totalRecords="totalElements"
        :rowsPerPageOptions="[10, 25, 50, 100]"
        @page="onPage($event)"
      >
      </Paginator>
        
    </template>
</Card>
</template>


<script>

import axios from 'axios';

export default {
    data() {
        return {
            loading:false,
            operationType:'all',
            totalElements:0,
            currentPage: 1,
            statusOptions: [
                {
                    name: 'Hepsi',
                    value: 'all'
                },
                {
                    name: 'Oturum Açıldı',
                    value: 'login'
                },
                {
                    name: 'Oturum Kapatıldı',
                    value: 'logout'
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
    },
    methods: {
        init(){
            this.getLogs();
        },
        onPage(event) {
            this.loading = true;
            this.getLogs(event.page + 1, event.rows);
        },
        getLogs(pageNumber = 1, rowNumber = 10) {
            this.currentPage = pageNumber;
            var data = new FormData();
            data.append("pageNumber", pageNumber);
            data.append("pageSize", rowNumber);
            data.append('operationType',this.operationType);

            axios.post("/operation/login", data).then((response) => {
                this.records = response.data.content;
                this.totalElements = response.data.totalElements;
                this.loading = false;
            });
        },
    }
}

</script>
