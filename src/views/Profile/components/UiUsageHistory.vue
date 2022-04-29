<template>
    <div>
         <h3>{{$t('profile.login_logout_history.login_logout_history')}}</h3>
        <DataTable :value="records" responsiveLayout="scroll" class="p-datatable-sm"
            >
            <template #header>
                <div class="p-d-flex p-ac-end p-grid" style="justify-content:flex-end;">
                    <div class="p-flex p-ac-end p-col-12" style="justify-conten:flex-end; text-align:right;">
                        <span class="p-input-icon-left">
                            <span>{{$t('profile.login_logout_history.status')}}: </span>
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
            <Column field="userId" :header="$t('profile.login_logout_history.username')"></Column>
            <Column field="createDate" :header="$t('profile.login_logout_history.date')"></Column>
            <Column field="requestIp" :header="$t('profile.login_logout_history.ip_address')"></Column>
            <Column :header="$t('profile.login_logout_history.status')">
                <template #body="slotProps">
                    <Badge v-if="slotProps.data.crudType == 'LOGIN'" 
                        :value="$t('profile.login_logout_history.login')" 
                        severity="success">
                    </Badge>
                    <Badge v-if="slotProps.data.crudType == 'LOGOUT'"
                        :value="$t('profile.login_logout_history.logout')" 
                        severity="danger">
                    </Badge>
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
    </div>
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
                    name: this.$t('profile.login_logout_history.all'),
                    value: 'all'
                },
                {
                    name: this.$t('profile.login_logout_history.login'),
                    value: 'login'
                },
                {
                    name: this.$t('profile.login_logout_history.logout'),
                    value: 'logout'
                }
            ],
            records: []
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

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-component {
        margin-left: auto;
    }
}
</style>
