import axios from 'axios';
const userSessionList = "/api/lider/user-session/list"

class SessionReportService{

    constructor(axios) {
        this.axios = axios
    }

    async userSessionList(params) {
        try {
            const response = await axios.post(userSessionList , params);
            console.log(response);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }



}
export const sessionReportService = new SessionReportService(axios);