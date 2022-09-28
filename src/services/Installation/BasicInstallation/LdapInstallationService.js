import axios from 'axios';

const ldapInstallUrl="/ldap/install";


class LdapInstallationService {

    constructor(axios) {
        this.axios = axios
    }

    async installBasicLdap(params) {
        try {
            const response = await axios.post(ldapInstallUrl, params);
            const data = response.data
            return { data };
        } catch (error) {
            return { error: error }
        }
    }
}

export const ldapInstallationService = new LdapInstallationService(axios);