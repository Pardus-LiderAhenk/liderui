import axios from 'axios';

const basicInstallUrl="/basic/install";
const denemeUrl = "/installed/ansible";
const serverConnection = "/installed/check-connection";

class BasicInstallationService {

    constructor(axios) {
        this.axios = axios
    }

    async startInstallation(params) {
        try {
            const response = await axios.post(basicInstallUrl, params);
            const data = response.data
            return { data };
        } catch (error) {
            return { error: error }
        }
    }

    async denemeAnsible(params) {
        try {
            const response = await axios.post(denemeUrl, params);
            const data = response.data
            return { data };
        } catch (error) {
            return { error: error }
        }
    }

    async checkConnection(params) {
        try {
            const response = await axios.post(serverConnection, params);
            const data = response.data
            return { data };
        } catch (error) {
            return { error: error }
        }
    }
}

export const basicInstallationService = new BasicInstallationService(axios);