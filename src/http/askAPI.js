  
import $api from "../http";
import axios from 'axios';

export const fetchAsks = async () => {
    const {data} = await $api.get(`/getask`);
    return data
}

export const fetchOneAsk = async (id) => {
    const {data} = await $api.post(`/getoneask`,{id});
    console.log(data)
    return data
}
export const upload = async (formData) => {
    const {data} = await $api.post(`/addask`, formData);
    return data
}

