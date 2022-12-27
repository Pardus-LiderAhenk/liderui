import axios from "axios";

const sudoGroupsDeleteUrl = '/api/lider/sudo-groups/entry';
const userOfSudoGroupDeleteUrl = '/api/lider/sudo-groups/delete/sudo/user'
const sudoGroupsAddUrl = '/api/lider/sudo-groups/add-ou';
const sudoGroupsRenameUrl = '/api/lider/sudo-groups/rename/entry';
const sudoGroupsMoveUrl = '/api/lider/sudo-groups/move/entry';
const createSudoGroupsUrl = '/api/lider/sudo-groups/create-sudo-group';
const editSudoGroupsUrl = '/api/lider/sudo-groups/edit-sudo-group';
const userAttributeAndValueDelete = '/api/lider/user/attribute-with-value';



class SudoGroupsService{

    constructor(axios){
        this.axios = axios
    }

    async entryDelete(dn) {
        try {
            const response = await axios.delete(sudoGroupsDeleteUrl + "/dn/" + dn);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async userDelete(dn,uid) {
        try {
            const response = await axios.delete(userOfSudoGroupDeleteUrl + "/dn/" + dn + "/uid/" + uid );
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addOu(params) {
        try {
            const response = await axios.post(sudoGroupsAddUrl,params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async renameGroups(oldDN,newName) {
        try {
            const response = await axios.put(sudoGroupsRenameUrl + "/oldDN/" + oldDN + "/newName/" + newName);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async moveGroups(sourceDN,destinationDN) {
        try {
            const response = await axios.put(sudoGroupsMoveUrl + "/sourceDN/" + sourceDN + "/destinationDN/" + destinationDN);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async createGroups(params) {
        try {
            const response = await axios.post(createSudoGroupsUrl,params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async editGroups(params) {
        try {
            const response = await axios.post(editSudoGroupsUrl,params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async attrAndValDelete(dn,attribute,value) {
        try {
            const response = await axios.delete(userAttributeAndValueDelete + "/dn/" + dn + "/attribute/" + attribute + "/value/" + value );
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
}
export const sudoGroupsService = new SudoGroupsService(axios);