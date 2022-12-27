import axios from 'axios';

const liderLdapSearcEntryUrl = '/api/lider/ldap/search-entry';
const liderConsoleProfilUrl = '/api/lider-console/profile';
const liderConsoleUpdateProfilUrl = '/api/lider-console/update-profile';
const liderConsoleMatchesPasswdUrl = '/api/lider-console/matches-password';

class ProfileService {

    constructor(axios){
        this.axios = axios
    }

    async searchEntry(params) {
        try {
            const response = await axios.post(liderLdapSearcEntryUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async getProfile(params) {
        try {
            const response = await axios.post(liderConsoleProfilUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async updateProfile(params) {
        try {
            const response = await axios.put(liderConsoleUpdateProfilUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
}

export const profileService = new ProfileService(axios);