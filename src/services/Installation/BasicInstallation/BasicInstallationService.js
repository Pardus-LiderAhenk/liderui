import axios from 'axios';

const basicInstallUrl="/basic/install";


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
}

export const basicInstallationService = new BasicInstallationService(axios);