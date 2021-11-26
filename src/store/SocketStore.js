import { makeAutoObservable } from "mobx";
import io from "socket.io-client";

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

    connect(token){
        this.socket = io.connect(`http://localhost:5000`,{
            query: {token}
          })
          this.socket.on("connect", () => {
            this.connected = true;
            this.socket.emit("get_unread") 
          });
          this.socket.on("unread_message", (data) => {   
            console.log(data)
            this.setUnread(data)
          });
          this.socket.on("get_unread_quest", (data) => {   
            this.setQuestUnread(data)              
        });
    }

    disconnect(){
        if(this.socket){
            this.socket.disconnect(); 
         }
    }
}