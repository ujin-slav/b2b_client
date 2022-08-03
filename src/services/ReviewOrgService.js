import $api from "../http";


export default class ReviewOrgService {
    static addReviewOrg(data){
        return $api.post('/addrevieworg',data);
    }
    static fetchReviewOrg(data){
        return $api.post('/getrevieworg',data);
    }
    static fetchReviewOrgtUser(data){
        return $api.post('/getrevieworguser',data);
    }
    static delReviewOrg(id){
        return $api.post('/delrevieworg',{id});
    }
    static delAnswerOrg(id){
        return $api.post('/delanswerorg',{id});
    }
    static getUnreadReviewOrg(id){
        return $api.post('/getunreadrevieworg',{id});
    }
}