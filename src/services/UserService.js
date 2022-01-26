import $api from "../http";


export default class UserService {
    static fetchUsers(){
        return $api.post('/getusers',{limit:8, page:1});
    }
}