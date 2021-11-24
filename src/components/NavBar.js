import React, {useContext,useEffect,useState,useRef} from 'react';
import {Context} from "../index";
import {SocketContext} from "../App";
import {observer} from "mobx-react-lite";
import {LOGIN_ROUTE,CREATEASK, MYORDERS, MYOFFERS,B2B_ROUTE,CATORG, MYCONTR,CHAT,QUEST} from "../utils/routes";
import {useHistory,NavLink,useLocation } from 'react-router-dom';
import { Button,Navbar,Nav, Alert } from "react-bootstrap";
import logo from '../b2blogo.png'
import profileLogo from '../profile.png'
import SocketIOFileClient from 'socket.io-file-client';
import io from "socket.io-client";
import QuestService from '../services/QuestService'; 

const NavBar = observer(() => {

    const {user} = useContext(Context);
    const history = useHistory();
    const {myalert} = useContext(Context);
    const currentRoute = useHistory().location.pathname.toLowerCase();
    const [active,setActive]=useState();
    const [countquest,setCountQuest]=useState();
    const [countchat,setCountChat]=useState([]);
    const {socket} =  useContext(SocketContext)
    const {chat} = useContext(Context);

    useEffect(() => {
        QuestService.getUnreadQuest(user.user.id).then((response)=>{
            if(response.status===200){
                setCountQuest(response.data)
            }                
        })
        socket.on("unread_message", (data) => {   
            chat.setUnread(data)
        });
        socket.on("get_unread_quest", (data) => {   
            chat.setQuestUnread(data)
        });
      },[]);

    const activeLink=(route)=>{
        history.push(route);
        setActive(route);
    }  

    const sumUnread=()=>{
        let sum=0;
        if(chat.unread.length>0){
            chat.unread.map(item=>sum=sum+item.count);
        } 
        if(sum>0){
            return sum;
        }else{
            return "";
        }
    }
    
    return (
        <div>
            <Navbar bg="dark" variant="dark">
            <div className="navbar-collapse collapse justify-content-stretch" id="navbar6">
                <NavLink to="/">
                    <img
                        src={logo}
                        width="50"
                        height="50"
                        className="d-inline-block align-top"
                        alt = ""
                    />
                </NavLink >
                <Nav className="me-auto">
                    <Nav.Link onClick={()=>activeLink(B2B_ROUTE)} className="generalLink">Главная</Nav.Link>
                    <Nav.Link onClick={()=>activeLink(CREATEASK)}className={active===CREATEASK ? "active" : ""}>Создать заявку</Nav.Link>
                    <Nav.Link onClick={()=>activeLink(MYORDERS)}className={active===MYORDERS ? "active" : ""}>Мои заявки</Nav.Link>
                    <Nav.Link onClick={()=>activeLink(MYOFFERS)}className={active===MYOFFERS ? "active" : ""}>Мои предложения</Nav.Link>
                    <Nav.Link onClick={()=>activeLink(MYCONTR)}className={active===MYCONTR ? "active" : ""}>Мои контрагенты</Nav.Link>
                    <Nav.Link onClick={()=>activeLink(CATORG)}className={active===CATORG ? "active" : ""}>Справочник организаций</Nav.Link>
                    <Nav.Link onClick={()=>activeLink(CHAT)}className={active===CHAT ? "active" : ""}>
                    <div className="parentAnswer">
                           <div>Сообщения</div>
                           <div className="countQuest">{sumUnread()}</div>
                        </div>
                    </Nav.Link>
                    <Nav.Link onClick={()=>activeLink(QUEST)}className={active===QUEST ? "active" : ""}>
                        <div className="parentAnswer">
                           <div>Вопрос-ответ</div>
                           <div className="countQuest">{chat.questUnread > 0 ? chat.questUnread : "" }</div>
                        </div>
                    </Nav.Link>
                </Nav>
            </div>
            <NavLink to="/profile">
            <img
                        src={profileLogo}
                        width="50"
                        height="50"
                        className="d-inline-block align-top"
                        alt = ""
                    />
            </NavLink>
            <div className="navbar-nav ml-auto">
                <Nav className="me-auto">
                    {user.isAuth?
                        <Nav.Link onClick={()=>user.logout()} className="generalLink">Выйти</Nav.Link>
                    :
                        <Nav.Link onClick={()=>history.push(LOGIN_ROUTE)} className="generalLink">Войти</Nav.Link>     
                    }  
                </Nav>
            </div>
            </Navbar>
        </div>    

    );
});

export default NavBar;