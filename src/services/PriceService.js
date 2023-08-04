import $api from "../http";

export default class PriceService {

    static async getPrice(formData){
        const {data} = await $api.post(`/getprice`,formData);
        return data
    }
    static async getFilterPrice(formData){
        const {data} = await $api.post(`/getfilterprice`,formData);
        return data
    }
    static async getPriceUnit(id){
        const {data} = await $api.post(`/getpriceunit`,{id});
        return data
    }
    static async clearPrice(formData){
        const data = await $api.post(`/clearprice`,formData);
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

    static async getAskPriceFiz(formData){
        const {data} = await $api.post(`/getaskpricefiz`,formData);
        return data
    }

    static async getAskPrice(formData){
        const {data} = await $api.post(`/getaskprice`,formData);
        return data
    }

    static async getAskPriceId(id){
        const data = await $api.post(`/getaskpriceid`,{id});
        return data
    }

    static async setStatus(formData,option){
        const data = await $api.post(`/setstatuspriceask`,formData,option);
        return data
    }
    static async getStatus(id){
        const {data} = await $api.post(`/getstatuspriceask`,{id});
        return data
    }
    static async deleteFile(formData){
        return $api.post(`/deletestatuspriceaskfile`, formData);
    }
    
}