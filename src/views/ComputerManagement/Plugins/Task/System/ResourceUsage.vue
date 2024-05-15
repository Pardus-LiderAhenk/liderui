<template>
  <div>
    <base-plugin 
      :pluginUrl="pluginUrl" 
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @close-task-dialog="showTaskDialog = false"
      @task-response="getResourceUsage"
      :pluginTask="task"
    >
      <template #pluginTitle>
        {{$t("computer.plugins.resource_usage.header")}}
      </template>
      <template #pluginTitleButton>
        <Button
          icon="pi pi-chart-line"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.resource_usage.get_data')"
          @click.prevent="showConfirmDialogForTask"
          >
        </Button>
      </template>
      <template #default>
          <div class="p-grid">
            <div class="p-col-12 p-md-6 p-lg-6">
              <div>
                <Chart 
                  type="pie" class="chart"
                  :data="chartDiskData" 
                  :options="diskChartOptions"
                  :plugins="plugins">
                </Chart>
              </div>
              <div class="p-grid p-jc-center" style="margin-top:3px">
                <Button 
                  icon="fas fa-info-circle" 
                  class="p-button-text" 
                  @click="toggle($event, 'disk')" 
                  :label="$t('computer.plugins.resource_usage.view_detail')"
                />
                <OverlayPanel 
                  ref="diskOp" 
                  appendTo="body" 
                  :showCloseIcon="false" id="overlay_panel" 
                  style="width: 450px" 
                  :breakpoints="{'960px': '75vw'}">
                  <h5 class="text-center">{{$t('computer.plugins.resource_usage.disk_usage_detail')}}</h5>
                  <DataTable :value="disk" responsiveLayout="scroll" class="p-datatable-sm" :metaKeySelection="false">
                    <Column field="total" :header="$t('computer.plugins.resource_usage.total') + ' (GB)'"></Column>
                    <Column field="used" :header="$t('computer.plugins.resource_usage.used')+ ' (GB)'"></Column>
                    <Column field="available" :header="$t('computer.plugins.resource_usage.available')+ ' (GB)'"></Column>
                  </DataTable>
                  <DataTable v-if="hddDisk.length>0"  :value="hddDisk" responsiveLayout="scroll" class="p-datatable-sm" :metaKeySelection="false">
                    <Column field="type" :header="$t('computer.plugins.resource_usage.disk_type')"></Column> 
                    <Column field="total" :header="$t('computer.plugins.resource_usage.total') + ' (GB)'"></Column>
                    <Column field="used" :header="$t('computer.plugins.resource_usage.used')+ ' (GB)'"></Column>
                    <Column field="available" :header="$t('computer.plugins.resource_usage.available')+ ' (GB)'"></Column>
                  </DataTable>
                  <div style="margin-top:5px">
                    <small style="font-weight:bold;">
                      {{$t('computer.plugins.resource_usage.disk_partition')}}:&nbsp;
                      </small>
                      <small>{{ devices }}</small>
                  </div>
                </OverlayPanel>
              </div>
            </div>
            <div class="p-col-12 p-md-6 p-lg-6">
              <div>
                <Chart type="pie" class="chart"
                 :data="chartMemoryData"
                  :options="memoryChartOptions"
                  :plugins="plugins">
                </Chart>
              </div>
              <div class="p-grid p-jc-center" style="margin-top:3px">
                <Button 
                  icon="fas fa-info-circle" 
                  @click="toggle($event, 'memory')" 
                  class="p-button-text" 
                  :label="$t('computer.plugins.resource_usage.view_detail')"
                />
                <OverlayPanel 
                  ref="memoryOp" 
                  appendTo="body" 
                  :showCloseIcon="false" 
                  id="overlay_panel" 
                  style="width: 450px" 
                  :breakpoints="{'960px': '75vw'}">
                  <h5 class="text-center">{{$t('computer.plugins.resource_usage.memory_usage_detail')}}</h5>
                  <DataTable :value="memory" responsiveLayout="scroll" class="p-datatable-sm" :metaKeySelection="false">
                    <Column field="total" :header="$t('computer.plugins.resource_usage.total') + ' (GB)'"></Column>
                    <Column field="used" :header="$t('computer.plugins.resource_usage.used')+ ' (GB)'"></Column>
                    <Column field="available" :header="$t('computer.plugins.resource_usage.available')+ ' (GB)'"></Column>
                  </DataTable>
                </OverlayPanel>
              </div>
            </div>
          </div>
      </template>
      <template #pluginFooter>
      </template>
    </base-plugin>
  </div>
</template>

<script>
/**
 * Resource usage plugin 
 * @see {@link http://www.liderahenk.org/}
 */

import { mapGetters } from "vuex"
import Chart from 'primevue/chart'
import { ref } from 'vue';
import ChartDataLabels from 'chartjs-plugin-datalabels'


export default {
  setup() {
    const plugins = [ChartDataLabels]
      // expose to template and other options API hooks
      return {
        plugins
      }
    },
  props : {
    pluginTask: {
      type: Object,
      description: "Plugin task object",
    }
  },

  data() {
    return {
      showTaskDialog: false,
      task: null,
      devices: '',
      disk: [{
          total: '',
          used: '',
          available: ''
        }],
      hddDisk: [{
        type: '',
        total: '',
        used: '',
        available: ''
      }],
      memory: [{
        total: '',
        used: '',
        available: ''
      }],
      chartDiskData: null,
      chartMemoryData: null,
      diskChartOptions: null,
      memoryChartOptions: null,
      diskTitle: this.$t("computer.plugins.resource_usage.usage_disk") + " (%)",
      memoryTitle: this.$t("computer.plugins.resource_usage.usage_memory") + " (%)",
      labels: [
          this.$t("computer.plugins.resource_usage.available"),
          this.$t("computer.plugins.resource_usage.used"),
        ],
      
      pluginDescription: this.$t("computer.plugins.resource_usage.description"),
      pluginUrl: "https://docs.liderahenk.org/lider3.0/computerManagement/computerManagement/resourcesUsage/",
    };
  },

  computed: {
    ...mapGetters(["selectedAgentMessages"]),
  },

  created() {
    this.task = {...this.pluginTask};
  },

  mounted() {
    this.renderChartDisk(50,50);
    this.diskChartOptions = this.returnOptionForChart(this.diskTitle, false);
    this.renderMemoryDisk(50, 50);
    this.memoryChartOptions = this.returnOptionForChart(this.memoryTitle, false);
  },

  methods: {
    showConfirmDialogForTask(){
      this.task.commandId = "RESOURCE_INFO_FETCHER";
      this.task.parameterMap = {};
      this.showTaskDialog = true;
    },

    diskFormatter(number){
      return (number/1000).toFixed(2);
    },

    diskAvaibleArea(total,used){
      return this.diskFormatter(total-used);
    },

    getResourceUsage(message) {

      if (message.commandClsId == "RESOURCE_INFO_FETCHER") {
        this.diskChartOptions = this.returnOptionForChart(this.diskTitle, true);
        this.memoryChartOptions = this.returnOptionForChart(this.memoryTitle, true);
        var arrg = JSON.parse(message.result.responseDataStr);
        this.devices = arrg["Device"]
        this.disk = [];
        this.hddDisk  = [];
        var hddDiskTotal = [];
        var ssdDiskTotal = [];
        var totalDisk = arrg["Total Disc"]/1000;
        var usedDisk = (arrg["Usage Disc"]/1000).toFixed(2);
        var availableDisk = (totalDisk - usedDisk).toFixed(2);

        this.disk.push({
          total: totalDisk,
          used: usedDisk,
          available : availableDisk
          }
        );

        if(arrg["hardware.disk.hdd.info"]){
          for (let index = 0; index < (eval(arrg["hardware.disk.hdd.info"]).length); index++) {
            let element = (eval(arrg["hardware.disk.hdd.info"])[index]);
            hddDiskTotal.push(element);
          }
        }
        if(arrg["hardware.disk.ssd.info"]){
          for (let index = 0; index < (eval(arrg["hardware.disk.ssd.info"]).length); index++) {
            let element = eval(arrg["hardware.disk.ssd.info"])[index];
            ssdDiskTotal.push(element);
          }
        }

        this.hddDisk = hddDiskTotal || [];
        this.hddDisk = this.hddDisk.concat(ssdDiskTotal || []);
        this.hddDisk = eval(this.hddDisk);

        this.hddDisk.map(element => {
          element.available = this.diskAvaibleArea(element.total,element.used);
          element.total = this.diskFormatter(element.total);
          element.used = this.diskFormatter(element.used);
          return element;
        });

        this.memory = [];
        var totalMemory = arrg["Total Memory"]/1000;
        var usedMemory = (arrg["Usage"]/1000).toFixed(2);
        var availableMemory = (totalMemory - usedMemory).toFixed(2);
        this.memory.push({
          total: totalMemory,
          used: usedMemory,
          available : availableMemory
          }
        );
        let usageMemoryRate =((usedMemory / totalMemory)*100).toFixed(2);
        let availableMemoryRate = (100 - usageMemoryRate).toFixed(2);
        let usageDiskRate = ((usedDisk / totalDisk)*100).toFixed(2);
        let availableDiskRate = (100 - usageDiskRate).toFixed(2);

        this.renderChartDisk(availableDiskRate, usageDiskRate);
        this.renderMemoryDisk(availableMemoryRate, usageMemoryRate);
      }
    },

    renderChartDisk(availableMemoryRate,usageMemoryRate) {
      this.chartDiskData = {
        labels: this.labels,
        datasets: [
          {
            data: [availableMemoryRate,usageMemoryRate],
            backgroundColor: ["#66BB6A","#20639B"],
            hoverBackgroundColor: ["#81C784", "#20639B"]
          }
        ]
      };
    },
    
    renderMemoryDisk(availableMemoryRate, usageMemoryRate) {
      this.chartMemoryData = {
        labels: this.labels,
        datasets: [
          {
            data: [availableMemoryRate,usageMemoryRate],
            backgroundColor: ["#66BB6A","#20639B"],
            hoverBackgroundColor: ["#81C784", "#20639B"]
          }
        ]
      }
    },

    returnOptionForChart(title, display) {
      let options = ref({
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "center",
        },

        title: {
          display: true,
          align: "center",
          text: title
        },

        datalabels: {
          display: display,
          color: 'white',
          formatter: function(value) {
            return '% ' + value;
          },
          labels: {
            title: {
              font: {
                weight: 'bold',
                size: 12,
              },
            },
            value: {
              color: 'white',
              font: {
                weight: 'bold',
                size: 12,
              },
            },
          },
        },
      },
      maintainAspectRatio: false
      })
      return options;
    },
 
    toggle(event, type) {
      if (type == "disk") {
        this.$refs.diskOp.toggle(event);
      } else {
        this.$refs.memoryOp.toggle(event);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .chart {
    width: 400px;
    height: 250px;
  }
</style>