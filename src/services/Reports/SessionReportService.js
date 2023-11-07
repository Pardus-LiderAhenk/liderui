import axios from 'axios';
const userSessionListUrl = "/api/lider/user-session/list";
const userSessionReportUrl = "/api/lider/user-session/export"


class SessionReportService{

    constructor(axios) {
        this.axios = axios
    }

    async userSessionList(params) {
        try {
            const response = await axios.post(userSessionListUrl , params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async userSessionReportExport(params) {
        try {
            const response = await axios.post(userSessionReportUrl, params, {responseType: 'blob'});
            return { response };
        } catch (error) {
            return { error: error }
        }
    }



}
export const sessionReportService = new SessionReportService(axios);