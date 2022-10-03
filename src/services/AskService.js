import $api from "../http";

export default class AskService {

    static async fetchAsks(formData){
        const {data} = await $api.post(`/getask`,{formData});
        return data
    }
    
    static async fetchOneAsk(id){
        const {data} = await $api.post(`/getoneask`,{id});
        return data
    }
    static async fetchOffers(id){
        const {data} = await $api.post(`/getoffers`,{id});
        return data
    }
    static async fetchUserOffers(formData){
        const {data} = await $api.post(`/getuseroffers`,formData);
        return data
    }
    static async fetchUser(id){
        const {data} = await $api.post(`/getuser`,{id});
        return data
    }
    static async upload(formData){
        const {data} = await $api.post(`/addask`, formData);
        return data
    }
    static async uploadOffer(formData){
        const {data} = await $api.post(`/addoffer`, formData);
        return data
    }
    static async deleteOffer(id){
        return $api.post(`/deleteoffer`, {id});
    }
    static async deleteAsk(id){
        return $api.post(`/deleteask`, {id});
    }
    static async deleteFile(formData){
        return $api.post(`/deletestatusaskfile`, formData);
    }
    static async setStatus(formData){
        const data = await $api.post(`/setstatusask`,formData);
        return data
    }
    static async getStatus(id){
        const {data} = await $api.post(`/getstatusask`,{id});
        return data
    }
    
}
