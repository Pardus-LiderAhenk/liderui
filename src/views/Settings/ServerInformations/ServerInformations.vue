<template>
<div class="dashboard p-fluid">
    <div class="p-grid p-field">

        <div class="p-field p-col-12 p-md-6 p-lg-3">
            <Dashboardbox :title="$t('Sunucu sayısı')" 
                :description="totalSentTaskNumber" 
                :icon="'pi pi-map'" 
                colorClass="blue"
                :descriptionFont="'bold'"
            />
        </div>
        <div class="p-field p-col-12 p-md-6 p-lg-3">
            <Dashboardbox :title="$t('Kullanıcı sayısı')" 
                :description="totalSentTaskNumber" 
                :icon="'pi pi-users'" 
                colorClass="orange"
                :descriptionFont="'bold'"
            />
        </div>
        <div class="p-field p-col-12 p-md-6 p-lg-3">
            <Dashboardbox :title="$t('Çalışma süresi(uptime)')" 
                :description="totalSentTaskNumber" 
                :icon="'pi pi-directions'" 
                colorClass="darkgray"
                :descriptionFont="'bold'"
            />
        </div>
    <div>
        <Button
            icon="fa fa-plus"
            :class="selectedPluginTab == 'task-history' ? 'p-button-raised p-button-sm p-mr-2 p-mb-2':'p-button-text p-button-sm p-mr-2 p-mb-2'"
            @click="addServerModalVisible = true"
            :label="$t('Sunucu ekle')"
        >
        </Button>
    </div>
    <!-- <div class="p-chart" id="nasdaq-chart">
        <canvas width="482" height="241" style="box-sizing: border-box; display: block; height: 241px; width: 482px;"/>
    </div> -->

</div>
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

        <DataTable :value="serverList" showGridlines tableStyle="min-width: 50rem">
            <Column field="id" header="Id"></Column>
            <Column field="ip" header="Ip"></Column>
            <Column field="hostname" header="Hostname"></Column>
            <Column field="users" header="Kullanıcı"></Column>
            <Column field="password" header="Parola"></Column>
        </DataTable>
    </div>

</div>

    <!-- <div class="p-col-12 p-d-flex p-jc-end ">
        <Button :label="$t('yeni sunucu ekle')"  class="p-mr-2" 
            @click="addServerModalVisible = true"
        />
    </div> -->
    

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

import Dashboardbox from "@/components/Dashboardbox/Dashboardbox.vue";
import axios from "axios";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AddServerDialog from './Dialogs/AddServerDialog.vue';
import Card from "primevue/card";


export default {
    setup() {
    const plugins = [ChartDataLabels]
      // expose to template and other options API hooks
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
        Dashboardbox,
        AddServerDialog,
     
    },
    
    mounted() {
        this.renderCharts();
        this.getConsoleUsers();

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
        },

        async getConsoleUsers(){
            const { response, error } = await consoleUserSettingsService.getConsoleUsers();
                if (error){
                    this.$toast.add({
                        severity:'error', 
                        detail: this.$t('settings.console_user_settings.an_unexpected_problem_was_encountered'),
                        summary: this.$t('settings.console_user_settings.error'),
                        life: 3000
                    });
                }
                else{
                    if(response.status == 200){
                        this.records = response.data;
                    }
                    else if(response.status == 417){
                        this.$toast.add({
                            severity:'error', 
                            detail: this.$t('settings.console_user_settings.error_417_get_console_user'),
                            summary: this.$t('settings.console_user_settings.error'),
                            life: 3000
                        });
                    }
                }               
        },
    }

}
</script>

<style lang="scss" scoped>
.dashboard {
    background-color: #e7f2f8;
    min-height:93vh;
}

.card {
    background: #ffffff;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 0px 10px 40px rgba(41, 50, 65, 0.06);
}
</style>
