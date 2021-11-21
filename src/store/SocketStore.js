import { makeAutoObservable } from "mobx";
export default class SocketStore {
    recevier;
    recevierName;

    constructor(){
        makeAutoObservable(this);
    }

    setRecevier(recevier){
        this.recevier = recevier; 
    }

    setRecevierName(recevierName){
        this.recevierName = recevierName; 
    }
}