<template>
  <div>
    <base-plugin 
      :pluginUrl="pluginUrl" 
      :pluginDescription="pluginDescription"
      :showTaskDialog="showTaskDialog"
      @send-task="getResourceUsage"
      @cancel-task="showTaskDialog = false"
      :pluginTask="task"
    >
      <template #pluginHeader>
        {{$t("computer.plugins.resource_usage.header")}}
      </template>
      <template #pluginHeaderButton>
        <Button
          icon="pi pi-chart-line"
          class="p-button-raised p-button-sm"
          :title="$t('computer.plugins.resource_usage.get_data')"
          @click.prevent="showConfirmDialogForTask"
          >
        </Button>
      </template>
      <template #default>
        <div>
          <div class="p-grid">
            <div class="p-col-6">
              <div>
                <Chart  type="pie" :data="chartDiskData" with="300" height="150" :options="diskChartOptions"></Chart>
              </div>
              <div class="p-grid p-jc-center" style="margin-top:3px">
                <el-popover placement="bottom" :width="450" trigger="click">
                  <template #reference>
                     <Button icon="fas fa-info-circle" class="p-button-text" :label="$t('computer.plugins.resource_usage.view_detail')"/>
                  </template>
                  <h5 class="text-center">{{$t('computer.plugins.resource_usage.disk_usage_detail')}}</h5>
                  <el-table :data="disk" size="mini" stripe=true style="width: 100%" class="table-borderless">
                    <el-table-column property="total" :label="$t('computer.plugins.resource_usage.total')+ ' (GB)'"></el-table-column>
                    <el-table-column property="used" :label="$t('computer.plugins.resource_usage.used')+ ' (GB)'"></el-table-column>
                    <el-table-column property="available" :label="$t('computer.plugins.resource_usage.available')+ ' (GB)'"></el-table-column>
                  </el-table>
                  <div style="margin-top:5px">
                    <small style="font-weight:bold;">{{$t('computer.plugins.resource_usage.disk_partition')}}:&nbsp;</small><small>{{ devices }}</small>
                  </div>
                </el-popover>
              </div>
            </div>
            <div class="p-col-6">
              <div>
                <Chart type="pie" :data="chartMemoryData" with="300" height="150" :options="memoryChartOptions"></Chart>
              </div>
              <div class="p-grid p-jc-center" style="margin-top:3px">
                <el-popover placement="bottom" :width="450" trigger="click">
                  <template #reference>
                    <Button icon="fas fa-info-circle" class="p-button-text" :label="$t('computer.plugins.resource_usage.view_detail')"/>
                  </template>
                  <h5 class="text-center">{{$t('computer.plugins.resource_usage.memory_usage_detail')}}</h5>
                  <el-table :data="memory" style="width: 100%" size="mini" stripe=true>
                    <el-table-column property="total" :label="$t('computer.plugins.resource_usage.total') + ' (GB)'"></el-table-column>
                    <el-table-column property="used" :label="$t('computer.plugins.resource_usage.used')+ ' (GB)'"></el-table-column>
                    <el-table-column property="available" :label="$t('computer.plugins.resource_usage.available')+ ' (GB)'"></el-table-column>
                  </el-table>
                </el-popover>
              </div>
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

export default {
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
      pluginUrl: "https://docs.liderahenk.org/lider-ahenk-docs/liderv2/computer_management/sistem/kaynak_kullanimi/"
    };
  },

  created() {
    this.task = {...this.pluginTask};
  },

  mounted() {
    this.renderChartDisk(50, 50);
    this.diskChartOptions = this.returnOptionForChart(this.diskTitle);
    this.renderMemoryDisk(50, 50);
    this.memoryChartOptions = this.returnOptionForChart(this.memoryTitle);
  },

  methods: {
    showConfirmDialogForTask(){
      this.task.commandId = "RESOURCE_INFO_FETCHER";
      this.task.parameterMap = {};
      this.showTaskDialog = true;
    },

    getResourceUsage() {
      this.showTaskDialog = false;
      this.devices = "/dev/sda,/dev/sdb"
      this.disk = [];
      var totalDisk = Math.ceil(525456/1000);
      var usedDisk = (213876/1000).toFixed(2);
      var availableDisk = (totalDisk - usedDisk).toFixed(2);

      this.disk.push({
        total: totalDisk,
        used: usedDisk,
        available : availableDisk
        }
      );
      this.memory = [];
      var totalMemory = Math.ceil(15567/1000);
      var usedMemory = (12987/1000).toFixed(2);
      var availableMemory = (totalMemory - usedMemory).toFixed(2);
      this.memory.push({
        total: totalMemory,
        used: usedMemory,
        available : availableMemory
        }
      );
      let usageMemoryRate = ((usedMemory / totalMemory)*100).toFixed(2);
      let availableMemoryRate = (100 - usageMemoryRate).toFixed(2);
      let usageDiskRate = ((usedDisk / totalDisk)*100).toFixed(2);
      let availableDiskRate = (100 - usageDiskRate).toFixed(2);

      this.renderChartDisk(availableDiskRate, usageDiskRate);
      this.renderMemoryDisk(availableMemoryRate, usageMemoryRate);
      // this.toast.success("Kaynak kullanımı bilgileri başarıyla alındı.");
      
    },

    renderChartDisk(availableMemoryRate, usageMemoryRate) {
      this.chartDiskData = {
        labels: this.labels,
        datasets: [
          {
            data: [availableMemoryRate, usageMemoryRate],
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
            data: [availableMemoryRate, usageMemoryRate],
            backgroundColor: ["#66BB6A","#20639B"],
            hoverBackgroundColor: ["#81C784", "#20639B"]
          }
        ]
      }
    },

    returnOptionForChart(title) {
      let options = {
        legend: {
          display: true,
          position: "chartArea",
          // align: "center",
          // onClick: function() {
          //   return false;
          // },
          labels: {
            boxWidth: 20,
            boxHeight: 20,
          },
       },
       title: {
          display: true,
          align: "center",
          text: title
        }
      }
      return options;
    }
  }
};
</script>

<style scoped>
</style>
