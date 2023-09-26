<template>
    <div>
        <Dialog
            :header="$t('settings.server_information.server_information')" 
            :modal="true"
            :style="{ width: '40vw'}"
            v-model:visible="showDialog">

            <h5>{{ $t('settings.server_information.general_information') }}</h5>
            <div class="p-grid">
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                
                <div class="p-col-4"><b>{{$t('settings.server_information.detail_machine_name')}}</b></div>
                <div class="p-col-8">{{ selectedServer.machineName }}</div>
                <div class="p-col-4"><b>{{$t('settings.server_information.detail_ip_addr')}}</b></div>
                <div class="p-col-8">{{ selectedServer.ip }}</div>
                <div class="p-col-4"><b>{{$t('settings.server_information.detail_user')}}</b></div>
                <div class="p-col-8">{{ selectedServer.user }}</div>
                <div class="p-col-4"><b>{{$t('settings.server_information.detail_status')}}</b></div>
                <div class="p-col-8">
                    <Badge 
                        :value="selectedServer.status ? $t('settings.server_information.connect'): $t('settings.server_information.disconnect')" 
                        :severity="selectedServer.status ? 'success': 'danger'">
                    </Badge>
                </div>
                <div class="p-col-4"><b>{{$t('settings.server_information.description')}}</b></div>
                <div class="p-col-8">{{ selectedServer.description }}</div>
                <div class="p-col-4"><b>{{$t('settings.server_information.create_date')}}</b></div>
                <div class="p-col-8">{{ selectedServer.createDate }}</div>

                <h5>{{ $t('settings.server_information.server_properties') }}</h5>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                
                <div class="p-col-4"><b>{{$t('settings.server_information.detail_os_system')}}</b></div>
                <div class="p-col-8">{{ getPropertyValue(selectedServer.properties, "os_name") }}</div>
                <div class="p-col-4"><b>{{$t('settings.server_information.os_version')}}</b></div>
                <div class="p-col-8">{{ getPropertyValue(selectedServer.properties, "os_version") }}</div>
                <div class="p-col-4"><b>{{$t('settings.server_information.detail_mac_addr')}}</b></div>
                <div class="p-col-8">{{ getPropertyValue(selectedServer.properties, "mac_addr") }}</div>
                
                <div class="p-col-4"><b>{{$t('settings.server_information.detail_total_disk')}} (GB)</b></div>
                <div class="p-col-8">{{
                    ((getPropertyValue(selectedServer.properties, "disk_total")/1073741824 )*4096)
                    .toFixed(2) }}
                </div>
                <div class="p-col-4"><b>{{$t('settings.server_information.detail_empty_disk') }} (GB)</b></div>
                <div class="p-col-8">{{
                   ((getPropertyValue(selectedServer.properties, "total_disk_empty")/1073741824 )*4096)
                    .toFixed(2) }}
                </div>

                <div class="p-col-4"><b>{{$t('settings.server_information.detail_total_ram')}} (GB)</b></div>
                <div class="p-col-8">{{
                  ((getPropertyValue(selectedServer.properties, "physical_memory"))/1073741824)
                   .toFixed(2) 
                }}</div>

                <div class="p-col-4"><b>{{ $t('settings.server_information.uptime')}}</b></div>
                <div class="p-col-8">{{  
                    getPropertyValue(selectedServer.properties,"uptime_days") + " " + $t('settings.server_information.day') + " " +
                    getPropertyValue(selectedServer.properties,"uptime_hours") + " " + $t('settings.server_information.hour') + " " +
                    getPropertyValue(selectedServer.properties,"uptime_minutes") + " " + $t('settings.server_information.minute') 
                }}</div>
                <div class="p-col-4"><b>{{$t('settings.server_information.update_date')}}</b></div>
                <div class="p-col-8">{{ getUpdateDateOfProperty(selectedServer.properties, "disk_total") }}</div>
            </div>
            <template #footer>
                <Button :label="$t('settings.server_information.close')" icon="pi pi-times" @click="showDialog = false" class="p-button-text"/>
            </template>
        </Dialog>
    </div>
</template>
<script>

export default {

    props: {
        
        selectedServer: {
            type: Object,
            description: "Server detail",
        },

        showServerDetailDialog: {
            type: Boolean,
            default: false
        }
    },

    data(){
        return {
            loading: false
        }
    },

    computed: {
        showDialog: {
            get() {
                return this.showServerDetailDialog;
            },
            set() {
                this.$emit('closeServerDetail', false);
            }
        },
    },

    methods:{
        getPropertyValue(properties, propertyName) {
            var propertyValue = "";
            const filteredProperties = properties.filter(
              (property) => property.propertyName === propertyName
            );
            if (filteredProperties != null && filteredProperties.length > 0) {
              propertyValue = filteredProperties[0].propertyValue;
            
            }
                return propertyValue;
            
        },

        getUpdateDateOfProperty(properties, propertyName) {
            var modifyDate = "";
            const filteredProperties = properties.filter(
              (property) => property.propertyName === propertyName
            );
            if (filteredProperties != null && filteredProperties.length > 0) {
                modifyDate = filteredProperties[0].modifyDate;
            
            }
                return modifyDate;
            
        }
    }
    
};

</script>