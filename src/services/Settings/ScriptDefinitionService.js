import axios from "axios";

const scriptListUrl  = '/api/script/list';
const scriptListAllUrl  = '/api/script/list-all';
const scriptAddUrl = '/api/script/add';
const scriptDeleteUrl  = '/api/script/delete';
const scriptUpdateUrl = '/api/script/update';

class ScriptService{

    constructor(axios){
        this.axios = axios
    }

    async scriptList(pageSize,pageNumber) {
        try {
            const response = await axios.get(scriptListUrl + "/page-size/" + pageSize + "/page-number/" + pageNumber);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async scriptListAll() {
        try {
            const response = await axios.get(scriptListAllUrl);
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

    async scriptDelete(id) {
        try {
            const response = await axios.delete(scriptDeleteUrl + "/id/" + id);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async scriptUpdate(params) {
        try {
            const response = await axios.put(scriptUpdateUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}

export const scriptService = new ScriptService(axios);
