import axios from 'axios';

 const settingsEditUserRolesUrl = "/api/lider/settings/edit-user-roles";
 const userAddUserUrl = "/api/lider/user/add-user";
 const olcAccessRuleUrl = "/api/lider/settings/OLC-access-rules";
 const settingsAddMemberToGroupUrl = "/api/lider/settings/add-member-to-group";
 const settingsGetRolesUrl = "/api/lider/settings/roles";
 const settingsGetConsoleUsersUrl = "/api/lider/settings/console-users";
 const settingsDeleteConsoleUsersUrl = "/api/lider/settings/delete-console-user";
 const settingsDeleteOLCAccessRuleUrl = "/api/lider/settings/delete-OLC-access-rule";
 const settingsAddOLCAccessRuleUrl = "/api/lider/settings/add-OLC-access-rule";
 const settingsGetOLCAccessRuleUrl = "/api/lider/settings/OLC-access-rule";
 const settingsConfigurationsUrl = "/api/lider/settings/configurations";//get
 const settingsUpdateLdapUrl = "/api/lider/settings/update/ldap";
 const settingsUpdateOtherSettingsUrl = "/api/lider/settings/update/other-settings";

class ConsoleUserSettingsService {

    constructor(axios) {
        this.axios = axios
    }

    async editUserRoles(params) {
        try {
            const response = await axios.post(settingsEditUserRolesUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }


    async addUser(params) {
        try {
            const response = await axios.post(userAddUserUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async olcAccessRules(params) {
        try {
            const response = await axios.get(olcAccessRuleUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addMemberToGroup(params) {
        try {
            const response = await axios.post(settingsAddMemberToGroupUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getRoles(params) {
        try {
            const response = await axios.get(settingsGetRolesUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getConsoleUsers(params) {
        try {
            const response = await axios.get(settingsGetConsoleUsersUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deleteConsoleUsers(params) {
        try {
            const response = await axios.delete(settingsDeleteConsoleUsersUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deleteOLCAccessRule(params) {
        try {
            const response = await axios.delete(settingsDeleteOLCAccessRuleUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addOLCAccessRule(params) {
        try {
            const response = await axios.post(settingsAddOLCAccessRuleUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getOLCAccessRule(params) {
        try {
            const response = await axios.get(settingsGetOLCAccessRuleUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getConfigurations(params) {
        try {
            const response = await axios.get(settingsConfigurationsUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async updateLdap(params){
        try {
            const response = await axios.post(settingsUpdateLdapUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async updateOtherSettings(params) {
        try {
            const response = await axios.post(settingsUpdateOtherSettingsUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}



export const consoleUserSettingsService = new ConsoleUserSettingsService(axios);
