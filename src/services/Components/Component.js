import axios from 'axios';

const liderInfoVersionUrl = '/api/lider-info/version';

class ComponentServie{

    constructor(axios) {
        this.axios = axios
    }

    async version() {
        try {
            const response = await axios.get(liderInfoVersionUrl);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }
}

export const componentService = new ComponentServie(axios);