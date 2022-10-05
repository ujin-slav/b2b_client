import $api from "../http";

export default class ContrService {

    static async addContr(formData){
        const {data} = await $api.post(`/addcontr`,formData);
        return data
    }
    
    static async fetchContr(formData){
        const {data} = await $api.post(`/getcontr`,formData);
        return data
    }
    static async fetchContrParty(formData){
        const {data} = await $api.post(`/getcontrparty`,formData);
        return data
    }
    static async delContr(formData){
        const {data} = await $api.post(`/delcontr`,formData);
        return data
    }
    static async getUserList(formData){
        const {data} = await $api.post(`/getuserlist`,formData);
        return data
    }
}
