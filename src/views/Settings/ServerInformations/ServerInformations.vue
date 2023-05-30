<template>
   
    <div class="p-col-12 p-md-3 p-lg-4">
        <div class="card">
            <Card>
            <template #title> Kullanıcı işlemleri </template>
                <ul data-v-b94db64c>
                    <li class="blue">
                        <i class="pi pi-circle-on"></i>
                    </li>
                </ul>
                
            </Card>
          
        </div>
    
        <div class="datatable">
    
            <Button 
                class="p-button-sm" 
                icon="pi pi-plus" 
                :label="$t('sunucu ekle')"
                @click="addServerModalVisible =  true">
            </Button>

            <DataTable :value="serverList" showGridlines tableStyle="min-width: 50rem">
                <Column field="ip" header="Ip"></Column>
                <Column field="hostname" header="Hostname"></Column>
                <Column field="users" header="Kullanıcı"></Column>
                <Column field="password" header="Parola"></Column>
                <Column header="Durum">
                    <template>
                        <Tag/>
                        <!-- <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)" /> -->
                    </template>
                </Column>
                <Column field="inspect" header="İncele">
                    <Button 
                    class="p-button-sm" 
                    icon="pi pi-plus" 
                    :label="$t('sunucu ekle')"
                    @click="addServerModalVisible =  true">
                </Button>
                </Column>
            </DataTable>
            
        </div>

    <div>
        <div class="p-field p-grid">
            <div class="">
                <disk-information></disk-information>
            </div>
        </div>

        <div class="p-field p-grid" >
            <div class="">
               <ram-information></ram-information>
            </div>
        </div>

        <div class="p-field p-grid">
            <div class="">
               <cpu-information></cpu-information>
            </div>
        </div>
    </div>
    
    </div>
       
    <add-server-dialog v-if="addServerModalVisible"
        @updateConsoleUsers="getConsoleUsers"
        :modalVisibleValue="addServerModalVisible" 
        @modalVisibleValue="addServerModalVisible = $event;"
    />
    </template>
    <script>
    /**
     * Dashboard page
     * @see {@link http://www.liderahenk.org/}
     */
    

    import ChartDataLabels from 'chartjs-plugin-datalabels';
    import AddServerDialog from './Dialogs/AddServerDialog.vue';
    import Card from "primevue/card";
    import DiskInformation from "./Component/DiskInformation.vue";
    import RamInformation from "./Component/RamInformation.vue";
    import CpuInformation from "./Component/CpuInformation.vue";
    
    
    
    export default {
        setup() {
        const plugins = [ChartDataLabels]
          return {
            plugins,
          }
        },
        data() {
            return {
                addServerModalVisible :false,
            }
        },
        
        components: {
            AddServerDialog,
            DiskInformation,
            RamInformation,
            CpuInformation,
        },
        
        mounted() {
    
        },
    
        methods: {
                        
        }
    
    }
    </script>
    
    <style lang="scss" scoped>
    
    .card {
        background: #ffffff;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 0px 10px 40px rgba(41, 50, 65, 0.06);
    }

    </style>