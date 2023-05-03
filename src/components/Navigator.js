import React,{useEffect,useState,useContext} from 'react';
import {useLocation } from 'react-router-dom';
import {LOGIN_ROUTE,
    CREATEASK, 
    MYORDERS, 
    MYOFFERS,
    B2B_ROUTE,
    HELP,
    MYCONTR,
    CHAT,
    QUEST, 
    ABOUT,
    INVITED,
    UPLOADPRICE,
    MYORDERSPRICE, 
    MYPRICE,
    PRICES, 
    INVITEDPRICE,
    MYSPECOFFERS,
    INVITEDSPECOFFER,
    QUESTFROMME,
    QUESTFORME,
    LENTSTATUS,
    REVIEWABOUTME,
    REVIEWWRITEME,
    INVITEDPRICEFIZ,
    IWINNER} from "../utils/routes";
import {Context} from "../index";
import {observer} from "mobx-react-lite";


const Navigator =  observer(() => {
    const paths = [
        {
            path: MYORDERS,
            label: "Мои заявки",
            menuPart: "Заявки"
        },
        {
            path: MYOFFERS,
            label: "Мои предложения",
            menuPart: "Заявки"
        },
        {
            path: MYCONTR,
            label: "Мои контрагенты",
            menuPart: "Заявки"
        },
        {
            path: INVITED,
            label: "Мои приглашения",
            menuPart: "Заявки"
        },
        {
            path: IWINNER,
            label: "Я победил",
            menuPart: "Заявки"
        },
        {
            path: MYPRICE,
            label: "Мой прайс",
            menuPart: "Прайс-листы"
        },
        {
            path: UPLOADPRICE,
            label: "Загрузить прайс",
            menuPart: "Прайс-листы"
        },
        {
            path: UPLOADPRICE,
            label: "Загрузить прайс",
            menuPart: "Прайс-листы"
        },
        {
            path: MYORDERSPRICE,
            label: "Я заказывал по прайсу",
            menuPart: "Прайс-листы"
        },
        {
            path: MYORDERSPRICE,
            label: "Я заказывал по прайсу",
            menuPart: "Прайс-листы"
        },
        {
            path: INVITEDPRICE,
            label: "Мне заказали по прайсу",
            menuPart: "Прайс-листы"
        },
        {
            path: INVITEDPRICEFIZ,
            label: "Заказы физ.лиц",
            menuPart: "Прайс-листы"
        },
        {
            path: LENTSTATUS,
            label: "Статус заявок",
            menuPart: "События"
        },
        {
            path: MYSPECOFFERS,
            label: "Мои специальные предложения",
            menuPart: "Спец. предложения"
        },
        {
            path: HELP,
            label: "Помощь",
            menuPart: "О сервисе"
        },
        {
            path: ABOUT,
            label: "О сервисе",
            menuPart: "О сервисе"
        },
        {
            path: REVIEWABOUTME,
            label: "Обо мне",
            menuPart: "Отзывы"
        },
        {
            path: REVIEWWRITEME,
            label: "Написаны мной",
            menuPart: "Отзывы"
        },
    ]

    const location = useLocation();
    const [label,setLabel] = useState() 
    const {user} = useContext(Context);

    useEffect(()=>{
        let searchResult = paths.find(item => item.path === location.pathname)
        if(searchResult){
            setLabel(searchResult)
        }else{
            setLabel()
        }
    },[location.pathname])

    return (
        <div>
            {label && user.isAuth? 
                <div className='mt-2 mx-4 navigator'>
                    Меню {'>'} {label.menuPart} {'>'} {label.label} 
                </div>
            :
                <div></div>
            }
        </div>
    );
});

export default Navigator;