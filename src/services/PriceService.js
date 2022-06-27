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
        const data = await $api.post(`/saveask`,formData);
        return data
    }
    static async updatePriceAsk(formData){
        const data = await $api.post(`/updatepriceask`,formData);
        return data
    }
    static async deletePriceAsk(id){
        return $api.post(`/deletepriceask`, {id});
    }

    static async getAskPrice(formData){
        const {data} = await $api.post(`/getaskprice`,formData);
        return data
    }

    static async getAskPriceId(id){
        const {data} = await $api.post(`/getaskpriceid`,{id});
        return data
    }
    
}
