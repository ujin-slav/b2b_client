import { makeAutoObservable } from "mobx";
import io from "socket.io-client";

export default class SocketStore {
    unread = [];
    questUnread = 0;
    connected = false;
    socket;
    limit = 20;
    limitUser = 8;
    totalDocs;
    totalDocsUser
    totalPageUser
    currentPageUser
    invitedUnread

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
    setInvitedUnread(invitedUnread){
        this.invitedUnread = invitedUnread; 
    }

    getQuestUnread(questUnread){
        return questUnread; 
    }

    setLimit(num){
        this.limit = num
    }
    
    setTotalDocs(num){
        this.totalDocs = num
    }

    connect(token){
        this.socket = io.connect(`${process.env.REACT_APP_SOCKET_URL}`,{
            query: {token}
          })
          this.socket.on("connect", () => {
            this.connected = true;
            this.socket.emit("get_unread") 
          });
          this.socket.on("unread_message", (data) => {   
            this.setUnread(data)
          });
          this.socket.on("get_unread_quest", (data) => {   
            this.setQuestUnread(data)              
          })
          this.socket.on("get_unread_invited", (data) => {   
            this.setQuestUnread(data)              
          }
        );
    }

    disconnect(){
        if(this.socket){
            this.socket.disconnect(); 
         }
    }
}