import $api from "../http";


export default class MessageService {
    static addQuest(data){
        return $api.post('/addquest',data);
    }
    static fetchQuest(data){
        return $api.post('/getquest',data);
    }
    static delQuest(id){
        return $api.post('/delquest',{id});
    }
}