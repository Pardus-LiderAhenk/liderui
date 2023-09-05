<template>
    <div>
        <div class="p-flex-column">
            <div class="p-field p-d-flex p-jc-end" v-if="portList.length > 0">
                <Button
                    class="p-button-sm p-mr-2"
                    icon="pi pi-check"
                    :label="$t('computer.plugins.network_management.allow')"
                    @click.prevent="sendPortTask('ALLOW_PORT')">
                </Button>
                <Button
                    class="p-button-sm p-button-danger p-mr-2"
                    icon="pi pi-ban"
                    :label="$t('computer.plugins.network_management.block')"
                    @click.prevent="sendPortTask('BLOCK_PORT')">
                </Button>
            </div>
            <div class="p-field">
                <DataTable 
                    :value="portList" 
                    class="p-datatable-sm"
                    v-model:filters="filters"
                    v-model:selection="selectedPorts" :scrollable="false" scrollHeight="400px" responsiveLayout="scroll" 
                    @rowSelect="onRowSelect" @rowUnselect="onRowUnselect">
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
                        <span>{{$t('computer.plugins.network_management.table_port_empty_message')}}</span>
                    </div>
                    </template>
                    <Column  selectionMode="multiple"  headerStyle="width: 3em"></Column>
                    <Column field="serviceName" headerStyle="width: 20%"
                        :header="$t('computer.plugins.network_management.service_name')">
                    </Column>
                    <Column field="protocol" :header="$t('computer.plugins.network_management.protocol')"></Column>
                    <Column field="port" :header="$t('computer.plugins.network_management.port')"></Column>
                    <Column field="input" :header="$t('computer.plugins.network_management.input')">
                        <template #body="slotProps">
                            <Badge 
                                :value="slotProps.data.input === 'Allowed'? $t('computer.plugins.network_management.open'): 
                                $t('computer.plugins.network_management.closed')" 
                                :severity="slotProps.data.input === 'Allowed' ? 'success': 'danger'">
                            </Badge>
                        </template>
                    </Column>
                    <Column field="output" :header="$t('computer.plugins.network_management.output')">
                        <template #body="slotProps">
                            <Badge 
                                :value="slotProps.data.output === 'Allowed'? $t('computer.plugins.network_management.open'):
                                $t('computer.plugins.network_management.closed')" 
                                :severity="slotProps.data.output === 'Allowed' ? 'success': 'danger'">
                            </Badge>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>    
</template>

<script>
/**
 * Port Management Component.
 * commandId: ALLOW_PORT, BLOCK_PORT
 * @see {@link http://www.liderahenk.org/}
 * @event sendPortTask
 *
 */

import {FilterMatchMode} from 'primevue/api';

export default {

    props: {
        message: {
            type: String,
            description: "Task response message for port management",
        }
    },

    data() {
        return {
            filters: {},
            selectedPorts: [],
            portList: [],
        };
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

        parserPort(data) {
            this.portList = [];
            this.content = data;
            let ports = data.split("\n");
            for (let index = 0; index < ports.length; index++) {
                let element = ports[index].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
                this.portList.push({
                    "serviceName": element[0],
                    "protocol": element[1],
                    "port": element[2],
                    "input": element[3],
                    "output": element[4],
                });
            }
        },

        /**
         * emit sendPortTask event for send task to agent 
         * @event sendPortTask
         */

        sendPortTask(commandId){
            if (this.selectedPorts.length == 0) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('computer.plugins.network_management.port_task_warn'), 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            let ports = [];
            for (let index = 0; index < this.selectedPorts.length; index++) {
                const element = this.selectedPorts[index];
                ports.push(element.port);
                
            }
            
            ports = ports.toString();
            ports.replace(",", " ");
            
            let parameterMap = {
                "ports": ports.replace(",", " ")
			};
            this.$emit("sendPortTask", parameterMap, commandId);
        },

        changeStatusPort(data, commandId) {
            for (let index = 0; index < this.portList.length; index++) {
                const element = this.portList[index];
                if (element.port == data.port && element.protocol == data.protocol) {
                    let status = "Blocked";
                    if (commandId == "BLOCK_PORT") {
                        status = "Blocked"
                    } else {
                        status = "Allowed"
                    }
                    element.input = status;
                    element.output = status;
                }
            }
        }
    },

    watch: {
        message(){
            if (this.message.result.responseCode == "TASK_PROCESSED") {
                if (this.message.commandClsId == "BLOCK_PORT" || this.message.commandClsId == "ALLOW_PORT") {
                    for (let index = 0; index < this.selectedPorts.length; index++) {
                        const element = this.selectedPorts[index];
                        this.changeStatusPort(element, this.message.commandClsId);
                    }
                    this.selectedPorts = [];
                } else if (this.message.commandClsId == "GET_NETWORK_INFORMATION") {
                    let arrg = JSON.parse(this.message.result.responseDataStr);
                    this.parserPort(arrg.port);
                }
            } 
        }
    }
}
</script>

<style lang="scss" scoped>

::v-deep(.p-datatable .p-column-header-content) {
  .p-checkbox .p-checkbox-box{
    display: none !important
  }
}

::v-deep(.p-datatable .p-column-header-content) {
  pointer-events: none;
}

</style>