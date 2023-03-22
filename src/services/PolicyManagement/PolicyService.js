import axios from "axios";

const policyListUrl = '/api/policy/list';
const policyAddUrl = '/api/policy/add';
const policyDeleteUrl = '/api/policy/delete';
const policyActiveUrl = '/api/policy/active';
const policyPassiveUrl = '/api/policy/passive';
const policyUpdateUrl = '/api/policy/update';
const policyExecuteUrl = '/api/policy/execute';
const policyPolicyGroupUrl = '/api/policy/policies-for-group';
const policyPolicyUnassigmentUrl = '/api/policy/unassignment';
const policyActivePolicyUrl = '/api/policy/active-policies';
const addPolicyExceptionUrl = '/api/policy-exception/add';
const getPolicyExceptionByDnUrl = '/api/policy-exception/list/dn/{dn}';
const getPolicyExceptionByPolicyUrl = '/api/policy-exception/list/policy/{id}';
const getPolicyExceptionByPolicyUrlAndByGroupDn = '/api/policy-exception/list/policy/{id}/group-dn/{dn}';
const deletePolicyExceptionUrl = '/api/policy-exception/delete/{id}';

class PolicyService {

    constructor(axios){
        this.axios = axios
    }

    async policyList(params){
        try {
            const response = await axios.post(policyListUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async policyAdd(params){
        try {
            const response = await axios.post(policyAddUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async policyDelete(id){
        try {
            const response = await axios.delete(policyDeleteUrl + "/id/" + id);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async policyActive(params){
        try {
            const response = await axios.post(policyActiveUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async policyPassive (params){
        try {
            const response = await axios.post(policyPassiveUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async policyUpdate (params){
        try {
            const response = await axios.post(policyUpdateUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async policyExecute(params){
        try {
            const response = await axios.post(policyExecuteUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async policyGroup(dn){
        try {
            const response = await axios.get(policyPolicyGroupUrl + "/dn/" + dn);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async policyUnassigment(params){
        try {
            const response = await axios.post(policyPolicyUnassigmentUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async policyActivePolicy(){
        try {
            const response = await axios.get(policyActivePolicyUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addPolicyException(params) {
        try {
            const response = await axios.post(addPolicyExceptionUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getPolicyExceptionByPolicy(id) {
        try {
            const response = await axios.get(getPolicyExceptionByPolicyUrl.replace("{id}", id));
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getPolicyExceptionByPolicyAndByGroupDn(id, dn) {
        try {
            const response = await axios.get(getPolicyExceptionByPolicyUrlAndByGroupDn.replace("{id}", id).replace("{dn}", dn));
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async deletePolicyException(id) {
        try {
            const response = await axios.delete(deletePolicyExceptionUrl.replace("{id}", id));
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
    
}

export const policyService = new PolicyService(axios);