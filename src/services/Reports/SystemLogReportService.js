import axios from 'axios';

const operationLogsUrl = "api/operation/logs";
const operationExportUrl = "api/operation/export";
const operationTypesUrl = "api/operation/types";



class SystemTaskReportService {

    constructor(axios){
        this.axios = axios
    }

    async operationLogsList(params){
        try {
            const response = await axios.post(operationLogsUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }

    }

    async operationExport(params){
        try {
            const response = await axios.post(operationExportUrl, params, {responseType: 'blob'});
            return { response };
        } catch (error) {
            return { error: error }
        }

    }

    async operationTypes(){
        try {
            const response = await axios.get(operationTypesUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }

    }



}

export const systemTaskReportService = new SystemTaskReportService(axios)
