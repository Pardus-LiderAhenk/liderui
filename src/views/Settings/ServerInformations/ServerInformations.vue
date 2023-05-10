<template>

    <div class="card overview-box" :class="colorClass">
        <div class="overview-info">
          <h6>{{title}}</h6>
          <h1 class="desClass">{{description}}</h1>
        </div>
        <i :class="icon" ></i>
    </div>

    <div class="p-field p-col-12 p-md-6 p-lg-3">
        <Dashboardbox :title="$t('dashboard_screen.total_number_of_sent_task')" 
            :description="totalSentTaskNumber" 
            :icon="'pi pi-send'" 
            colorClass="orange"
            :descriptionFont="'bold'"
        />
    </div>
</template>
<script>
/**
 * Dashboard page
 * @see {@link http://www.liderahenk.org/}
 */

import Dashboardbox from "@/components/Dashboardbox/Dashboardbox.vue";
import axios from "axios";
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
    setup() {
    const plugins = [ChartDataLabels]
      // expose to template and other options API hooks
      return {
        plugins
      }
    },
    data() {
        return {
            
        }
    },
    
    components: {
        Dashboardbox,
     
    },
    
    mounted() {
        this.renderCharts();
    },

    methods: {
        async renderCharts() {
            const data = await this.getDashboardData();
            this.renderAgentStatusChart();
            this.renderAgentLineChart(data.dateRanges, data.dateRangeValuesAgent);
        },

        getDashboardData() {
            return new Promise((resolve, reject)=> {
                let params = new FormData();
                params.append("userDn", "dashboard");
                axios.post("/api/dashboard/info", params).then((response) => {
                    if (response.data) {
                        this.totalClientNumber = response.data.totalComputerNumber;
                        this.totalUserNumber = response.data.totalUserNumber;
                        this.totalSentTaskNumber = response.data.totalSentTaskNumber;
                        this.totalAssignedPolicyNumber = response.data.totalAssignedPolicyNumber;
                        this.totalOnlineComputerNumber = response.data.totalOnlineComputerNumber;
                        this.totalRegisteredComputerTodayNumber = response.data.totalRegisteredComputerTodayNumber;
                        this.totalSessionsTodayNumber = response.data.totalSessionsTodayNumber;
                        this.lastActivityData = response.data.liderConsoleLastActivity;
                        this.userTasks = response.data.userTasks;
                        resolve(response.data);
                    }
                });
            });
        },

        renderAgentStatusChart() {
            let offlineComputerNumber = 0;
            let onlineRate = 50;
            let offlineRate = 50;
            if (this.totalClientNumber > 0) {
                offlineComputerNumber = this.totalClientNumber - this.totalOnlineComputerNumber;
                onlineRate = ((this.totalOnlineComputerNumber / this.totalClientNumber)*100).toFixed(2);
                offlineRate = (100 - onlineRate).toFixed(2);
            }
            this.agentData = {
                labels: [this.$t('dashboard_screen.online')+ "(" + this.totalOnlineComputerNumber +")", this.$t('dashboard_screen.offline') + "("+ offlineComputerNumber +")"],
                datasets: [
                    {
                        data: [onlineRate, offlineRate],
                        backgroundColor: ["#66BB6A","#D32F2F"],
                        hoverBackgroundColor: ["#66BB6A","#D32F2F"],
                    }
                ]
            }
        },

        renderAgentLineChart(dateRanges, dateRangeValuesAgent) {
            this.agentLineData = {
                labels: dateRanges,
                datasets: [
                    {   
                        label: this.$t('dashboard_screen.registered_clients'),
                        data: dateRangeValuesAgent,
                        fill: true,
                        borderColor: '#42A5F5',
                        tension: .4,
                    },
                ]
            }
        },

        getNowDate() {
            let date = new Date();
            let month = date.toLocaleString(this.$i18n.locale, { month: 'long' });
            return date.getDate() +' '+month;
        }
    }

}
</script>

<style lang="scss" scoped>
.dashboard {
    background-color: #e7f2f8;
    min-height:93vh;
}
</style>
