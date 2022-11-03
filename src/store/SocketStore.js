import { makeAutoObservable,runInAction } from "mobx";
import io from "socket.io-client";

export default class SocketStore {
    unread = []
    questUnread = 0
    invitedUnread = 0
    invitedPriceUnread = 0
    specOfferAskUnread = 0
    statusAskUnread = 0
    connected = false
    socket

    fetchingMessage = false
    currentMessagePage = 0
    totalDocsMessage = 0
    messageList = [] 

    constructor(){
        makeAutoObservable(this);
    }

    setFetchingMessage(bool){
        runInAction(() => {this.fetchingMessage = !this.fetchingMessage})
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

    getInvitedUnread(){
        return this.invitedUnread 
    }
    getInvitedPriceUnread(){
        return this.invitedUnread 
    }
    getSpecOfferAskUnread(){
        return this.specOfferAskUnread 
    }
    getStatusAskUnread(){
        return this.statusAskUnread 
    }

    setQuestUnread(questUnread){
        this.questUnread = questUnread; 
    }
    setInvitedUnread(invitedUnread){
        this.invitedUnread = invitedUnread; 
    }
    setInvitedPriceUnread(invitedPriceUnread){
        this.invitedPriceUnread = invitedPriceUnread; 
    }
    setSpecOfferAskUnread(specOfferAskUnread){
        this.specOfferAskUnread = specOfferAskUnread; 
    }
    setStatusAskUnread(statusAskUnread){
        this.statusAskUnread = statusAskUnread; 
    }

    getQuestUnread(questUnread){
        return questUnread; 
    }

    setLimit(num){
        this.limit = num
    }
    setMessageList(list){
        this.messageList = list
    }
    
    setTotalDocs(num){
        this.totalDocs = num
    }
    setUsers(array){
        this.users = array; 
    }
    getUsers(){
        return this.users;
    }

    connect(token){
        this.socket = io.connect(`${process.env.REACT_APP_SOCKET_URL}`,{
            query: {token}
          })
          this.socket.on("connect", () => {
            this.connected = true;
            this.socket.emit("get_unread") 
          })
          this.socket.on("unread_message", (data) => {   
            this.setUnread(data)
          })
          this.socket.on("get_unread_quest", (data) => {   
            this.setQuestUnread(data)              
          })
          this.socket.on("get_unread_invited", (data) => {   
            this.setInvitedUnread(data)          
          })
          this.socket.on("get_unread_invitedPrice", (data) => {   
            this.setInvitedPriceUnread(data)   
          })
          this.socket.on("get_unread_specOfferAsk", (data) => { 
            this.setSpecOfferAskUnread(data)   
          })
          this.socket.on("get_unread_statusAsk", (data) => { 
            this.setStatusAskUnread(data)   
          })
    }
    connectNotAuth(){
        this.socket = io.connect()
        this.socket.on("connectNotAuth", () => {
            this.connected = true;
        })
    }

    disconnect(){
        if(this.socket){
            this.socket.disconnect(); 
         }
    }
}