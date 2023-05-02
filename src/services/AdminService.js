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

    static async getPrice(formData){
        const {data} = await $api.post(`/getfilterprice`,formData);
        return data
    }


}
