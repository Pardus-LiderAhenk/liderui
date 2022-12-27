import axios from 'axios';

const loginResetPasswordUrl = '/api/forgot-password/reset/';

class LoginService{

    constructor(axios){
        this.axios = axios
    }

    async resetPassword(uuid ,params) {
        try {
            const response = await axios.post(loginResetPasswordUrl+uuid, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}

export const loginService = new LoginService(axios);