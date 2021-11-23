import { makeAutoObservable } from "mobx";
export default class SocketStore {
    unread

    constructor(){
        makeAutoObservable(this);
    }

    setUnread(unread){
        this.unread = unread; 
    }

    getUnread(unread){
        return unread; 
    }
}