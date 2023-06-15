import axios from "axios";

const liderSettingsAddServerUrl = '/api/server/add';
const liderSettingsConnectionServerUrl = '/api/server/check-connection';


class ServerInformationService{

    constructor(axios){
        this.axios = axios;
    }

    async addServer(params) {
        try {
            const response = await axios.post(liderSettingsAddServerUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async connectionServer(params){
        try {
            const response = await axios.post(liderSettingsConnectionServerUrl, params);
            console.log(response.data)
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}

export const serverInformationService = new ServerInformationService(axios);