import axios from 'axios';

const agentsUrl="/api/lider/agent-info/list";
const agentInfoExportUrl="/api/lider/agent-info/export";


class AgentInfoReportService {

    constructor(axios) {
        this.axios = axios
    }

    async agentInfoList(params) {
        try {
            const response = await axios.post(agentsUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }


    async agentInfoExport(params) {
        try {
            const response = await axios.post(agentInfoExportUrl, params, {responseType: 'blob'});
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}



export const agentInfoReportService = new AgentInfoReportService(axios);