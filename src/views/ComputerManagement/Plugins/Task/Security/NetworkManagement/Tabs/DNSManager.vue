<template>
    <div>
        <network-detail-dialog 
            :showNetworkDetailDialog="showNetworkDetailDialog" :content="content"
            @close-network-detail-dialog="showNetworkDetailDialog = false;">
        </network-detail-dialog>
        <Dialog 
            :header="$t('computer.plugins.network_management.add_dns')" 
            v-model:visible="addDNSDialog" 
            :modal="true" 
            :style="{width: '30vw'}"
        >
            <div class="p-fluid">
                <div class="p-field p-formgrid p-grid">
                    <div class="p-field p-col-12 p-md-4">
                        <label for="state">{{$t('computer.plugins.network_management.select')}}</label>
                        <Dropdown
                            v-model="type" 
                            :options="domainTypeList"
                            optionLabel="label">
                        </Dropdown>
                    </div>
                    <div class="p-field p-col-12 p-md-8">
                        <label v-if="type.value=='nameserver'">{{$t('computer.plugins.network_management.ip_address')}}</label>
                        <label v-if="type.value=='search'">{{$t('computer.plugins.network_management.domain_name')}}</label>
                        <InputText 
                            type="text"
                            v-model="dnsName" 
                            :class="validationDnsName ? 'p-invalid': ''" 
                            :placeholder="type.value=='nameserver' ? '192.168.*.*': 'liderahenk.org'">
                        </InputText>
                        <small v-if="validationDnsName" class="p-error">
                            {{$t('computer.plugins.network_management.dns_name_warn')}}
                        </small>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button 
                    :label="$t('computer.plugins.network_management.cancel')" 
                    icon="pi pi-times" 
                    @click.prevent="addDNSDialog = false" 
                    class="p-button-text p-button-sm">
                </Button>
                <Button 
                    :label="$t('computer.plugins.network_management.add')" 
                    icon="pi pi-plus" 
                    @click.prevent="addDNS" 
                    class="p-button-sm">
                </Button>
            </template>
        </Dialog>
        <div class="p-flex-column">
            <div class="p-field p-d-flex p-jc-end" v-if="dnsData.length > 0">
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
                    @click.prevent="addDNSDialog = true; validationDnsName = false;">
                </Button>
            </div>
            <div class="p-field">
                <DataTable :scrollable="false" scrollHeight="400px" responsiveLayout="scroll"
                    :value="dnsData" 
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
                        <span>{{$t('computer.plugins.network_management.table_dns_empty_message')}}</span>
                    </div>
                    </template>
                    <Column field="name" headerStyle="width: 40%"
                        :header="$t('computer.plugins.network_management.ip_address') +' / '+$t('computer.plugins.network_management.domain_name')">
                    </Column>
                    <Column field="type" :header="$t('computer.plugins.network_management.type')" headerStyle="width: 30%"></Column>
                    <Column field="status" :header="$t('computer.plugins.network_management.status')">
                        <template #body="slotProps">
                            <Badge 
                                :value="slotProps.data.status ? $t('computer.plugins.network_management.active'):
                                 $t('computer.plugins.network_management.passive')" 
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
                                @click.prevent="deleteDNS(slotProps.data)">
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
 * DNS Management Component.
 * commandId: ADD_DNS, ADD_DOMAIN, DELETE_DNS, DELETE_DOMAIN
 * @see {@link http://www.liderahenk.org/}
 * @event sendDnsTask
 *
 */

import NetworkDetailDialog from '@/views/ComputerManagement/Plugins/Task/Security/NetworkManagement/Tabs/NetworkDetailDialog.vue'
import {FilterMatchMode} from 'primevue/api';

export default {

    props: {
        message: {
            type: String,
            description: "Task response message for dns management",
        }
    },

    data() {
        return {
            filters: {},
            selectedDNS: null,
            dnsData: [],
            addDNSDialog: false,
            dnsName: '',
            validationDnsName: false,
            domainTypeList: [
                {
                    label: this.$t('computer.plugins.network_management.ip_address'), 
                    value: 'nameserver'
                },
                {
                    label: this.$t('computer.plugins.network_management.domain_name'), 
                    value: 'search'
                }],
            type: {
                    label: this.$t('computer.plugins.network_management.ip_address'), 
                    value: 'nameserver'
                },
            content: "",
            showNetworkDetailDialog: false,
        };
    },

    created() {
      this.initFilters();
    },

    components: {
        NetworkDetailDialog,
    },

    methods: {
        initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            }
        },

        parserDNS(data) {
            this.dnsData = [];
            this.content = data;
            let dnsList = data.split("\n");
            for (let index = 0; index < dnsList.length; index++) {
                const element = dnsList[index];
                let parserDns = element.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
                if (parserDns[1] != null) {
                    let name = parserDns[1];
                    let type = parserDns[0];
                    let status = true;
                    if (parserDns[0].charAt(0) == "#") {
                        type = parserDns[0].replaceAll(/#/g, "");
                        status = false;
                    }
                    let joinLine = parserDns.join(" ");
                    if (joinLine.includes("#nameserver") || joinLine.includes("#search") ||
                        joinLine.includes("nameserver") || joinLine.includes("search")) {
                        this.dnsData.push({
                            "name": name,
                            "type": type,
                            "status": status
                        });
                    }
                }
            }
        },

        /**
         * emit sendDnsTask event for send task to agent 
         * @event sendDnsTask
         */

        addDNS(){
            if (!this.dnsName.trim()) {
                this.validationDnsName = true;
                return;
            }
            let commandId = "ADD_DNS";
            let parameterMap = {
                "ip": this.dnsName,
                "is_active": true
			};
            if (this.type.value == "search") {
                commandId = "ADD_DOMAIN";
                parameterMap = {
					"domain": this.dnsName,
			    };
            }
            this.$emit("sendDnsTask", parameterMap, commandId);
            this.addDNSDialog = false;
        },

        deleteDNS(data) {
            this.selectedDNS = data;
            let commandId = "DELETE_DNS";
            let parameterMap = {
                "ip": data.name,
                "is_active": data.status
            };
            if (data.type == "search") {
                commandId = "DELETE_DOMAIN";
                parameterMap = {
                    "domain": data.name
                };
            }
            this.$emit("sendDnsTask", parameterMap, commandId);
        },

        deleteDNSFromTable() {
            if (this.dnsData.length > 0) {
                for (let index = 0; index < this.dnsData.length; index++) {
                    const element = this.dnsData[index];
                    if (this.selectedDNS.name === element.name) {
                        this.dnsData.splice(index, 1);
                    }
                }
            }
            this.selectedDNS = null;
        },
    },

    watch: {
        message(){
            if (this.message.result.responseCode == "TASK_PROCESSED") {
                if (this.message.commandClsId == "DELETE_DOMAIN" || this.message.commandClsId == "DELETE_DNS") {
                    this.deleteDNSFromTable();
                } else if (this.message.commandClsId == "ADD_DOMAIN" || this.message.commandClsId == "ADD_DNS"){
                    this.dnsData.push({
                        "name": this.dnsName,
                        "type": this.type.value,
                        "status": true
                    });
                    this.dnsName = '';
                } else if (this.message.commandClsId == "GET_NETWORK_INFORMATION") {
                    let arrg = JSON.parse(this.message.result.responseDataStr);
                    this.parserDNS(arrg.dns);
                }
            } 
        },

        dnsName(){
            if (this.dnsName.trim()) {
                this.validationDnsName = false;
            }
        },   
    }
}
</script>

<style lang="scss" scoped>

</style>