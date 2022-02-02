import $api from "../http";


export default class UserService {
    static fetchUsers(limit,page){
        return $api.post('/getusers',{limit, page});
    }
}