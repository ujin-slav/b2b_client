
import { makeAutoObservable } from "mobx";

export default class AskUserStore {
    isLoading = false;
    arrayAsks = [];

    constructor(){
        makeAutoObservable(this);
    }

    setLoading(bool){
        this.isLoading = bool; 
    }

    setAsk(array){
        this.arrayAsks = array; 
    }

    getAsk(){
        return this.arrayAsks;
    }

}