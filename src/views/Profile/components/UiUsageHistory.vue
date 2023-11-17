<template>
    <div>
         <h3>{{$t('profile.login_logout_history.login_logout_history')}}</h3>
        <DataTable :loading="loading" :value="records" responsiveLayout="scroll" class="p-datatable-sm">
            <template #header>
                <div class="p-d-flex p-ac-end p-grid" style="justify-content:flex-end;">
                    <div class="p-flex p-ac-end p-col-12" style="justify-conten:flex-end; text-align:right;">
                        <span class="p-input-icon-left">
                            <span>{{$t('profile.login_logout_history.status')}}: </span>
                            <Dropdown v-model="operationType" :options="statusOptions" 
                                optionLabel="name" optionValue="value" 
                                @change="getLogs"
                            />
                        </span>
                    </div>
                </div>
            </template>
            <Column header="#">
                <template #body="{index}">
                    <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
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

import { systemTaskReportService } from '../../../services/Reports/SystemLogReportService.js'
export default {
    data() {
        return {
            loading:false,
            operationType:'all',
            totalElements:0,
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
            records: [],
            pageNumber: 1,
            rowNumber: 10
        }
    },
    methods: {
        init(){
            this.getLogs();
        },
        onPage(event) {
            this.pageNumber = event.page + 1;
            this.rowNumber = event.rows;
            this.getLogs();
        },
        async getLogs() {
            this.loading = true;
            var data = new FormData();
            data.append("pageNumber", this.pageNumber);
            data.append("pageSize", this.rowNumber);
            data.append('operationType',this.operationType);

            const{response,error} = await systemTaskReportService.operationLogin(data);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('reports.task_report.error_operation_login_console_list'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
            else{
                if(response.status == 200){
                    this.records = response.data.content;
                    this.totalElements = response.data.totalElements;
                    this.loading = false;
                }
                else if(response.status == 417){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('reports.task_report.error_417_operation_console_list'), 
                        summary:this.$t("computer.task.toast_summary"), 
                        life: 3000
                    });                
                }
                this.loading = false;
            }
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
