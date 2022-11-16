<template>
    <div class="p-flex-column">
        <div class="p-field">
            <h3>{{$t('user_management.session_history')}}</h3>
        </div>
        <div class="p-field">
            <DataTable :value="sessions" class="p-datatable-sm" v-model:filters="filters"
                :paginator="true" :rows="10" ref="dt" :loading="loading"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                :rowsPerPageOptions="[10,25,50,100]"  style="margin-top: 2em">
                <template #header>
                    <div class="p-d-flex p-jc-between">
                        <div style="text-align: left">
                            <Button v-if="sessions"
                                class="p-button-sm" icon="pi pi-download"
                                :label="$t('user_management.export')"
                                @click="exportCSV($event)">
                            </Button>
                        </div>
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
                    </div>
                </template>
                <template #empty>
                    <div class="p-d-flex p-jc-center">
                        <span>{{$t('user_management.session_history_table_empty_message')}}</span>
                    </div>
                </template>
                <Column field="rowIndex" header="#" style="width:5%">
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
            let params = new FormData();
            params.append("uid", this.selectedNode.uid);

            const{response,error} = await userService.userSession(this.selectedNode.uid);
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
                        this.sessions = response.data;
                    }
                }
                else if(response.status == 417){
                    return "error";
                }
            }
            
            this.loading = false;
        },

        getFormattedDate(date) {
            let h= date.split('T');
            let hours=h[1].split(':')
            let d = date.slice(0, 10).split('-');  
            return d[1] +'/'+ d[2] +'/'+ d[0] + ' '+(hours[0])+":"+hours[1]; // 10/30/2010
        },

        exportCSV() {
            this.$refs.dt.exportCSV();
        }
    },

    watch : {
        selectedNode() {
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

::v-deep(.p-datatable.p-datatable-customers) {
    .p-paginator {
        padding: 1rem;
    }
}
</style>