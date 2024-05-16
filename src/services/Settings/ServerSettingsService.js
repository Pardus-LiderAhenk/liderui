import axios from 'axios';

const liderSettingsUpdateEmailUrl = '/api/lider/settings/update/email-settings';
const liderSettingsUpdateSettingsPasswordUrl = '/api/lider/settings/update/settings-password';
const liderSettingsSaveSettingsPasswordUrl = '/api/lider/settings/save/settings-password'
const liderSettingsUpdateFileServerUrl = '/api/lider/settings/update/file-server';
const liderSettingsUpdateLdapUrl = "/api/lider/settings/update/ldap";
const liderSettingsUpdateOtherSettingsUrl = "/api/lider/settings/update/other-settings";
const liderSettingsUpdateXmppUrl = '/api/lider/settings/update/xmpp';
const liderSettingsConfigurationsUrl = "/api/lider/settings/configurations";
const liderSettingsChangeLanguageUrl = "/api/lider/change-language";



class ServerSettingsService{
    constructor(axios){
        this.axios =axios;
    }

    async updateEmail(data){
        try{
            const response =  await axios.post(liderSettingsUpdateEmailUrl,data);
            return { response };
        } catch(error){
            return { error: error };
        }
    }

    async changePassword(data){
        try{
            const response =  await axios.post(liderSettingsUpdateSettingsPasswordUrl,data);
            return { response };
        } catch(error){
            return { error: error };
        }
    }

    async savePassword(data){
        try{
            const response =  await axios.post(liderSettingsSaveSettingsPasswordUrl,data);
            return { response };
        } catch(error){
            return { error: error };
        }
    }

    async updateFileServer(data) {
        try {
            const response = await axios.post(liderSettingsUpdateFileServerUrl, data);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async updateLdap(params){
        try {
            const response = await axios.post(liderSettingsUpdateLdapUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async updateOtherSettings(params) {
        try {
            const response = await axios.post(liderSettingsUpdateOtherSettingsUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async updateXmpp(params) {
        try {
            const response = await axios.post(liderSettingsUpdateXmppUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getConfigurations() {
        try {
            const response = await axios.get(liderSettingsConfigurationsUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async changeLanguage(data){
        try {
            const response = await axios.post(liderSettingsChangeLanguageUrl,data);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}

export const serverSettingService = new ServerSettingsService(axios);