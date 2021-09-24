import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http";
import AuthService from "../services/AuthService";

export default class UserStore {
    user = {};
    isAuth = false;
    isLoading = false;
    errorString = "";

    constructor(){
        makeAutoObservable(this);
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
            if (response.data.emailIncorrect===true){
                this.errorString = "Неверный email";
            }
            if (response.data.passwordIncorrect===true){
                this.errorString = "Неверный пароль";
            }
            if (response.data.notActivated===true){
                this.errorString = "Аккаунт не активирован";
            }
            console.log(response);
            localStorage.setItem('token', response.data.accesstoken)
            if(response.data.user){
               this.setAuth(true);
               this.setUser(response.data.user); 
            }   
        } catch (error) {
            console.log(error);
        }
    }

    async registration(data){
        try {
            const response = await AuthService.registration(data);
            console.log(response);
            localStorage.setItem('token', response.data.accesstoken)
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error) {
            console.log(error);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
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
                this.errorString = "Неверный токен";
            }
            if (response.data.result===true){
                this.errorString = "Пароль изменен, войдите использую новый пароль";
            }
            console.log(response);
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
        } catch (error) {
            console.log(error)
        }finally{
            this.setLoading(false);
        }
    }
}