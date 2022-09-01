export const checkAccessAsk = (user,ask) => { 
    let askActive = Date.parse(ask?.EndDateOffers) > new Date().getTime() && !ask.Winner
    let privateAsk = ask?.Private

    if(user?.isAuth===false){
        let result = {
            Open : !privateAsk,
            AddQuestAsk : false,
            AddOffer    : false
        }
        return result
    }
    if(user?.user.id===ask?.Author?._id){
        let result = {
            Open : true,
            AddQuestAsk : false,
            AddOffer    : false
        }
        return result
    }
    if(ask?.Party?.findIndex(el => el.Email === user.user.email)!==-1){
        let result = {
            Open : true,
            AddQuestAsk : askActive,
            AddOffer    : askActive
        }
        return result
    } 
    return {
        Open : !privateAsk,
        AddQuestAsk : askActive,
        AddOffer    : askActive
    }
}    