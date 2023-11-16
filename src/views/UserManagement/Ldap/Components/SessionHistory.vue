<template>
    <div class="p-flex-column">
        <div class="p-field">
            <h3>{{$t('user_management.session_history')}}</h3>
        </div>
        <div class="p-field">
            <DataTable :value="sessions" class="p-datatable-sm" v-model:filters="filters"
                ref="dt" :loading="loading" style="margin-top: 2em">
                <template #header>
                    <div class="p-d-flex p-jc-end">
                        <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText 
                            v-model="filters['global'].value" 
                            class="p-inputtext-sm" 
                            :placeholder="$t('user_management.search')" 
                        />
                        </span>
                    </div>
                </template>
                <template #empty>
                    <div class="p-d-flex p-jc-center">
                        <span>{{$t('user_management.session_history_table_empty_message')}}</span>
                    </div>
                </template>
                <Column header="#">
                    <template #body="{index}">
                    <span>{{ ((pageNumber - 1)*rowNumber) + index + 1 }}</span>
                    </template>
                </Column>
                <Column header="#" style="width:5%">
                    <template #body>
                        <i class="fab fa-linux" style="color:#000000;"></i>
                    </template>
                </Column>
                <Column field="agent.hostname" :header="$t('user_management.hostname')"></Column>
                <Column field="agent.ipAddresses" :header="$t('user_management.ip_address')">
                    <template #body="slotProps">
                        {{ slotProps.data.agent.ipAddresses.replace(/'/g, "") }}
                    </template>
                </Column>
                <Column field="sessionEvent" :header="$t('user_management.status')">
                    <template #body="slotProps">
                        <Badge v-if="slotProps.data.sessionEvent == 'LOGIN'" 
                            :value="$t('user_management.login')" 
                            severity="success">
                        </Badge>
                        <Badge v-if="slotProps.data.sessionEvent == 'LOGOUT'"
                            :value="$t('user_management.logout')" 
                            severity="danger">
                        </Badge>
                    </template>
                </Column>
                <Column field="createDate" :header="$t('user_management.date')">
                    <template #body="slotProps">
                        <p>{{getFormattedDate(slotProps.data.createDate)}}</p>
                    </template>
                </Column>
            </DataTable>
            <Paginator
                ref="paging"
                :first="offset"
                :rows="10"
                :totalRecords="totalElements"
                :rowsPerPageOptions="[10, 25, 50, 100]"
                @page="onPage($event)"
            >
            </Paginator>
        </div>
    </div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import { userService } from '../../../../services/Settings/UserService';

export default {

    props: {
        selectedNode: {
            type: Object,
            description: "Selected tree node",
        },
    },

    data() {
        return {
            loading: false,
            sessions: null,
            filters: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            totalElements: 0,
            currentPage: 1,
            offset: 1,
            pageNumber: 1,
            rowNumber: 10,
        }
    },

    mounted() {
        if (this.selectedNode && this.selectedNode.type === "USER") {
            this.getSessionHistory();
        } else {
            this.sessions = null;
        }
        
    },

    methods: {
        async getSessionHistory() {
            this.loading = true;

            const{response,error} = await userService.userSession(this.selectedNode.uid, this.pageNumber, this.rowNumber);
            if(error){
                this.$toast.add({
                    severity:'error', 
                    detail: this.$t('user_management.session_history_error')+ " \n"+error, 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }else{
                if(response.status == 200){
                    if (response.data) {
                        this.sessions = response.data.content;
                        this.totalElements = response.data.totalElements;
                    }
                }
                else if(response.status == 417){
                    return "error";
                }
            }
            
            this.loading = false;
        },

        onPage(event) {
            this.loading = true;
            this.pageNumber = event.page + 1;
            this.rowNumber = event.rows;
            this.getSessionHistory();
        },

        getFormattedDate(date) {
            let h= date.split('T');
            let hours=h[1].split(':')
            let d = date.slice(0, 10).split('-');  
            return d[1] +'/'+ d[2] +'/'+ d[0] + ' '+(hours[0])+":"+hours[1]; // 10/30/2010
        },
    },

    watch : {
        selectedNode() {
            this.$refs.paging.$emit('page', {
                page: 0,
                rows: 10,
                first: 0,
            });
            if (this.selectedNode && this.selectedNode.type === "USER") {
               this.getSessionHistory();
            } else {
                this.sessions = null;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-paginator-current {
        margin-left: auto;
    }
}

::v-deep(.p-paginator) {
    .p-component {
        margin-left: auto;
    }
}
</style>