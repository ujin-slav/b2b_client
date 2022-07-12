import $api from "../http";

export default class SpecOfferService {

    static async addSpecOffer(formData){
        const data = await $api.post(`/addspecoffer`,formData);
        return data
    }

    static async getFilterSpecOffer(formData){
        const {data} = await $api.post(`/getfilterspecoffer`,formData);
        return data
    }
    
}
