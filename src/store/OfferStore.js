
import { makeAutoObservable } from "mobx";

export default class OfferStore {
    isLoading = false;
    arrayOffers = [];

    constructor(){
        makeAutoObservable(this);
    }

    setLoading(bool){
        this.isLoading = bool; 
    }

    setOffer(array){
        this.arrayOffers = array; 
    }

    getOffer(){
        return this.arrayOffers;
    }

}