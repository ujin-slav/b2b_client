  
import $api from "../http";
import axios from 'axios';

export const fetchAsks = async (formData) => {
    const {data} = await $api.post(`/getask`,{formData});
    return data
}

export const fetchFilterAsks = async (formData) => {
    const {data} = await $api.post(`/getfilterask`,{formData});
    return data
}

export const fetchInvitedAsks = async (formData) => {
    const {data} = await $api.post(`/getinvitedask`,{formData});
    return data
}

export const fetchOneAsk = async (id) => {
    const {data} = await $api.post(`/getoneask`,{id});
    return data
}
export const fetchOffers = async (id) => {
    const {data} = await $api.post(`/getoffers`,{id});
    return data
}
export const fetchUserOffers = async (id) => {
    const {data} = await $api.post(`/getuseroffers`,{id});
    return data
}
export const fetchUser = async (id) => {
    const {data} = await $api.post(`/getuser`,{id});
    return data
}
export const upload = async (formData) => {
    const {data} = await $api.post(`/addask`, formData);
    return data
}
export const modifyAsk = async (formData) => {
    const {data} = await $api.post(`/modifyask`, formData);
    return data
}
export const uploadOffer = async (formData) => {
    const {data} = await $api.post(`/addoffer`, formData);
    return data
}


