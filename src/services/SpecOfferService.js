import $api from "../http";

export default class SpecOfferService {

    static async addSpecOffer(formData){
        const {data} = await $api.post(`/addspecoffer`,formData);
        return data
    }
    
}
