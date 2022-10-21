import axios from "axios";

const scriptListUrl  = '/api/script/list';
const scriptAddUrl = '/api/script/add';
const scriptDeleteUrl  = '/api/script/delete';
const scriptupdateUrl = '/api/script/update';

class ScriptService{

    constructor(axios){
        this.axios = axios
    }

    async scriptList(params) {
        try {
            const response = await axios.post(scriptListUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async scriptAdd(params) {
        try {
            const response = await axios.post(scriptAddUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async scriptDelete(params) {
        try {
            const response = await axios.post(scriptDeleteUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async scriptUpdate(params) {
        try {
            const response = await axios.put(scriptupdateUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}

export const scriptService = new ScriptService(axios);
