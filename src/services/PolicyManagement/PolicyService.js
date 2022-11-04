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

    async policyActivePolicy(params){
        try {
            const response = await axios.post(policyActivePolicyUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
    
}

export const policyService = new PolicyService(axios);