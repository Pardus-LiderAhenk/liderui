import axios from "axios";

const adUpdateUserPasswordUrl = "/api/ad/update-user-password"
const adMemberFromGroupUrl = "/api/ad/member-from-group";
const adChildEntriesListUrl = "/api/ad/child-entries";
const adAddOuToAdUrl = "/api/ad/add-ou-to-ad";
const adAddGroupToAdUrl = "/api/ad/add-group-to-ad";
const adSearchEntryGroupUrl = "/api/ad/search-entry-group";
const adAddMemberToAdGroupUrl = "/api/ad/add-member-to-ad-group";
const adAddUserToAdUrl = "/api/ad/add-user-to-ad";
const adEntryUrl = "/api/ad/entry";
const moveAdUserToLdapUrl = "/api/ad/move-ad-user-to-ldap";
const syncGroupFromAdToLdapUrl = "/api/ad/sync-group-from-ad-to-ldap";
const syncUserFromAdToLdapUrl = "/api/ad/sync-user-from-ad-to-ldap";
const adConfigurations = "/api/ad/configurations";
const adChildUserUrl = "/api/ad/child-user";
const adSearchEntryUserUrl = "/api/ad/search-entry-user";
const adChildGroupUrl = "/api/ad/child-group"


class AdManagementService{

    constructor(axios){
        this.axios = axios;
    }

    async updateUserPassword(params) {
        try {
            const response = await axios.post(adUpdateUserPasswordUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deleteMemberUser(params) {
        try {
            const response = await axios.put(adMemberFromGroupUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async childEntriesList(params) {
        try {
            const response = await axios.post(adChildEntriesListUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addToOuAd(params) {
        try {
            const response = await axios.post(adAddOuToAdUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addGroupToAd(params) {
        try {
            const response = await axios.post(adAddGroupToAdUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async searchEntryGroup(params) {
        try {
            const response = await axios.post(adSearchEntryGroupUrl,params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addMemberToAdGroup(params) {
        try {
            const response = await axios.post(adAddMemberToAdGroupUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addAddUserToAd(params) {
        try {
            const response = await axios.post(adAddUserToAdUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deleteEntry(params) {
        try {
            const response = await axios.post(adEntryUrl ,params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async moveAdUserToLdap(params) {
        try {
            const response = await axios.post(moveAdUserToLdapUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async syncGroupFromAdToLdap(params) {
        try {
            const response = await axios.post(syncGroupFromAdToLdapUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async syncUserFromAdToLdap(params) {
        try {
            const response = await axios.post(syncUserFromAdToLdapUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
    
    async configuration() {
        try {
            const response = await axios.post(adConfigurations);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async childUser(params) {
        try {
            const response = await axios.post(adChildUserUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async searchEntryUserList(params) {
        try {
            const response = await axios.post(adSearchEntryUserUrl , params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async childGroupList(params) {
        try {
            const response = await axios.post(adChildGroupUrl,params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
}

export const adManagementService = new AdManagementService(axios);