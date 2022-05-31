import $api from "../http";


export default class UserService {
    static fetchUsers(limit,page,user){
        return $api.post('/getusers',{limit, page,user});
    }
    static activateUser(activationLink){
        return $api.post('/activate',{activationLink});
    }
}