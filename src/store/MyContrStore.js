import { makeAutoObservable } from "mobx";

export default class MyContrStore {
    
    searchString = ""
    fetchContr = false
    searching = false 

    constructor(){
        makeAutoObservable(this);
    }

    setSearchString(string){
        this.searchString = string; 
        this.searching = true
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
    setSearching(bool){
        this.searching = bool
    }
    setFetchContr(bool){
        this.fetchContr = bool
    }

}