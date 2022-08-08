import $api from "../http";

export default class ChatService {

    static async getStatus(formData){
        const data = await $api.post(`/getconnectedfriend`,formData);
        return data
    }
}

