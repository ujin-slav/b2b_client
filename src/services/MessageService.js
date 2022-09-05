import $api from "../http";

export default class MessageService {
    
    static async getMessage(formData){
        const data = await $api.post(`/getmessage`,formData);
        return data
    }
}