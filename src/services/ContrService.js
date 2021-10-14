import $api from "../http";

export default class ContrService {

    static async addContr({email,userid}){
        const {data} = await $api.post(`/addcontr`,{email,userid});
        return data
    }
    
    static async fetchContr(userid){
        const {data} = await $api.post(`/getcontr`,{userid});
        return data
    }
    

    static async delContr({email,userid}){
        const {data} = await $api.post(`/delcontr`,{email,userid});
        return data
    }
}
