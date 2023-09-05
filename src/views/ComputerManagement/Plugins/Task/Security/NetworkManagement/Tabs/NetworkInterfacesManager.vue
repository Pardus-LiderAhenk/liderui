<template>
    <div>
        <network-detail-dialog 
            :showNetworkDetailDialog="showNetworkDetailDialog" :content="content"
            @close-network-detail-dialog="showNetworkDetailDialog = false;">
        </network-detail-dialog>
        <Dialog 
            :header="$t('computer.plugins.network_management.add_network')" 
            v-model:visible="addNetworkDialog" 
            :modal="true" 
            :style="{width: '25vw'}" 
            >
            <div class="p-fluid">
                <div class="p-field p-grid p-formgrid">
                    <label class="p-col-4" >
                        {{ $t('computer.plugins.network_management.type') }}
                    </label>
                    <div class="p-col-8">
                        <Dropdown
                            v-model="type" 
                            :options="networkTypeList" 
                            optionLabel="label" @change="validationForm = {}">
                        </Dropdown>
                    </div>
                </div>
                <div class="p-field p-grid">
                    <label class="p-col-4" >
                        {{ $t('computer.plugins.network_management.network_name') }}
                    </label>
                    <div class="p-col-8">
                        <InputText  
                            v-model="networkForm.name"
                            :class="validationForm.name ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                            placeholder="enp0s3">
                        </InputText>
                        <small v-show="validationForm.name" 
                            class="p-error">{{ $t('computer.plugins.network_management.network_name_warn') }}
                        </small>
                    </div>
                </div>
                <div class="p-field p-grid" v-if="type.value == 'STATIC'">
                    <label class="p-col-4" >
                        {{ $t('computer.plugins.network_management.ip_address') }}
                    </label>
                    <div class="p-col-8">
                        <InputText  
                            v-model="networkForm.ipAddress"
                            :class="validationForm.ipAddress ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                            placeholder="192.168.*.*">
                        </InputText>
                        <small v-show="validationForm.ipAddress" 
                            class="p-error">{{ $t('computer.plugins.network_management.ip_address_warn') }}
                        </small>
                    </div>
                </div>
                <div class="p-field p-grid" v-if="type.value == 'STATIC'">
                    <label class="p-col-4" >
                        {{ $t('computer.plugins.network_management.netmask') }}
                    </label>
                    <div class="p-col-8">
                        <InputText  
                            v-model="networkForm.netmask"
                            class="p-inputtext-sm"
                            placeholder="255.255.*.*">
                        </InputText>
                        <small v-show="validationForm.netmask" 
                            class="p-error">{{ $t('computer.plugins.network_management.netmask_name_warn') }}
                        </small>
                    </div>
                </div>
                <div class="p-field p-grid" v-if="type.value == 'STATIC'">
                    <label class="p-col-4" >
                        {{ $t('computer.plugins.network_management.gateway') }}
                    </label>
                    <div class="p-col-8">
                        <InputText  
                            v-model="networkForm.gateway"
                            class="p-inputtext-sm" 
                            placeholder="192.168.*.*">
                        </InputText>
                        <small v-show="validationForm.gateway" 
                            class="p-error">{{ $t('computer.plugins.network_management.gateway_name_warn') }}
                        </small>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button 
                    :label="$t('computer.plugins.network_management.cancel')" 
                    icon="pi pi-times" 
                    @click.prevent="addNetworkDialog = false; validationForm = {};" 
                    class="p-button-text p-button-sm">
                </Button>
                <Button 
                    :label="$t('computer.plugins.network_management.add')" 
                    icon="pi pi-plus" 
                    @click.prevent="addNetworkInterfaces" 
                    class="p-button-sm">
                </Button>
            </template>
        </Dialog>
        <div class="p-flex-column">
            <div class="p-field p-d-flex p-jc-end" v-if="networkInterfacesData.length > 0">
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
                    @click.prevent="addNetworkDialog = true; validationForm = {}">
                </Button>
            </div>        
            <div class="p-field">
                <DataTable :scrollable="false" scrollHeight="400px" responsiveLayout="scroll"
                    :value="networkInterfacesData"
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
                        <span>{{$t('computer.plugins.network_management.network_empty_message')}}</span>
                    </div>
                    </template>
                    <Column field="name" :header="$t('computer.plugins.network_management.network_name')"></Column>
                    <Column field="ipAddress" headerStyle="width: 30%"
                        :header="$t('computer.plugins.network_management.ip_address')">
                    </Column>
                    <Column field="type" :header="$t('computer.plugins.network_management.type')"></Column>
                    <Column field="status" :header="$t('computer.plugins.network_management.status')" >
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
                            @click.prevent="deleteNetworkInterfaces(slotProps.data)">
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
 * Network Interfaces Management Component.
 * commandId: ADD_NETWORK, DELETE_NETWORK
 * @see {@link http://www.liderahenk.org/}
 * @event sendNetworkInterfacesTask
 *
 */

import {FilterMatchMode} from 'primevue/api'
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
            selectedNetwork: null,
            networkInterfacesData: [],
            networkForm: {
                ipAddress: '',
                name: '',
                netmask: '',
                gateway: ''
            },
            type: {
                    label: "static", 
                    value: 'STATIC'
                },
            networkTypeList: [
                {
                    label: "static", 
                    value: 'STATIC'
                },
                {
                    label: "loopback",
                    value: "LOOPBACK"
                },
                {
                    label: "dhcp",
                    value: "DHCP"
                } ],
            addNetworkDialog: false,
            showNetworkDetailDialog: false,
            validationForm: {},
            content: ""
        };
    },

    components: {
        NetworkDetailDialog,
    },

    created() {
      this.initFilters();
    },

    methods: {
        initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
            }
        },

        parserNetworkInterfaces(data) {
            this.content = data;
            this.networkInterfacesData = [];
            let interfacesList = data.split("\n");
            for (var i = 0; i < interfacesList.length; i++) {
                if (interfacesList[i].includes("iface")) {
                    let parserInterface = interfacesList[i].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
                    let name = parserInterface[1];
                    let type = parserInterface[3];
                    let status = true;
                    if (parserInterface[0].charAt(0) == "#") {
                        status = false;
                    }
                    let ipAddress = null;
                    if (name != "lo" && type == "static") {
                        let parserAdress = interfacesList[i+1].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
                        if (parserAdress.length > 0 && parserAdress.includes("address")){
                            ipAddress = parserAdress[parserAdress.length - 1];
                        }
                    }
                    this.networkInterfacesData.push({
                        "ipAddress": ipAddress,
                        "name": name,
                        "status": status,
                        "type": type,
                    });
                }
            }
        },

        /**
         * emit sendNetworkInterfacesTask event for send task to agent 
         * @event sendNetworkInterfacesTask
         */

        addNetworkInterfaces(){
            if (this.validateForm()) {
                let commandId = "ADD_NETWORK";
                let parameterMap = {
                    "ip": this.networkForm.ipAddress,
					"name": this.networkForm.name,
					"is_active": true,
					"netmask": this.networkForm.netmask,
					"gateway": this.networkForm.gateway,
					"type": this.type.value
                 };
                this.$emit("sendNetworkInterfacesTask", parameterMap, commandId);
                this.addNetworkDialog = false;
            }
        },

        deleteNetworkInterfaces(data) {
            this.selectedNetwork = data;
            let commandId = "DELETE_NETWORK";
            let parameterMap = {
                "ip": data.ipAddress,
                "name": data.name,
                "is_active": data.status,
                "type": data.type
            };
            this.$emit("sendNetworkInterfacesTask", parameterMap, commandId);
        },

        deleteNetworkInterfacesFromTable() {
            if (this.networkInterfacesData.length > 0) {
                for (let index = 0; index < this.networkInterfacesData.length; index++) {
                    const element = this.networkInterfacesData[index];
                    if (this.selectedNetwork.name === element.name) {
                            this.networkInterfacesData.splice(index, 1);
                    }
                }
            }
            this.selectedNetwork = null;
        },

        validateForm() {
            if (!this.networkForm.name.trim()){
                this.validationForm['name'] = true;
            } else{
                delete this.validationForm['name'];
            }
            if (this.type.value == "STATIC") {
                if (!this.networkForm.ipAddress.trim()){
                    this.validationForm['ipAddress'] = true;
                } else{
                    delete this.validationForm['ipAddress'];
                }
                if (!this.networkForm.netmask.trim()){
                    this.validationForm['netmask'] = true;
                } else{
                    delete this.validationForm['netmask'];
                }
                if (!this.networkForm.gateway.trim()){
                    this.validationForm['gateway'] = true;
                } else{
                    delete this.validationForm['gateway'];
                }
            }
            return !Object.keys(this.validationForm).length;
            },
        },

    watch: {
        message(){
            if (this.message.result.responseCode == "TASK_PROCESSED") {
                if (this.message.commandClsId == "DELETE_NETWORK") {
                    this.deleteNetworkInterfacesFromTable();
                } else if (this.message.commandClsId == "ADD_NETWORK"){
                     this.networkInterfacesData.push({
                        "ipAddress": this.networkForm.ipAddress,
                        "name": this.networkForm.name,
                        "status": true,
                        "type": this.type.value.toLowerCase(),
                    });
                    this.networkForm.name = '';
                    this.networkForm.ipAddress = '';
                    this.networkForm.netmask = '';
                    this.networkForm.gateway = '';
                } else if (this.message.commandClsId == "GET_NETWORK_INFORMATION") {
                    let arrg = JSON.parse(this.message.result.responseDataStr);
                    this.parserNetworkInterfaces(arrg.interfaces);
                }
            } 
        },

        networkForm: {
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