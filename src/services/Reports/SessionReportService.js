import axios from 'axios';
const userSessionList = "/api/lider/user/user-session"

class SessionReportService{

    constructor(axios) {
        this.axios = axios
    }

    async userSessionList(uid) {
        try {
            const response = await axios.post(userSessionList  + "/uid/" + uid);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }



}
export const sessionReportService = new SessionReportService(axios);