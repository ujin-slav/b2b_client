import React from 'react';

const AskStatus = ({EndDateOffers,Winner}) => {
    if(Winner){
        return (
            <div style={{color:"red"}}>
                Завершена
            </div>
        )
    }
    if(Date.parse(EndDateOffers) > new Date().getTime()){
        return (
            <div style={{color:"green"}}>
                Активная
            </div>
        )
    }else{
        return (
            <div style={{color:"red"}}>
                Истек срок
            </div>
        )
    }
};

export default AskStatus;