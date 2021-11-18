import React, {useContext,useEffect,useState,useRef} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {LOGIN_ROUTE,CREATEASK, MYORDERS, MYOFFERS,B2B_ROUTE,CATORG, MYCONTR,CHAT,QUEST} from "../utils/routes";
import {useHistory,NavLink,useLocation } from 'react-router-dom';
import { Button,Navbar,Nav, Alert } from "react-bootstrap";
import logo from '../b2blogo.png'
import profileLogo from '../profile.png'
import SocketIOFileClient from 'socket.io-file-client';
import io from "socket.io-client";

const NavBar = observer(() => {

    const {user} = useContext(Context);
    const history = useHistory();
    const {myalert} = useContext(Context);
    const currentRoute = useHistory().location.pathname.toLowerCase();
    const [active,setActive]=useState();
    const [countquest,setCountQuest]=useState();
    const {socket} =  useContext(Context)
    let socketRef = useRef(null);
    let uploader = useRef(null);

    useEffect(() => {
        socket.setSocket(io(`http://localhost:5000?userId=${user.user.id}`));
        socket.setUploader(new SocketIOFileClient(socket.getSocket()));
        socketRef.current = socket.getSocket();
        socketRef.current.on("unread_quest", (data) => {   
            console.log(data);
        });
      },[]);

      useEffect(() => {
        return () => {
            if(socketRef.current){
               socketRef.current.disconnect(); 
            }
        };
    }, []);   

    const activeLink=(route)=>{
        history.push(route);
        setActive(route);
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
                    <Nav.Link onClick={()=>activeLink(CHAT)}className={active===CHAT ? "active" : ""}>Чат</Nav.Link>
                    <Nav.Link onClick={()=>activeLink(QUEST)}className={active===QUEST ? "active" : ""}>{countquest}Вопрос-ответ</Nav.Link>
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