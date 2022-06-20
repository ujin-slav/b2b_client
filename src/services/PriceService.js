import $api from "../http";

export default class PriceService {

    static async getPrice(page,limit,search,org){
        console.log(org)
        const {data} = await $api.post(`/getprice`,{page,limit,search,org});
        return data
    }
    
}
