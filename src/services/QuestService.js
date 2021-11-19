import $api from "../http";


export default class QuestService {
    static addQuest(data){
        return $api.post('/addquest',data);
    }
    static fetchQuest(data){
        return $api.post('/getquest',data);
    }
    static delQuest(id){
        return $api.post('/delquest',{id});
    }
    static getUnreadQuest(id){
        return $api.post('/getunreadquest',{id});
    }
}