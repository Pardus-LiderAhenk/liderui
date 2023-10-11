import axios from 'axios';

const agentsSessionUrl="/api/lider/agent-session/list";
const agentSessionInfoExportUrl="/api/lider/agent-session/export";


class AgentSessionReportService {

    constructor(axios) {
        this.axios = axios
    }

    async agentSessionInfoList(params) {
        try {
            const response = await axios.post(agentsSessionUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }


    async agentSessionInfoExport(params) {
        try {
            const response = await axios.post(agentSessionInfoExportUrl, params, {responseType: 'blob'});
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}



export const agentSessionReportService = new AgentSessionReportService(axios);