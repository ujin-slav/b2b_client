import React, {useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {SocketContext} from "../App";
import {observer} from "mobx-react-lite";
import {LOGIN_ROUTE,CREATEASK, MYORDERS, MYOFFERS,B2B_ROUTE,HELP, MYCONTR,CHAT,QUEST, ABOUT} from "../utils/routes";
import {useHistory,NavLink,useLocation } from 'react-router-dom';
import {Navbar,Nav} from "react-bootstrap";
import logo from '../b2blogo.png'
import profileLogo from '../profile.png'
import SocketIOFileClient from 'socket.io-file-client';
import io from "socket.io-client";
import QuestService from '../services/QuestService'; 

import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {

    const {user} = useContext(Context);
    const history = useHistory();
    const {myalert} = useContext(Context);
    const currentRoute = useHistory().location.pathname.toLowerCase();
    const [active,setActive]=useState();
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
        <Navbar collapseOnSelect expand={false} bg="dark" variant="dark">
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
                    <Nav.Link onClick={()=>activeLink(HELP)}className={active===HELP ? "active" : ""}>Помощь</Nav.Link>
                    <Nav.Link onClick={()=>activeLink(ABOUT)}className={active===ABOUT ? "active" : ""}>О сервисе</Nav.Link>
                </Nav>
        
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
           
            <Nav>
              <Nav.Link href="#deets">More deets</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Dank memes
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }