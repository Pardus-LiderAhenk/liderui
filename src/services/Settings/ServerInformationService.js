import axios from "axios";

const liderSettingsAddServerUrl = '/api/server/add';
const liderSettingsConnectionServerUrl = '/api/server/check-connection';
const liderSettingsDeleteServerUrl = '';
const liderSettingsGetServerDataUrl = '/api/server-information/execute-command';
const liderSettingsServerUpdateUrl = '';
const liderSettingsServerListUrl = '';


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

    async deleteServer(params){
        try {
            const response = await axios.post(liderSettingsDeleteServerUrl, params);
            console.log(response.data)
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getServerServer(params){
        try {
            const response = await axios.post(liderSettingsGetServerDataUrl, params);
            console.log(response.data)
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async update(params){
        try {
            const response = await axios.post(liderSettingsServerUpdateUrl, params);
            console.log(response.data)
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async list(params){
        try {
            const response = await axios.get(liderSettingsServerListUrl, params);
            console.log(response.data)
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}

export const serverInformationService = new ServerInformationService(axios);