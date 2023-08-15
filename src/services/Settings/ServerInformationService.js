import axios from "axios";

const liderSettingsAddServerUrl = '/api/server/add';
const liderSettingsConnectionServerUrl = '/api/server/check-connection';
const liderSettingsDeleteServerUrl = '/api/server/delete';
const liderSettingsGetServerDataUrl = '/api/server-information/execute-command';
const liderSettingsServerUpdateUrl = '/api/server/update';
const liderSettingsServerListUrl = '/api/server/list';
const liderSettingServerDetailUrl = '/api/server/detail';
const liderSettingServerGetDataUrl = '/api/server/get-data';



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
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deleteServer(id){
        try {
            const response = await axios.delete(liderSettingsDeleteServerUrl  + "/id/" + id);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getServer(params){
        try {
            const response = await axios.post(liderSettingsGetServerDataUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async list(params){
        try {
            const response = await axios.get(liderSettingsServerListUrl, params);    
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getServerDetails(id){
        try {
            const response = await axios.post(liderSettingServerDetailUrl  + "/id/" + id);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
    
    async update(params){
        try{
            const response =  await axios.post(liderSettingsServerUpdateUrl, params);
            return { response };
        }catch(error){
            return { error: error }
        }
    }

    async getData(params){
        try{
            const response =  await axios.get(liderSettingServerGetDataUrl, params);
            return { response };
        }catch(error){
            return { error: error }
        }
    }

}

export const serverInformationService = new ServerInformationService(axios);