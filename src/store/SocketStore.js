import { makeAutoObservable } from "mobx";
export default class SocketStore {
    unread = [];
    questUnread = 0;

    constructor(){
        makeAutoObservable(this);
    }

    setUnread(unread){
        this.unread = unread; 
    }

    getUnread(unread){
        return unread; 
    }

    setQuestUnread(questUnread){
        this.questUnread = questUnread; 
    }

    getQuestUnread(questUnread){
        return questUnread; 
    }
}