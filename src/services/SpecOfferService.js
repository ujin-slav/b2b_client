import $api from "../http";

export default class SpecOfferService {

    static async addSpecOffer(formData){
        const data = await $api.post(`/addspecoffer`,formData);
        return data
    }
    static async modifySpecOffer(formData){
        const data = await $api.post(`/modifyspecoffer`,formData);
        return data
    }

    static async getFilterSpecOffer(formData){
        const {data} = await $api.post(`/getfilterspecoffer`,formData);
        return data
    }
    static async getSpecOfferUser(formData){
        const {data} = await $api.post(`/getspecofferuser`,formData);
        return data
    }
    
    static async getSpecOfferId(formData){
        const {data} = await $api.post(`/getspecofferid`,formData);
        return data
    }
    static async deleteSpecOffer(formData){
        const data = await $api.post(`/deletespecoffer`,formData);
        return data
    }
    static async getImage(name){
        const data = await $api.get(`/getpic/` + name);
        return data
    }
}

