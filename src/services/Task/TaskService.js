import axios from "axios";

const ldapLoginUpdateDomainUrl =  '/api/ldap-login/update-directory-domain';
const ldapLoginConfigurationsUrl = '/api/ldap-login/configurations';
const packagesListUrl = '/api/packages/list';
const packagesUpdateRepoAddrestUrl = '/api/packages/update/repo-address';
const packagesRepoAddrestUrl = '/api/packages/repo-address';
const pluginTaskListUrl = '/api/get-plugin-task-list';
const pluginProfileListUrl = '/api/get-plugin-profile-list';
const selectAgentInfoDetailUrl = '/api/select-agent-info/detail';
const commandExecuteUrl = '/api/command/command-execution-result';
const commandUrl = '/api/command';


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

    async packageList(params){
        try {
            const response = await axios.post(packagesListUrl,params );
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async packageUpdateRepo(params){
        try {
            const response = await axios.post(packagesUpdateRepoAddrestUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async packageRepoAddress(){
        try {
            const response = await axios.get(packagesRepoAddrestUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async pluginTaskList(params){
        try {
            const response = await axios.post(pluginTaskListUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async pluginProfileList(params){
        try {
            const response = await axios.post(pluginProfileListUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async agentInfoDetail(params){
        try {
            const response = await axios.post(selectAgentInfoDetailUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async commandExecute(id){
        try {
            const response = await axios.get(commandExecuteUrl + "/id/" + id);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async commandfindAll(dn){
        try {
            const response = await axios.get(commandUrl + "/dn/" + dn);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
    
}

export const taskService = new TaskService(axios);

