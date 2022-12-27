import axios from 'axios';

const liderComputerGroupsAgentReportExistingUrl = '/api/lider/computer-groups/agent-report/existing/group';
const liderComputerGroupsAgentReportCreateGroupUrl = '/api/lider/computer-groups/agent-report/create-agent-group';
const liderComputerGroupsDeleteEntryUrl =  '/api/lider/computer-groups/delete-entry';
const liderComputerGroupsGroupExistingUrl =  '/api/lider/computer-groups/group/existing';
const liderComputerGroupsAgentReportCreateNewGroupUrl = '/api/lider/computer-groups/create-new-agent-group';
const liderComputerGroupsMoveEntryUrl = '/api/lider/computer-groups/move/entry';
const liderComputerGroupsAddOuUrl = '/api/lider/computer-groups/add-ou';
const liderComputerGroupsRenameEntryUrl = '/api/lider/computer-groups/rename/entry';
const liderComputerGroupsAddMemberUrl = '/api/lider/computer-groups/group/members';
const liderComputerGroupsDeleteMemberUrl = '/api/lider/computer-groups/group/members';

class ComputerGroupsManagementService{

    constructor(axios) {
        this.axios = axios
    }

    async addAgentToExistingGroupWithAgentReport(params) {
        try {
            const response = await axios.post(liderComputerGroupsAgentReportExistingUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async createAgentGroup(data) {
        try {
            const response = await axios.post(liderComputerGroupsAgentReportCreateGroupUrl, data);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deleteEntry(dn) {
        try {
            const response = await axios.delete(liderComputerGroupsDeleteEntryUrl + "/dn/" + dn);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async groupExisting(params) {
        try {
            const response = await axios.post(liderComputerGroupsGroupExistingUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async createNewGroup(params) {
        try {
            const response = await axios.post(liderComputerGroupsAgentReportCreateNewGroupUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async moveEntry(params) {
        try {
            const response = await axios.post(liderComputerGroupsMoveEntryUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addOu(params) {
        try {
            const response = await axios.post(liderComputerGroupsAddOuUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async renameEntry(params) {
        try {
            const response = await axios.post(liderComputerGroupsRenameEntryUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addMember(params) {
        try {
            const response = await axios.post(liderComputerGroupsAddMemberUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deleteMember(params) {
        try {
            const response = await axios.put(liderComputerGroupsDeleteMemberUrl ,params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}
export const computerGroupsManagementService = new ComputerGroupsManagementService(axios);