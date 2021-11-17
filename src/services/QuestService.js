import $api from "../http";


export default class MessageService {
    static addQuest(data){
        return $api.post('/addquest',data);
    }
    static fetchQuest(id){
        return $api.post('/getquest',{id});
    }
    static delQuest(id){
        return $api.post('/delquest',{id});
    }
}