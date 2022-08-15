import $api from "../http";

export default class CarouselService {

    static async getCarousel(formData){
        const {data} = await $api.post(`/getcarousel`,formData);
        return data
    }
    
}
