import axios from 'axios';

const databaseInstallUrl="/database/install";


class DatabaseInstallationService {

    constructor(axios) {
        this.axios = axios
    }

    async installDatabase(params) {
        try {
            const response = await axios.post(databaseInstallUrl, params);
            const data = response.data
            return { data };
        } catch (error) {
            return { error: error }
        }
    }
}

export const databaseInstallationService = new DatabaseInstallationService(axios);