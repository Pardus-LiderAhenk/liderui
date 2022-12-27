<template>
    <div class="dashboard p-fluid">
        <div class="p-grid p-field">
            <div class="p-field p-col-12 p-md-6 p-lg-3">
                <Dashboardbox :title="$t('dashboard_screen.total_number_of_client')" 
                    :description="totalClientNumber" 
                    colorClass="darkgray"
                    :icon="'pi pi-desktop'"
                    :descriptionFont="'bold'"
                />
            </div>
            <div class="p-field p-col-12 p-md-6 p-lg-3">
                <Dashboardbox :title="$t('dashboard_screen.total_number_of_user')" 
                    :description="totalUserNumber"
                    :icon="'pi pi-users'" colorClass="blue"
                    :descriptionFont="'bold'"
                />
            </div>
            <div class="p-field p-col-12 p-md-6 p-lg-3">
                <Dashboardbox :title="$t('dashboard_screen.total_number_of_sent_task')" 
                    :description="totalSentTaskNumber" 
                    :icon="'pi pi-send'" 
                    colorClass="orange"
                    :descriptionFont="'bold'"
                />
            </div>
            <div class="p-field p-col-12 p-md-6 p-lg-3">
                <Dashboardbox :title="$t('dashboard_screen.total_number_of_assigned_policies')"
                    :description="totalAssignedPolicyNumber" 
                    colorClass="green"
                    :descriptionFont="'bold'"
                />
            </div>
        </div>
        <div class="p-grid p-field">
            <div class="p-col-12 p-md-6 p-lg-3">
                <Card class="p-field">
                    <template #title>
                        <span style="margin: 0 0 2px; font-size:1.2rem">{{$t('dashboard_screen.clients')}}</span>
                    </template>
                    <template #subtitle>
                        <span style="margin: 0 0 2px; font-size:1rem">{{$t('dashboard_screen.online_offline_rate')}}</span>
                    </template>
                    <template #content>
                        <Chart 
                            type="pie" 
                            :width="400" :height="250"
                            :data="agentData" 
                            :options="options"
                            :plugins="plugins">
                        </Chart>
                    </template>
                </Card>
                <Card class="p-field">
                <template #title>
                    <div class="p-d-flex p-jc-between" style="margin: 0 0 2px; font-size:1.2rem;">
                        <span >{{$t('dashboard_screen.statistics')}}</span>
                        <span><i class="pi pi-calendar"></i> {{getNowDate()}}</span>
                    </div>
                </template>
                <template #content>
                    <div class="p-grid">
                        <div class="p-col-12 p-md-6 p-lg-6">
                            <h5 style="font-size:1.25rem; font-weight:bold"><i class="fab fa-linux" style="color: #689F38; font-size:1rem;"></i> 
                                {{totalRegisteredComputerTodayNumber}}
                            </h5>
                            <div>
                                <h6 style="color: #29324180">{{$t('dashboard_screen.client_registered_today')}}</h6>
                            </div>
                        </div>
                        <div class="p-col-12 p-md-6 p-lg-6">
                            <h5 style="font-size:1.25rem; font-weight:bold"><i class="pi pi-users" style="color: #689F38"></i> 
                                {{totalSessionsTodayNumber}}
                            </h5>
                            <div>
                                <h6 style="color: #29324180">{{$t('dashboard_screen.user_logged_in_today')}}</h6>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
            </div>
            <div class="p-col-12 p-md-6 p-lg-9">
                <Card>
                    <template #title>
                        <span style="margin: 0 0 2px; font-size:1.2rem">{{$t('dashboard_screen.line_chart_title')}}</span>
                    </template>
                    <template #subtitle>
                        <span style="margin: 0 0 2px; font-size:1rem">{{$t('dashboard_screen.client_graph_for_the_last_2_years')}}</span>
                    </template>
                    <template #content>
                        <Chart type="line" :data="agentLineData"  :width="340" :height="100"/>
                    </template>
                </Card>
            </div>
        </div>
        <div class="p-field p-grid">
            <div class="p-field p-col-12 p-md-6 p-lg-5">
                <last-activity :lastActivityData="lastActivityData"></last-activity>
            </div>
            <div class="p-field p-col-12 p-md-6 p-lg-7">
                <task-activity :userTasks="userTasks"></task-activity>
            </div>
        </div>
        

    </div>
</template>

<script>
/**
 * Dashboard page
 * @see {@link http://www.liderahenk.org/}
 */

import Dashboardbox from "@/components/Dashboardbox/Dashboardbox.vue";
import axios from "axios";
import LastActivity from "./LastActivity.vue"
import TaskActivity from "./TaskActivity.vue"
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
            totalClientNumber: 0,
            totalUserNumber: 0,
            totalSentTaskNumber: 0,
            totalAssignedPolicyNumber: 0,
            totalOnlineComputerNumber: 0,
            totalRegisteredComputerTodayNumber: 0,
            totalSessionsTodayNumber: 0,
            lastActivityData: null,
            agentData: null,
            userTasks: [],
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                        align: "center",
                        labels: {
                          boxWidth: 20,
                          boxHeight: 10,
                        },
                    },
                    title: {
                        display: false,
                        align: "center",
                        text: this.$t('dashboard_screen.clients')
                    },
                    datalabels: {
                    formatter: function(value) {
                        return '% ' + value;
                    },
                    color: 'white',
                    labels: {
                        title: {
                          font: {
                            weight: '',
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
            },
            agentLineData: null,
        }
    },
    
    components: {
        Dashboardbox,
        LastActivity,
        TaskActivity
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
