import axios from 'axios';

const agentSessionUrl="/api/lider/agent-session/list";
const agentSessionDetailUrl="/api/lider/agent-session/detail";
const agentSessionInfoExportUrl="/api/lider/agent-session/export";


class AgentSessionReportService {

    constructor(axios) {
        this.axios = axios
    }

    async agentSessionInfoList(params) {
        try {
            const response = await axios.post(agentSessionUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async agentSessionDetailList(params) {
        try {
            const response = await axios.post(agentSessionDetailUrl ,params);
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