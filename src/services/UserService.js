import $api from "../http";


export default class UserService {
    static fetchUsers(limit,page,user,searchUser){
        return $api.post('/getusers',{limit, page,user,searchUser});
    }
    static activateUser(activationLink){
        return $api.post('/activate',{activationLink});
    }
}