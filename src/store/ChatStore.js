import { makeAutoObservable } from "mobx";

export default class ChatStore {
    isLoading = false;
    arrayMessages = [];
    recevier = "";

    constructor(){
        makeAutoObservable(this);
    }

    setLoading(bool){
        this.isLoading = bool; 
    }

    setChat(array){
        this.arrayMessages = array; 
    }

    getChat(){
        return this.arrayMessages;
    }

    setRecevier(recevier){
        this.recevier = recevier; 
    }

    getRecevier(){
        return this.recevier;
    }

}