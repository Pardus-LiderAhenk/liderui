import axios from "axios";

const profileListUrl = '/api/profile/list';
const profileAddUrl = '/api/profile/add';
const profileDeleteUrl = '/api/profile/delete';
const profileUpdateUrl = '/api/profile/update';
const profileAllListUrl = '/api/profile/all-list';

class ProfilesService {

    constructor(axios){
        this.axios = axios
    }

    async list(params) {
        try {
            const response = await axios.post(profileListUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async add(params) {
        try {
            const response = await axios.post(profileAddUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async delete(id) {
        try {
            const response = await axios.delete(profileDeleteUrl + "/id/" + id);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async update(params) {
        try {
            const response = await axios.post(profileUpdateUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async allList() {
        try {
            const response = await axios.get(profileAllListUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
}

export const profilesServices = new ProfilesService(axios);
