import $api from "../http";

export default class AskService {
    static async fetchAsks() {
        const result = await $api.get('/getask')
        return  result;
    }

    static async fetchOneAsk(id) {
        const result = await $api.get('/getask', {id})
        return  result;
    }


    static async upload(id) {
        const {data} = await $api.post(`/upload`,{id});
        console.log(data)
        return data
    }
}
