import { makeAutoObservable } from "mobx";

export default class QuestStore {
    isLoading = false;
    arrayQuest = [];

    constructor(){
        makeAutoObservable(this);
    }

    setLoading(bool){
        this.isLoading = bool; 
    }

    setQuest(array){
        this.arrayQuest = array; 
    }

    getQuest(){
        return this.arrayQuest;
    }

}