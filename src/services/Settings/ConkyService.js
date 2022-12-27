import axios from "axios";

const conkyListUrl  = '/api/conky/list';
const conkyListAllUrl  = '/api/conky/list-all';
const conkyAddUrl = '/api/conky/add';
const conkyDeleteUrl  = '/api/conky/delete';
const conkyUpdateUrl = '/api/conky/update';

class ConkyService{

    constructor(axios){
        this.axios = axios
    }

    async conkyList(pageSize, pageNumber) {
        try {
            const response = await axios.get(conkyListUrl + "/page-size/" + pageSize + "/page-number/" + pageNumber);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async conkyListAll(params) {
        try {
            const response = await axios.get(conkyListAllUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async conkyAdd(params) {
        try {
            const response = await axios.post(conkyAddUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async conkyDelete(id) {
        try {
            const response = await axios.delete(conkyDeleteUrl + "/id/" + id);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async conkyUpdate(params) {
        try {
            const response = await axios.post(conkyUpdateUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}

export const conkyService = new ConkyService(axios);
