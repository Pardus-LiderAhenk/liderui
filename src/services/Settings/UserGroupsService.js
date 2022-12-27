import axios from "axios";

const userGroupsExistingrUrl = '/api/lider/user-groups/group/existing';
const userGroupsNewGroupUrl = '/api/lider/user-groups/create-new-group';
const userGroupsExistingAddUserUrl = '/api/lider/user-groups/group/existing/add-user';
const userGroupsAddOuUrl = '/api/lider/user-groups/add-ou';
const userGroupsRenameEntryUrl = '/api/lider/user-groups/rename/entry';
const userGroupsMoveEntryUrl = '/api/lider/user-groups/move/entry';
const userGroupsDeleteEntryUserUrl = '/api/lider/user-groups/delete-entry';
const userGroupsDeleteGroupMemberUrl = '/api/lider/user-groups/delete/group/members';
const updateDomainAdminUrl = '/api/lider/user-groups/domain-admin';


class UserGroupsService {

    constructor(axios) {
        this.axios = axios
    }


    async addGroups(params) {
        try {
            const response = await axios.post(userGroupsExistingrUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async createNewGroup(params) {
        try {
            const response = await axios.post(userGroupsNewGroupUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addUser(params) {
        try {
            const response = await axios.post(userGroupsExistingAddUserUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addOu(params) {
        try {
            const response = await axios.post(userGroupsAddOuUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async renameEntry(params) {
        try {
            const response = await axios.post(userGroupsRenameEntryUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async moveEntry(params) {
        try {
            const response = await axios.post(userGroupsMoveEntryUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deleteEntry(dn) {
        try {
            const response = await axios.delete(userGroupsDeleteEntryUserUrl + "/dn/" + dn );
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deleteGroupMember(params) {
        try {
            const response = await axios.put(userGroupsDeleteGroupMemberUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async updateDomainAdmin(params) {
        try {
            const response = await axios.post(updateDomainAdminUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
}

export const userGroupsService = new UserGroupsService(axios);