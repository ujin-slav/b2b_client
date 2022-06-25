import $api from "../http";

export default class PriceService {

    static async getPrice(formData){
        const {data} = await $api.post(`/getprice`,formData);
        return data
    }

    static async clearPrice(formData){
        const {data} = await $api.post(`/clearprice`,formData);
        return data
    }

    static async saveAsk(formData){
        const {data} = await $api.post(`/saveask`,formData);
        return data
    }

    static async getAskPrice(formData){
        const {data} = await $api.post(`/getaskprice`,formData);
        return data
    }
    
}
