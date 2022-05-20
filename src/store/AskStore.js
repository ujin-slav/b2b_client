
import { makeAutoObservable } from "mobx";

export default class AskStore {
    isLoading = false;
    arrayAsks = [];
    categoryFilter = []
    regionFilter = []
    searchText = ""
    searchInn = ""

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