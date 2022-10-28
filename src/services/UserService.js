import $api from "../http";


export default class UserService {
    static fetchUsers(formData){
        return $api.post('/getusers',formData);
    }
    static activateUser(activationLink){
        return $api.post('/activate',{activationLink});
    }
}