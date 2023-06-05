import $api from "../http";

export default class AdminService {

    static async userBan(formData){
        const data = await $api.post(`/admin/userban`,formData);
        return data
    }
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
    static async getSpamListAsk(formData){
        const {data} = await $api.post(`/admin/getspamlistask`,formData);
        return data
    }
    static async getSpamListSpecOffer(formData){
        const {data} = await $api.post(`/admin/getspamlistspecoffer`,formData);
        return data
    }
    static async sendSpamByAsk(formData){
        const data = await $api.post(`/admin/sendspambyask`,formData);
        return data
    }
    static async sendSpamBySpecOffer(formData){
        const data = await $api.post(`/admin/sendspambyspecoffer`,formData);
        return data
    }
    static async getSentSpamByAsk(formData){
        const {data} = await $api.post(`/admin/getsentspambyask`,formData);
        return data
    }
    static async getSentSpamBySpecOffer(formData){
        const {data} = await $api.post(`/admin/getsentspambyspecoffer`,formData);
        return data
    }
}
