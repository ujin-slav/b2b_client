import $api from "../http";


export default class QuestService {
    static addQuest(data){
        return $api.post('/addquest',data);
    }
}