import $api from "../http";

export default class AuthService {
    static async login(email, password){
        return $api.post('/login', {email, password})
    }

    static async registration(data) {
        return $api.post('/registration', {data})
    }

    static async logout(){
        return $api.post('/logout')
    }
    
    static async changeuser(formData){
        return $api.post('/changeuser',formData)
    }
    
    static async forgot(email){
        return $api.post('/forgot', {email})
    }

    static async reset(token, password){
        return $api.post('/reset', {token, password})
    }

    static async refreshUser(formData){
        return $api.post('/refreshuser',formData)
    }
}