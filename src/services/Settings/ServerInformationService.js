import axios from "axios";
const liderSettingsAddServerUrl = '';

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


}

export const serverInformationService = new ServerInformationService(axios);