import { makeAutoObservable } from "mobx";

export default class AlertStore {
    
    show = false;
    message = "";

    constructor(){
        makeAutoObservable(this);
    }

    setShow(bool){
        this.show = bool;
    }

    setMessage(string){
        this.message = string;
        this.show = true;
        setTimeout(()=>this.setShow(false),5000)
    }

}    