import $api from "../http";

export default class MessageService {
    static getMessage(){
        return $api.post('/getmessage');
    }
    static addMessage(data){
        return $api.post('/addmessage',data);
    }
}