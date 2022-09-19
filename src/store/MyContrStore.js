import { makeAutoObservable } from "mobx";

export default class MyContrStore {
    
    searchString = ""
    fetchingContr = true

    constructor(){
        makeAutoObservable(this);
    }

    setSearchString(string){
        this.searchString = string; 
    }

    getSearchString(){
        return this.searchString;
    }

    setFetchingContr(bool){
        this.fetchingContr = bool; 
    }

    getFetchingContr(){
        return this.fetchingContr;
    }
   

}