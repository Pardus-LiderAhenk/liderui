import axios from 'axios';

const liderSettingsUpdateEmailUrl = '/api/lider/settings/update/email-settings';
const liderSettingsUpdateFileServerUrl = '/api/lider/settings/update/file-server';
const liderSettingsUpdateLdapUrl = "/api/lider/settings/update/ldap";
const liderSettingsUpdateOtherSettingsUrl = "/api/lider/settings/update/other-settings";
const liderSettingsUpdateXmppUrl = '/api/lider/settings/update/xmpp';
const liderSettingsConfigurationsUrl = "/api/lider/settings/configurations";




class ServerSettingsService{
    constructor(axios){
        this.axios =axios;
    }

    async updateEmail(data){
        try{
            const response =  await axios.post(liderSettingsUpdateEmailUrl,data);
            return { response };
        }
        catch(error){
            return { error: error };
        }
    }

    async updateFileServer(params) {
        try {
            const response = await axios.post(liderSettingsUpdateFileServerUrl, params);
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

    async getConfigurations(params) {
        try {
            const response = await axios.get(liderSettingsConfigurationsUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}

export const serverSettingService = new ServerSettingsService(axios);