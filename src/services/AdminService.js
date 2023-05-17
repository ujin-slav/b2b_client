import $api from "../http";

export default class AdminService {

    static async getUsers(formData){
        const {data} = await $api.post(`/admin/getusers`,formData);
        return data
    }

    static async getAsks(formData){
        const {data} = await $api.post(`/admin/getasks`,formData);
        return data
    }
    static async getSpecOffers(formData){
        const {data} = await $api.post(`/admin/getspecoffers`,formData);
        return data
    }
    static async getPrice(formData){
        const {data} = await $api.post(`/getfilterprice`,formData);
        return data
    }
    static async getSpamList(formData){
        const {data} = await $api.post(`/admin/getspamlist`,formData);
        return data
    }
    static async sendSpamByAsk(formData){
        const data = await $api.post(`/admin/sendspambyask`,formData);
        return data
    }
    static async getSentSpamByAsk(formData){
        const {data} = await $api.post(`/admin/getsentspambyask`,formData);
        return data
    }

}
