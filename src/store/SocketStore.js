import { makeAutoObservable,runInAction } from "mobx";
import io from "socket.io-client";

export default class SocketStore {
    refreshUser = false 
    unread = []
    questUnread = 0
    iWinnerUnread = 0
    reviewOrgUnread = 0
    answerOrgUnread = 0
    invitedUnread = 0
    invitedPriceUnread = 0
    invitedPriceFizUnread = 0
    specOfferAskUnread = 0
    statusAskUnread = 0
    connected = false
    errorString = "";
    socket

    contacts=[]
    recevier

    constructor(){
        if (SocketStore._instance) {
            return SocketStore._instance
        }
        SocketStore._instance = this;
        makeAutoObservable(this);
    }

    setRefreshUser(bool){
        this.refreshUser = bool; 
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
    getRefreshUser(bool){
        return this.refreshUser; 
    }
    getUnread(unread){
        return unread; 
    }
    getReviewOrgUnread(unread){
        return unread; 
    }
    getAnswerOrgUnread(unread){
        return unread; 
    }
    getIWinnerUnread(){
        return this.iWinnerUnread 
    }
    getInvitedUnread(){
        return this.invitedUnread 
    }
    getInvitedPriceUnread(){
        return this.invitedPriceUnread 
    }
    getInvitedPriceFizUnread(){
        return this.invitedPriceFizUnread 
    }
    getSpecOfferAskUnread(){
        return this.specOfferAskUnread 
    }
    getStatusAskUnread(){
        return this.statusAskUnread 
    }
    setReviewOrgUnread(reviewOrgUnread){
        this.reviewOrgUnread = reviewOrgUnread
    }
    setAnswerOrgUnread(answerOrgUnread){
        this.answerOrgUnread = answerOrgUnread
    }
    setIWinnerUnread(iWinnerUnread){
        this.iWinnerUnread = iWinnerUnread; 
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
    setInvitedPriceFizUnread(invitedPriceFizUnread){
        this.invitedPriceFizUnread = invitedPriceFizUnread; 
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
          })
          this.socket.on("unread_message", (data) => {   
            this.setUnread(data)
          })
          this.socket.on("unread_rest", (data) => {   
            this.setQuestUnread(data.unreadQuest) 
            this.setReviewOrgUnread(data.unreadReviewOrg)
            this.setAnswerOrgUnread(data.unreadAnswerOrg)  
            this.setIWinnerUnread(data.unreadIWinner) 
            this.setInvitedUnread(data.unreadInvited) 
            this.setInvitedPriceUnread(data.unreadInvitedPrice)
            this.setInvitedPriceFizUnread(data.unreadInvitedPriceFiz)
            this.setSpecOfferAskUnread(data.UnreadSpecAsk)  
            this.setStatusAskUnread(data.UnreadStatusAsk)           
          })
          this.socket.on("get_refreshUser", (data) => {   
            this.setRefreshUser(data)
          })
          this.socket.on("get_unread_quest", (data) => {   
            this.setQuestUnread(data)              
          })
          this.socket.on("get_unread_review_org", (data) => {  
            this.setReviewOrgUnread(data)          
          })
          this.socket.on("get_unread_answer_org", (data) => {  
            this.setAnswerOrgUnread(data)          
          })
          this.socket.on("get_unread_iwinner", (data) => {  
            this.setIWinnerUnread(data)          
          })
          this.socket.on("get_unread_invited", (data) => {   
            this.setInvitedUnread(data)          
          })
          this.socket.on("get_unread_invitedPrice", (data) => {   
            this.setInvitedPriceUnread(data)   
          })
          this.socket.on("get_unread_invitedPriceFiz", (data) => {   
            this.setInvitedPriceFizUnread(data)   
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