import $api from "../http";

export default class OrgService {

    static async getOrg(page,limit,search){
        const {data} = await $api.post(`/getorg`,{page,limit,search});
        return data
    }

    static async getOrgCat(page,limit,search){
        const {data} = await $api.post(`/getorgcat`,{});
        return data
    }
    
}
