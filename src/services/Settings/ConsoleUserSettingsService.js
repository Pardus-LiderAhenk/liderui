import axios from 'axios';

 const settingsEditUserRolesUrl = "/api/lider/settings/edit-user-roles";
 const olcAccessRuleUrl = "/api/lider/settings/OLC-access-rules";
 const settingsAddMemberToGroupUrl = "/api/lider/settings/add-member-to-group";
 const settingsGetRolesUrl = "/api/lider/settings/roles";
 const settingsGetConsoleUsersUrl = "/api/lider/settings/console-users";
 const settingsDeleteConsoleUsersUrl = "/api/lider/settings/delete-console-user";
 const settingsDeleteOLCAccessRuleUrl = "/api/lider/settings/delete-OLC-access-rule";
 const settingsAddOLCAccessRuleUrl = "/api/lider/settings/add-OLC-access-rule";
 const settingsGetOLCAccessRulesUrl = "/api/lider/settings/OLC-access-rules";
 const settingsConfigurationsUrl = "/api/lider/settings/configurations";
 const settingsUpdateLdapUrl = "/api/lider/settings/update/ldap";
 const settingsUpdateOtherSettingsUrl = "/api/lider/settings/update/other-settings";
 const userPasswdUpdateUrl = '/api/lider/user/update-user-password';

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

    async olcAccessRules(dn) {
        try {
            const response = await axios.get(olcAccessRuleUrl + "/dn/" + dn);
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

    async getRoles() {
        try {
            const response = await axios.get(settingsGetRolesUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getConsoleUsers() {
        try {
            const response = await axios.get(settingsGetConsoleUsersUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deleteConsoleUsers(dn) {
        try {
            const response = await axios.delete(settingsDeleteConsoleUsersUrl + "/dn/" + dn);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deleteOLCAccessRule(params) {
        try {
            const response = await axios.post(settingsDeleteOLCAccessRuleUrl, params);
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

    async getOLCAccessRule(dn) {
        try {
            const response = await axios.get(settingsGetOLCAccessRulesUrl + "/dn/" + dn);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getConfigurations() {
        try {
            const response = await axios.get(settingsConfigurationsUrl);
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
    async updatePasswd(params) {
        try {
            const response = await axios.post(userPasswdUpdateUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}



export const consoleUserSettingsService = new ConsoleUserSettingsService(axios);
