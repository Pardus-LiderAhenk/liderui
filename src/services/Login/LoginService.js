import axios from 'axios';

const loginResetPasswordUrl = '/api/forgot-password/reset/';

class LoginService{

    constructor(axios){
        this.axios = axios
    }

    async registerAndSave(params) {
        try {
            const response = await axios.post(loginResetPasswordUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}

export const loginService = new LoginService(axios);