import axios from "axios";

const  ldapLoginUpdateDomainUrl =  '/api/ldap-login/update-directory-domain';
const ldapLoginConfigurationsUrl = '/api/ldap-login/configurations';

class TaskService{

    constructor(axios){
        this.axios = axios
    }

    async updateDomain(params){
        try {
            const response = await axios.post(ldapLoginUpdateDomainUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async configurations(params){
        try {
            const response = await axios.get(ldapLoginConfigurationsUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
}

export const taskService = new TaskService(axios);

