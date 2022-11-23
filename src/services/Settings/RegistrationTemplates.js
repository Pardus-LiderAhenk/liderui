import axios from "axios";

const registrationTemplateListUrl = '/api/registration-templates';
const registrationTemplateTypeUrl = '/api/registration-templates';
const registrationTemplateUpdateUrl = '/api/registration-templates';
const registrationTemplateDeleteUrl = '/api/registration-templates';

class RegistrationTemplateService{

    constructor(axios){
        this.axios = axios
    }

    async list(type, count, size) {
        try {
            const response = await axios.get(registrationTemplateListUrl + "/type/" + type + "/page-count/" + count + "/page-size/" + size);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async type(params) {
        try {
            const response = await axios.post(registrationTemplateTypeUrl, params);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async update(params) {
        try {
            const response = await axios.put(registrationTemplateUpdateUrl,params );
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

    async delete(id) {
        try {
            const response = await axios.delete(registrationTemplateDeleteUrl + "/id/" + id);
            return { response };
        } catch (error) {
            return { error: error }
        }
    }

}

export const registrationTemplateService = new RegistrationTemplateService(axios);