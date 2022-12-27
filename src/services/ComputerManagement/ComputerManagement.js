import axios from 'axios';

const liderComputerGetComputersUrl = "/api/lider/computer/computers";
const liderComputerOuDetailsUrl = "/api/lider/computer/ou-details";
const liderComputerOuUrl ="/api/lider/computer/ou";
const liderComputerSearchEntryUrl = "/api/lider/computer/search-entry";
const liderComputerOnlineAhenksUrl = "/api/lider/computer/online-ahenks";
const liderComputerCreateNewAgentUrl = "/api/lider/computer/create-new-agent-group";
const liderComputerGroupExistingUrl = "/api/lider/computer/group/existing";
const liderComputerSearchOnlineEntriesUrl = "/api/lider/computer/search-online-entries";
const liderComputerAgentListSizeUrl = "/api/lider/computer/agent-list-size";
const liderComputerMoveAgentUrl = "/api/lider/computer/move/agent";
const liderComputerDeleteAgentUrl = "/api/lider/computer/delete/agent";
const liderComputerRenameAgentUrl = "/api/lider/computer/rename/agent";
const liderComputerDeleteComputerOuUrl = "/api/lider/computer/delete-computer-ou";
const liderComputerGetAgentInfoUrl = "/api/lider/computer/get-agent-info";
const liderComputerUpdateAgentInfoUrl = "/api/lider/computer/update-agent-info";
const liderComputerAddOuUrl = "/api/lider/computer/add-ou";


class ComputerManagemetService{

	constructor(axios) {
        this.axios = axios
    }

	async getComputers(params) {
        try {
            const response = await axios.post(liderComputerGetComputersUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async getOuDetails(params) {
        try {
            const response = await axios.post(liderComputerOuDetailsUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async getOu() {
        try {
            const response = await axios.get(liderComputerOuUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async searchEntry(params) {
        try {
            const response = await axios.post(liderComputerSearchEntryUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async onlineAhenks(params) {
        try {
            const response = await axios.post(liderComputerOnlineAhenksUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async createAgentGroup(params) {
        try {
            const response = await axios.post(liderComputerCreateNewAgentUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async groupExist(params) {
        try {
            const response = await axios.post(liderComputerGroupExistingUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async searchOnlineEntries(params) {
        try {
            const response = await axios.post(liderComputerSearchOnlineEntriesUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async computerAgentListSize(params) {
        try {
            const response = await axios.post(liderComputerAgentListSizeUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async moveEntry(params) {
        try {
            const response = await axios.post(liderComputerMoveAgentUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async deleteAgent(params) {
        try {
            const response = await axios.post(liderComputerDeleteAgentUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async renameAgent(params) {
        try {
            const response = await axios.post(liderComputerRenameAgentUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async deleteComputerOu(params) {
        try {
            const response = await axios.post(liderComputerDeleteComputerOuUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async getAgentInfo(params) {
        try {
            const response = await axios.post(liderComputerGetAgentInfoUrl,params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

	async updateAgentInfo(params) {
        try {
            const response = await axios.post(liderComputerUpdateAgentInfoUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }


	async addOu(params) {
        try {
            const response = await axios.post(liderComputerAddOuUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}
export const computerManagementService = new ComputerManagemetService(axios); 



