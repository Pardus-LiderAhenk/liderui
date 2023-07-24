<template>
    <div>
        <Dialog
            :header="$t('Sunucu Bilgileri')" 
            :modal="true"
            :style="{ width: '40vw'}"
            v-model:visible="showDialog">

            <h5>{{ $t('Genel bilgiler') }}</h5>
            <div class="p-grid">
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>Makine ismi:</b></div>
                <div class="p-col-8">{{ selectedServer.machineName }}</div>
                <div class="p-col-4"><b>İp adresi:</b></div>
                <div class="p-col-8">{{ selectedServer.ip }}</div>
                <div class="p-col-4"><b>Kullanıcı:</b></div>
                <div class="p-col-8">{{ selectedServer.user }}</div>
                <div class="p-col-4"><b>Makinenin durumu:</b></div>
                <div class="p-col-8">{{ selectedServer.status }}</div>

                <h5>{{ $t('Disk Bilgisi') }}</h5>
                <Divider class="p-mt-0 p-pt-0 p-mb-0 p-pb-0" />
                <div class="p-col-4"><b>İşletim sistemi:</b></div>
                <div class="p-col-8">{{ getPropertyValue(selectedServer.properties, "os_name") }}</div>
                <div class="p-col-4"><b>Versiyon:</b></div>
                <div class="p-col-8">{{ getPropertyValue(selectedServer.properties, "os_version") }}</div>
                <div class="p-col-4"><b>Mac Adres:</b></div>
                <div class="p-col-8">{{ getPropertyValue(selectedServer.properties, "mac_addr") }}</div>
                <div class="p-col-4"><b>Toplam disk alanı≈</b></div>
                <div class="p-col-8">{{
                    ((getPropertyValue(selectedServer.properties, "disk_total")/1073741824 )*4096)
                    .toFixed(2) }}
                </div>
                <div class="p-col-4"><b>Boş disk alanı≈</b></div>
                <div class="p-col-8">{{
                   ((getPropertyValue(selectedServer.properties, "total_disk_empty")/1073741824 )*4096)
                    .toFixed(2) }}
                </div>

                <div class="p-col-4"><b>Toplam ram≈</b></div>
                <div class="p-col-8">{{
                  ((getPropertyValue(selectedServer.properties, "physical_memory"))/1073741824)
                   .toFixed(2) }}</div>
                </div>
                <div class="p-col-4"><b>Zaman:</b></div>
                <div class="p-col-8">{{ 
                    getPropertyValue(selectedServer.properties,"uptime_days")+"Gün "+getPropertyValue(selectedServer.properties,"uptime_hours")+"s "+getPropertyValue(selectedServer.properties, "uptime_minutes")+"dk"
                }}</div>

            <template #footer>

                <Button :label="$t('Kapat')" icon="pi pi-times" @click="showServerDetailDialog = false" class="p-button-text"/>

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
            type: Boolean
        },
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
    },
    mounted() {
        console.log(this.selectedServer)
    }
    
}

</script>