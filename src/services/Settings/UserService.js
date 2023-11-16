import axios from "axios";

const userAddUserUrl = '/api/lider/user/add-user';
const userAddOuUrl  = '/api/lider/user/add-ou';
const userSessionUrl = '/api/lider/user/user-session';
const userConfigurationsUrl = '/api/lider/user/configurations';
const userMoveEntryUrl = '/api/lider/user/move/entry';
const userEditUrl = '/api/lider/user/edit-user';
const userPasswdUpdateUrl = '/api/lider/user/update-user-password';
const userAttributeWithValueUrl = '/api/lider/user/attribute-with-value';



class UserService {

    constructor(axios) {
        this.axios = axios
    }


    async addUser(params) {
        try {
            const response = await axios.post(userAddUserUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async addOu(params) {
        try {
            const response = await axios.post(userAddOuUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async userSession(uid, pageNumber, pageSize) {
        // /user-session/uid/{uid}/page-number/{pageNumber}/page-size/{pageSize}
        try {
            const response = await axios.get(userSessionUrl + "/page-number/" + pageNumber + "/page-size/" + pageSize + "/uid/" + uid);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async userConfigurations() {
        try {
            const response = await axios.get(userConfigurationsUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async moveEntry(params) {
        try {
            const response = await axios.post(userMoveEntryUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async editUser(params) {
        try {
            const response = await axios.post(userEditUrl, params);
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

    async deleteAttributeAndValue(dn,attribute,value) {
        try {
            const response = await axios.delete(userAttributeWithValueUrl + "/dn/" + dn + "/attribute/" + attribute + "/value/" + value);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
}

export const userService = new UserService(axios);