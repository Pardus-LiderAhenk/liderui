import axios from 'axios';

const rdpListClients = "/api/rdp-client/list"
const rdpSaveClient = "/api/rdp-client/save"
const rdpUpdateClient = "/api/rdp-client/update"
const rdpDeleteClient = "/api/rdp-client/delete"

class RemoteAccessService {

    constructor(axios) {
        this.axios = axios
    }

    async listClients(params) {
        try {
            const response = await axios.get(rdpListClients, { params });
            return { response };
        } catch (error) {
            return { error: error };
        }
    }

    async saveClient(params) {
        try {
            const response = await axios.post(rdpSaveClient, params);
            return { response };
        }
        catch (error) {
            return { error: error }
        }
    }

    async updateClient(params) {
        try {
            const response = await axios.patch(rdpUpdateClient, params);
            return { response };
        }
        catch (error) {
            return { error: error }
        }
    }

    async deleteClient(id) {
        try {
            const response = await axios.delete(rdpDeleteClient + '/' + id);
            return { response };
        }
        catch (error) {
            return { error: error }
        }
    }

}

export const remoteAccessService = new RemoteAccessService(axios)