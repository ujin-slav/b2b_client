import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http";
import AuthService from "../services/AuthService";

export default class UserStore {
    user = {};
    isAuth = false;
    isLoading = false;
    chat;
    errorString = "";

    constructor(chat){
        makeAutoObservable(this);
        this.chat = chat;
    }

    setAuth(bool){
        this.isAuth = bool; 
    }

    setLoading(bool){
        this.isLoading = bool; 
    }

    setUser(user){
        this.user = user;
    }

    async login(email, password){
        try {
            const response = await AuthService.login(email,password);    
            if(!response.data?.errors){
               localStorage.setItem('token', response.data.accesstoken)
               this.setAuth(true);
               this.setUser(response.data.user); 
            }   
            this.chat.connect(response.data.accessToken)
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async registration(data){
        try {
            const response = await AuthService.registration(data);
            // if(!response.data?.errors){
            //     localStorage.setItem('token', response.data.accesstoken)
            //     this.setAuth(true);
            //     this.setUser(response.data.user); 
            // }   
            return response;
        } catch (error) {
            console.log("error");
        }
    }

    async changeuser(data){
        try {
            const response = await AuthService.changeuser(data);
            if(response.status===200){
                await this.checkAuth()
            }
            return response;
        } catch (error) {
            console.log("error");
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            this.chat.disconnect()
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({});
        } catch (e) {
            console.log(e);
        }
    }

    async reset(token, password) {
        try {
            const response = await AuthService.reset(token, password);
            if (response.data.tokenIncorrect===true){
                this.errorString = "Неверный токен, перейдите снова по ссылке забыл пароль.";
            }
            if (response.data.result===true){
                this.errorString = "Пароль изменен, войдите используя новый пароль";
            }
            return response
        } catch (e) {
            console.log(e);
        }
    }

    async forgot(email) {
        try {
            const response = await AuthService.forgot(email);
            if (response.data.emailIncorrect===true){
                this.errorString = "Неверный email";
            }     
            if (response.data.result===true){
                this.errorString = "На ваш email отправлена ссылка для изменения пароля";
            }
            return response;
        } catch (e) {
            console.log(e);
        }
    }


    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials:true});
            localStorage.setItem('token', response.data.accesstoken)
            this.setAuth(true);
            this.setUser(response.data.user);
            this.chat.connect(response.data.accessToken)
        } catch (error) {
            console.log(error)
        }finally{
            this.setLoading(false);
        }
    }
}