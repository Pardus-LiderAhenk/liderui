<template>
<div class="dashboard p-fluid">
    <div class="p-grid p-field">

        <div class="p-field p-col-12 p-md-6 p-lg-3">
            <Dashboardbox :title="$t('dashboard_screen.total_number_of_sent_task')" 
                :description="totalSentTaskNumber" 
                :icon="'pi pi-users'" 
                colorClass="blue"
                :descriptionFont="'bold'"
            />
        </div>
        <div class="p-field p-col-12 p-md-6 p-lg-3">
            <Dashboardbox :title="$t('dashboard_screen.total_number_of_sent_task')" 
                :description="totalSentTaskNumber" 
                :icon="'pi pi-map'" 
                colorClass="orange"
                :descriptionFont="'bold'"
            />
        </div>
        <div class="p-field p-col-12 p-md-6 p-lg-3">
            <Dashboardbox :title="$t('dashboard_screen.total_number_of_sent_task')" 
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
            @click="setSelectedPluginTab('task-history')"
            :label="$t('Sunucu ekle')"
        >
        </Button>
    </div>
    <div class="p-chart" id="nasdaq-chart">
        <canvas width="482" height="241" style="box-sizing: border-box; display: block; height: 241px; width: 482px;"/>
    </div>
    <div class="col-12 md:col-6 xl:col-3">

    </div>
    <Card>
        <template #title> Simple Card </template>
        <template #content>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                quas!
            </p>
        </template>
    </Card>

    <div class="p-col-12 p-d-flex p-jc-end ">
        <Button :label="$t('yeni sunucu ekle')"  class="p-mr-2" 
            @click="addServerModalVisible = true"
        />
        <!-- <Button :label="$t('settings.console_user_settings.delete_users_console_authority')" 
            @click="showDeleteConsoleUserDialog = true"
        /> -->
    </div>
    
    </div>

</div>

<add-server-dialog
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

export default {
    setup() {
    const plugins = [ChartDataLabels]
      // expose to template and other options API hooks
      return {
        plugins,
        addServerModalVisible :false,
      }
    },
    data() {
        return {
            
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
</style>
