<template>
    <div class="dashboard p-fluid">
        <div class="p-grid p-field">
            <div class="p-field p-col-12 p-md-6 p-lg-3">
                <Dashboardbox title="Total Client Number" 
                    :description="totalClientNumber" 
                    colorClass="darkgray"
                    :icon="'pi pi-desktop'"
                    :descriptionFont="'bold'"
                />
            </div>
            <div class="p-field p-col-12 p-md-6 p-lg-3">
                <Dashboardbox title="Total User Number" 
                    :description="totalUserNumber"
                    :icon="'pi pi-users'" colorClass="blue"
                    :descriptionFont="'bold'"
                />
            </div>
            <div class="p-field p-col-12 p-md-6 p-lg-3">
                <Dashboardbox title="Total Sended Task Number" 
                    :description="totalSentTaskNumber" 
                    :icon="'pi pi-send'" 
                    colorClass="orange"
                    :descriptionFont="'bold'"
                />
            </div>
            <div class="p-field p-col-12 p-md-6 p-lg-3">
                <Dashboardbox title="Total Assigned Policy Number"
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
                        <span style="margin: 0 0 2px; font-size:1.2rem">İstemciler</span>
                    </template>
                    <template #content>
                        <Chart 
                            type="pie" 
                            :width="400" :height="250"
                            :data="agentData" 
                            :options="options">
                        </Chart>
                    </template>
                </Card>
                <Card class="p-field">
                <template #title>
                    <div class="p-d-flex p-jc-between" style="margin: 0 0 2px; font-size:1.2rem;">
                        <span >İstatistik</span>
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
                                <h6 style="color: #29324180">Bugün kayıt olan istemci</h6>
                            </div>
                        </div>
                        <div class="p-col-12 p-md-6 p-lg-6">
                            <h5 style="font-size:1.25rem; font-weight:bold"><i class="pi pi-users" style="color: #689F38"></i> 
                                {{totalSessionsTodayNumber}}
                            </h5>
                            <div>
                                <h6 style="color: #29324180">Bugün oturum açan kullanıcı</h6>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
            </div>
            <div class="p-col-12 p-md-6 p-lg-9">
                <Card>
                    <template #title>
                        <span style="margin: 0 0 2px; font-size:1.2rem">Son 2 Yıla Ait İstemci Grafiği</span>
                    </template>
                    <template #content>
                        <Chart type="line" :data="agentLineData"  :width="350" :height="100"/>
                    </template>
                </Card>
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

export default {
    data() {
        return {
            totalClientNumber: 0,
            totalUserNumber: 0,
            totalSentTaskNumber: 0,
            totalAssignedPolicyNumber: 0,
            totalOnlineComputerNumber: 0,
            totalRegisteredComputerTodayNumber: 0,
            totalSessionsTodayNumber: 0,
            taskData: null,
            agentData: null,
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
                        display: true,
                        align: "center",
                        text: "İstemciler(%)"
                    },
                },
            maintainAspectRatio: false
            },

            agentLineData: null,
        }
    },
    
    components: {
        Dashboardbox
    },
    mounted() {
        // this.getPlugins();
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
                params.append("innerPage", "dashboard");
                axios.post("/dashboard/info", params).then((response) => {
                    if (response.data) {
                        this.totalClientNumber = response.data.totalComputerNumber;
                        this.totalUserNumber = response.data.totalUserNumber;
                        this.totalSentTaskNumber = response.data.totalSentTaskNumber;
                        this.totalAssignedPolicyNumber = response.data.totalAssignedPolicyNumber;
                        this.totalOnlineComputerNumber = response.data.totalOnlineComputerNumber;
                        this.totalRegisteredComputerTodayNumber = response.data.totalRegisteredComputerTodayNumber;
                        this.totalSessionsTodayNumber = response.data.totalSessionsTodayNumber;
                        resolve(response.data);
                    }
                });
            });
        },

        renderTaskChart() {
            this.taskData = {
                labels: this.labels,
                datasets: [
                {
                    data: [50, 50, 50, 50, 50],
                    backgroundColor: ["#42A5F5","#66BB6A","#FFA726"],
                    hoverBackgroundColor: ["#64B5F6","#81C784","#FFB74D"]
                }
                ]
            }
        },

        renderAgentStatusChart() {
            let offlineComputerNumber = this.totalClientNumber - this.totalOnlineComputerNumber;
            let onlineRate = ((this.totalOnlineComputerNumber / this.totalClientNumber)*100).toFixed(2);
            let offlineRate = (100 - onlineRate).toFixed(2);
            this.agentData = {
                labels: ["Çevrimiçi("+ this.totalOnlineComputerNumber +")", "Çevrimdışı("+ offlineComputerNumber +")"],
                datasets: [
                    {
                        data: [onlineRate, offlineRate],
                        backgroundColor: ["#689F38","#D32F2F"],
                        hoverBackgroundColor: ["#689F38","#D32F2F"],
                    }
                ]
            }
        },

        renderAgentLineChart(dateRanges, dateRangeValuesAgent) {
            this.agentLineData = {
                labels: dateRanges,
                datasets: [
                    {   
                        label: 'Kayıtlı İstemciler',
                        data: dateRangeValuesAgent,
                        fill: true,
                        borderColor: '#42A5F5',
                        tension: .4,
                    },
                ]
            }
        },

        getPlugins(){
            axios.post("/dashboard/getPluginList", {}).then((response) => {
                response.data.forEach(element => {
                    this.labels.push(element.description)
                });
                return response.data;
            });
        },

        getNowDate() {
            let date = new Date();
            let month = date.toLocaleString('tr', { month: 'long' });
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
