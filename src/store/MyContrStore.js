import { makeAutoObservable } from "mobx";

export default class MyContrStore {
    
    searchString = ""

    constructor(){
        makeAutoObservable(this);
    }

    setSearchString(string){
        this.searchString = string; 
    }

    getSearchString(){
        return this.searchString;
    }
   

}