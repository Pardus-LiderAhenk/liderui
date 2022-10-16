import axios from 'axios';

const liderLdapSearcEntryUrl = '/api/lider/ldap/search-entry';

class ProfileService{

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
}

export const profileService = new ProfileService(axios);