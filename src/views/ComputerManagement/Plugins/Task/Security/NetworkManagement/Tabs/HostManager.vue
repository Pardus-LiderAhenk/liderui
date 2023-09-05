<template>
    <div>
        <network-detail-dialog 
            :showNetworkDetailDialog="showNetworkDetailDialog" :content="content"
            @close-network-detail-dialog="showNetworkDetailDialog = false;">
        </network-detail-dialog>
        <Dialog 
            :header="$t('computer.plugins.network_management.add_server')" 
            v-model:visible="addHostDialog" 
            :modal="true" 
            :style="{width: '30vw'}"
        >
            <div class="p-fluid">
                <div class="p-field p-formgrid p-grid">
                    <div class="p-field p-col-12 p-md-6">
                        <label>{{$t('computer.plugins.network_management.ip_address')}}</label>
                        <InputText 
                            type="text"
                            v-model="hostForm.ipAddress" 
                            :class="validationForm.ipAddress ? 'p-invalid': ''" 
                            placeholder="192.168.*.*">
                        </InputText>
                        <small v-if="validationForm.ipAddress" class="p-error">
                            {{$t('computer.plugins.network_management.ip_address_warn')}}
                        </small>
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <label>{{$t('computer.plugins.network_management.domain_name')}}</label>
                        <InputText 
                            type="text"
                            v-model="hostForm.hostname" 
                            :class="validationForm.hostname ? 'p-invalid': ''" 
                            placeholder="liderahenk.org">
                        </InputText>
                        <small v-if="validationForm.hostname" class="p-error">
                            {{$t('computer.plugins.network_management.domain_name_warn')}}
                        </small>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button 
                    :label="$t('computer.plugins.network_management.cancel')" 
                    icon="pi pi-times" 
                    @click.prevent="addHostDialog = false; validationForm = {};" 
                    class="p-button-text p-button-sm">
                </Button>
                <Button 
                    :label="$t('computer.plugins.network_management.add')" 
                    icon="pi pi-plus" 
                    @click.prevent="addHost" 
                    class="p-button-sm">
                </Button>
            </template>
        </Dialog>
        <div class="p-flex-column">
            <div class="p-field p-d-flex p-jc-end" v-if="hostData.length > 0">
                <Button
                    class="p-button-sm p-mr-2"
                    icon="pi pi-info-circle"
                    :label="$t('computer.plugins.network_management.view_detail')"
                    @click.prevent="showNetworkDetailDialog = true">
                </Button>
                <Button
                    class="p-button-sm p-mr-2"
                    icon="pi pi-plus"
                    :label="$t('computer.plugins.network_management.add')"
                    @click.prevent="addHostDialog = true; validationForm = {}">
                </Button>
            </div>  
            <div class="p-field">
                <DataTable  :scrollable="false" scrollHeight="400px" responsiveLayout="scroll"
                    :value="hostData" 
                    class="p-datatable-sm"
                    v-model:filters="filters">
                    <template #header>
                        <div class="p-d-flex p-jc-end">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search"/>
                                <InputText 
                                    v-model="filters['global'].value" 
                                    class="p-inputtext-sm" 
                                    :placeholder="$t('computer.plugins.network_management.search')">
                                </InputText>
                            </span>
                        </div>
                    </template>
                    <template #empty>
                    <div class="p-d-flex p-jc-center">
                        <span>{{$t('computer.plugins.network_management.table_host_empty_message')}}</span>
                    </div>
                    </template>
                    <Column field="ipAddress" headerStyle="width: 30%"
                        :header="$t('computer.plugins.network_management.ip_address')">
                    </Column>
                    <Column field="hostname" :header="$t('computer.plugins.network_management.domain_name')" headerStyle="width: 40%"></Column>
                    <Column field="status" :header="$t('computer.plugins.network_management.status')" >
                        <template #body="slotProps">
                            <Badge 
                                :value="slotProps.data.status ? $t('computer.plugins.network_management.active'): $t('computer.plugins.network_management.passive')" 
                                :severity="slotProps.data.status ? 'success': 'danger'">
                            </Badge>
                        </template>
                    </Column>
                    <Column :exportable="false">
                    <template #body="slotProps">
                        <div class="p-d-flex p-jc-end">
                        <Button
                            class="p-button-danger p-button-sm p-button-rounded"
                            icon="pi pi-trash"
                            :title="$t('computer.plugins.network_management.delete')"
                            @click.prevent="deleteHost(slotProps.data)">
                        </Button>
                        </div>
                    </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>    
</template>

<script>
/**
 * Server(host) Management Component.
 * commandId: ADD_HOST, DELETE_HOST
 * @see {@link http://www.liderahenk.org/}
 * @event sendHostTask
 *
 */

import {FilterMatchMode} from 'primevue/api';
import NetworkDetailDialog from '@/views/ComputerManagement/Plugins/Task/Security/NetworkManagement/Tabs/NetworkDetailDialog.vue'

export default {

    props: {
        message: {
            type: String,
            description: "Task response message for host management",
        }
    },

    data() {
        return {
            filters: {},
            selectedHost: null,
            hostData: [],
            hostForm: {
                ipAddress: '',
                hostname: '',
            },
            addHostDialog: false,
            validationForm: {},
            showNetworkDetailDialog: false,
            content: ""
        };
    },

    created() {
      this.initFilters();
    },

    components: {
        NetworkDetailDialog
    },

    methods: {
        initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            }
        },

        parserHost(data) {
            this.content = data;
            this.hostData = [];
            let hostList = data.split("\n");
            for (var i = 0; i < hostList.length; i++) {
                let parserHost = hostList[i].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
                if (parserHost.length > 0) {
                    if (parserHost[0][0].match(/[0-9]/g) || parserHost[0].match(/#[0-9]/g)) {
                        let ipAddress = parserHost[0];
                        let hostname = parserHost[1];
                        if (parserHost.length > 2) {
                            hostname = parserHost.slice(1).join(" ");
                        }
                        let status = true;
                        if (parserHost[0].charAt(0) == "#") {
                            ipAddress = parserHost[0].replaceAll(/#/g, "");
                            status = false;
                        }
                       this.hostData.push({
                            "ipAddress": ipAddress,
                            "hostname": hostname,
                            "status": status
                        });
                    }
                }
            }
        },

        /**
         * emit sendHostTask event for send task to agent 
         * @event sendHostTask
         */

        addHost(){
            if (this.validateForm()) {
                let commandId = "ADD_HOST";
                let parameterMap = {
                    "ip": this.hostForm.ipAddress,
                    "hostname": this.hostForm.hostname,
                    "is_active": true
                 };
                this.$emit("sendHostTask", parameterMap, commandId);
                this.addHostDialog = false;
            }
        },

        deleteHost(data) {
            this.selectedHost = data;
            let commandId = "DELETE_HOST";
            let parameterMap = {
                "ip": data.ipAddress,
			    "hostname": data.hostname,
			    "is_active": data.status
            };
            this.$emit("sendHostTask", parameterMap, commandId);
        },

        deleteHostFromTable() {
            if (this.hostData.length > 0) {
                for (let index = 0; index < this.hostData.length; index++) {
                    const element = this.hostData[index];
                    if (this.selectedHost.ipAddress === element.ipAddress &&
                        this.selectedHost.hostname === element.hostname) {
                            this.hostData.splice(index, 1);
                    }
                }
            }
            this.selectedHost = null;
        },

        validateForm() {
            if (!this.hostForm.hostname.trim()){
                this.validationForm['hostname'] = true;
            } else{
                delete this.validationForm['hostname'];
            }
            if (!this.hostForm.ipAddress.trim()){
                this.validationForm['ipAddress'] = true;
            } else{
                delete this.validationForm['ipAddress'];
            }
            return !Object.keys(this.validationForm).length;
            },
        },

    watch: {
        message(){
            if (this.message.result.responseCode == "TASK_PROCESSED") {
                if (this.message.commandClsId == "DELETE_HOST") {
                    this.deleteHostFromTable();
                } else if (this.message.commandClsId == "ADD_HOST"){
                     this.hostData.push({
                        "ipAddress": this.hostForm.ipAddress,
                        "hostname": this.hostForm.hostname,
                        "status": true
                    });
                    this.hostForm.hostname = '';
                    this.hostForm.ipAddress = '';
                } else if (this.message.commandClsId == "GET_NETWORK_INFORMATION") {
                    let arrg = JSON.parse(this.message.result.responseDataStr);
                    this.parserHost(arrg.hosts);
                }
            } 
        },

        hostForm: {
            handler(){
                this.validateForm();
            },
            deep: true,
        },
    }
}
</script>

<style lang="scss" scoped>


</style>