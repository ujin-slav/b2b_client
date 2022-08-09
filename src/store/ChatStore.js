import { makeAutoObservable } from "mobx";

export default class ChatStore {
    isLoading = false;
    arrayMessages = [];
    arrayUsers = []
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

    setUsers(array){
        this.arrayUsers = array; 
    }

    getChat(){
        return this.arrayMessages;
    }
    getUsers(){
        return this.arrayUsers;
    }

    setRecevier(recevier){
        this.recevier = recevier; 
    }

    getRecevier(){
        return this.recevier;
    }

}