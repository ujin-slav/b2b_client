import { makeAutoObservable } from "mobx";
export default class SocketStore {
    unread = [];
    questUnread = 0;
    connected = false;
    socket;

    constructor(){
        makeAutoObservable(this);
    }

    setUnread(unread){
        this.unread = unread; 
    }

    setSocket(socket){
        this.socket = socket;
    }

    getSocket(socket){
        return this.socket;
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