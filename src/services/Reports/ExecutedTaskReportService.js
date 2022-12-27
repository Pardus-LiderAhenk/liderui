import axios from 'axios';

const executeTaskListUrl = "/api/lider/executed-task-report/list";
const executeTaskPluginstUrl = "/api/lider/executed-task-report/plugins";
const executeTaskExportUrl = "/api/lider/executed-task-report/export";


class ExecutedTaskReportService{

    constructor(axios){
        this.axios = axios
    }

    async executedTaskList(params) {
        try {
            const response = await axios.post(executeTaskListUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
    async executedTaskPlugins() {
        try {
            const response = await axios.get(executeTaskPluginstUrl);
            
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
    async executedTaskExport(params, responseType) {
        try {
            const response = await axios.post(executeTaskExportUrl, params,responseType);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}
    export const executedTaskReportService = new ExecutedTaskReportService(axios);