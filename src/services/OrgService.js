import $api from "../http";

export default class OrgService {

    static async getOrg(page,limit){
        const {data} = await $api.post(`/getorg`,{page,limit});
        return data
    }
    
}
