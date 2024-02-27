import axios from 'axios';

const scheduleTaskReportListUrl = "/api/lider/scheduled-task-report/list";
const scheduleTaskReportActiveListUrl = "/api/lider/scheduled-task-report/active-list";
const scheduleTaskReportPluginsUrl = "/api/lider/scheduled-task-report/plugins";
const scheduleTaskReportExportUrl = "/api/lider/scheduled-task-report/export";
const scheduleTaskReportUpdateUrl = "/api/lider/scheduled-task/update";
const scheduleTaskReportCancelUrl = "/api/lider/scheduled-task/cancel";



class ScheduledTaskREportService{

    constructor(axios){
        this.axios = axios
    }

    async scheduledTaskList(params) {
        try {
            const response = await axios.post(scheduleTaskReportListUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
    async scheduledActiveTaskList(params) {
        try {
            const response = await axios.post(scheduleTaskReportActiveListUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
    async scheduledTaskPlugins() {
        try {
            const response = await axios.get(scheduleTaskReportPluginsUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async scheduledTaskExport(params,responseType) {
        try {
            const response = await axios.post(scheduleTaskReportExportUrl, params,responseType);            
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async scheduledTaskUpdate(params) {
        try {
            const response = await axios.post(scheduleTaskReportUpdateUrl, params);            
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async scheduledTaskCancel(params) {
        try {
            const response = await axios.post(scheduleTaskReportCancelUrl, params);            
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
}
    export const scheduledTaskReportService = new ScheduledTaskREportService(axios);