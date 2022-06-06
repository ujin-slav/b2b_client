import React, {useContext,useEffect,useState,useRef} from 'react';
import {Context} from "../index";
import {SocketContext} from "../App";
import {observer} from "mobx-react-lite";
import {LOGIN_ROUTE,CREATEASK, MYORDERS, MYOFFERS,B2B_ROUTE,HELP, MYCONTR,CHAT,QUEST, ABOUT} from "../utils/routes";
import {useHistory,NavLink,useLocation } from 'react-router-dom';
import { Button,Navbar,Nav, NavDropdown } from "react-bootstrap";
import logo from '../b2blogo.png'
import profileLogo from '../profile.png'
import SocketIOFileClient from 'socket.io-file-client';
import io from "socket.io-client";
import QuestService from '../services/QuestService'; 
import faviconNewMessage from '../faviconNewMessage.ico'
import faviconStd from '../favicon.ico'

const NavBar = observer(() => {

    const {user} = useContext(Context);
    const history = useHistory();
    const {myalert} = useContext(Context);
    const currentRoute = useHistory().location.pathname.toLowerCase();
    const [active,setActive]=useState();
    const [blink,setBlink]=useState(false);
    const [countquest,setCountQuest]=useState();
    const [countchat,setCountChat]=useState([]);
    const {chat} = useContext(Context);

    useEffect(() => {
        QuestService.getUnreadQuest(user.user.id).then((response)=>{
            if(response.status===200){
                setCountQuest(response.data)
            }                
        })
      },[]);

    const activeLink=(route)=>{
        history.push(route);
        setActive(route);
    }  

    const setFavicon=(num)=> {
            setTimeout(()=>{
                if(num===1){
                    const favicon = document.getElementById("favicon");
                    favicon.href = faviconNewMessage
                    setFavicon(2)
                }else{
                    const favicon = document.getElementById("favicon");
                    favicon.href = faviconStd
                    setFavicon(1)
                }
            },1000)
        
    }

    const sumUnread=()=>{
        let sum=0;
        if(chat.unread.length>0){
            chat.unread.map(item=>sum=sum+item.count);
        } 
        if(sum>0){
            setFavicon(1)
            return sum;
        }else{
            return "";
        }
    }
    
    const sumUnreadQuest=()=>{
        if(chat.questUnread > 0){
            setFavicon()
            return chat.questUnread
        }else{
            return ""
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
                    <NavDropdown title="Мои">
                        <NavDropdown.Item onClick={()=>activeLink(MYORDERS)}className={active===MYORDERS ? "active" : ""}>Мои заявки</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(MYOFFERS)}className={active===MYOFFERS ? "active" : ""}>Мои предложения</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(MYCONTR)}className={active===MYCONTR ? "active" : ""}>Мои контрагенты</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link onClick={()=>activeLink(CHAT)}className={active===CHAT ? "active" : ""}>
                    <div className="parentAnswer">
                           <div>Сообщения</div>
                           <div className="countQuest">{sumUnread()}</div>
                        </div>
                    </Nav.Link>
                    <Nav.Link onClick={()=>activeLink(QUEST)}className={active===QUEST ? "active" : ""}>
                        <div className="parentAnswer">
                           <div>Вопрос-ответ</div>
                           <div className="countQuest">{sumUnreadQuest()}</div>
                        </div>
                    </Nav.Link>
                    <Nav.Link onClick={()=>activeLink(HELP)}className={active===HELP ? "active" : ""}>Помощь</Nav.Link>
                    <Nav.Link onClick={()=>activeLink(ABOUT)}className={active===ABOUT ? "active" : ""}>О сервисе</Nav.Link>
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