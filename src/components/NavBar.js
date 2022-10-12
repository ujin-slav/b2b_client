import React, {useContext,useEffect,useState,useRef} from 'react';
import {Context} from "../index";
import {SocketContext} from "../App";
import {observer} from "mobx-react-lite";
import '../fontawesome.min.css';
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
        LENTSTATUS} from "../utils/routes";
import handShake from "../icons/handshake-o.svg";
import basketShop from "../icons/shopping-basket.svg";
import calc from "../icons/calculator.svg";
import calendar from "../icons/calendar.svg";
import quest from "../icons/question-circle.svg";
import {useHistory,NavLink,useLocation } from 'react-router-dom';
import { Container,Navbar,Nav, NavDropdown,Dropdown,NavItem } from "react-bootstrap";
import logo from '../b2blogo.png'
import profileLogo from '../profile.png'
import SocketIOFileClient from 'socket.io-file-client';
import io from "socket.io-client";
import QuestService from '../services/QuestService'; 
import faviconNewMessage from '../faviconNewMessage.ico'
import faviconStd from '../favicon.ico'
import QuestForMe from '../pages/QuestForMe';

const NavBar = observer(() => {

    const {user} = useContext(Context);
    const history = useHistory();
    const {myalert} = useContext(Context);
    const currentRoute = useHistory().location.pathname.toLowerCase();
    const [blink,setBlink]=useState(false);
    const [countquest,setCountQuest]=useState();
    const [countchat,setCountChat]=useState([]);
    const {chat} = useContext(Context);
    const location = useLocation(); 

    useEffect(() => {
        QuestService.getUnreadQuest(user.user.id).then((response)=>{
            if(response.status===200){
                setCountQuest(response.data)
            }                
        })
      },[location]);

    const activeLink=(route)=>{
        history.push(route);
    }  

    const setFavicon=(num)=> {
        let sumChat=0;
        if(chat.unread.length>0){
            chat.unread.map(item=>sumChat=sumChat+item.count);
        }
        if(sumChat===0&&chat.questUnread===0){
            const favicon = document.getElementById("favicon");
            favicon.href = faviconStd
            return
        } 
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

    const sumInvited=()=>{
        if(chat.invitedUnread > 0){
            return chat.invitedUnread
        }else{
            return ""
        } 
    }
    const sumInvitedPrice=()=>{
        if(chat.invitedPriceUnread > 0){
            return chat.invitedPriceUnread
        }else{
            return ""
        } 
    }

    const sumInvitedSpecOffers=()=>{
        if(chat.specOfferAskUnread > 0){
            return chat.specOfferAskUnread
        }else{
            return ""
        } 
    }
    const classNameLink=(route)=>{
        return location.pathname===route ? "activeLink" : ""
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
                <NavDropdown title="Мои">
                <div className="dropdown-menu-wrapper">
                    <div>
                      <ul>
                        <li className="dropdown-header">
                          <div className="menu-icon-wrapper">
                            <div><img className="awesomeIcon" src={handShake}/></div>
                            <div><b>&nbsp;&nbsp;Заявки</b></div>
                          </div>
                        </li>
                        <li className="job-sub-tabs"><NavDropdown.Item onClick={()=>activeLink(MYORDERS)}className={classNameLink(MYORDERS)}>Мои заявки</NavDropdown.Item></li>
                        <li className="job-sub-tabs"><NavDropdown.Item onClick={()=>activeLink(MYOFFERS)}className={classNameLink(MYOFFERS)}>Мои предложения</NavDropdown.Item></li>
                        <li className="job-sub-tabs"><NavDropdown.Item onClick={()=>activeLink(MYCONTR)}className={classNameLink(MYCONTR)}>Мои контрагенты</NavDropdown.Item></li>
                        <li className="job-sub-tabs"><NavDropdown.Item onClick={()=>activeLink(INVITED)}className={classNameLink(INVITED)}>
                        <div className="parentAnswer" id="invited">
                           <div>Мои приглашения</div>
                           <div className="countQuest">
                               <div className='yellowtext'>{sumInvited()}</div>
                           </div>
                        </div>
                        </NavDropdown.Item></li>
                      </ul>
                    </div>
                    <div>
                      <ul>
                        <li className="dropdown-header">
                          <div className="menu-icon-wrapper">
                            <div><img className="awesomeIcon" src={basketShop}/></div>
                            <div><b>&nbsp;&nbsp;Спец. предложения</b></div>
                          </div>
                        </li>
                        <li className="job-sub-tabs"> <NavDropdown.Item onClick={()=>activeLink(MYSPECOFFERS)}className={classNameLink(MYSPECOFFERS)}>Мои специальные предложения</NavDropdown.Item></li>
                        <li className="job-sub-tabs"> 
                        <NavDropdown.Item onClick={()=>activeLink(INVITEDSPECOFFER)}className={classNameLink(INVITEDSPECOFFER)}>
                        <div className="parentAnswer">
                           <div>Мне заказали по спец. предложению</div>
                           <div className="countQuest">
                               <div className='yellowtext'>{sumInvitedSpecOffers()}</div>
                           </div>
                        </div>
                        </NavDropdown.Item></li>
                      </ul>
                    </div>
                    <div>
                      <ul>
                        <li className="dropdown-header">
                          <div className="menu-icon-wrapper">
                            <div><img className="awesomeIcon" src={calc}/></div>
                            <div><b>&nbsp;&nbsp;Прайс-листы</b></div>
                          </div>
                        </li>
                        <li className="job-sub-tabs"><NavDropdown.Item onClick={()=>activeLink(MYPRICE)}className={classNameLink(MYPRICE)}>Мой прайс</NavDropdown.Item></li>
                        <li className="job-sub-tabs"><NavDropdown.Item onClick={()=>activeLink(UPLOADPRICE)}className={classNameLink(UPLOADPRICE)}>Загрузить прайс</NavDropdown.Item></li>
                        <li className="job-sub-tabs"> <NavDropdown.Item onClick={()=>activeLink(MYORDERSPRICE)}className={classNameLink(MYORDERSPRICE)}>Я заказывал по прайсу</NavDropdown.Item></li>
                        <li className="job-sub-tabs"> <NavDropdown.Item onClick={()=>activeLink(INVITEDPRICE)}className={classNameLink(INVITEDPRICE)}>
                        <div className="parentAnswer">
                           <div>Мне заказали по прайсу</div>
                           <div className="countQuest">
                               <div className='yellowtext'>{sumInvitedPrice()}</div>
                           </div>
                        </div>
                        </NavDropdown.Item></li>
                      </ul>
                    </div>
                    {/* <div>
                      <ul>
                        <li className="dropdown-header">
                          <div className="menu-icon-wrapper">
                            <div><img className="awesomeIcon" src={quest}/></div>
                            <div><b>&nbsp;&nbsp;Вопросы</b></div>
                          </div>
                        </li>
                        <li className="job-sub-tabs"><NavDropdown.Item onClick={()=>activeLink(QUESTFROMME)}className={classNameLink(QUESTFROMME)}>Вопросы от меня</NavDropdown.Item></li>
                        <li className="job-sub-tabs"> 
                        <NavDropdown.Item onClick={()=>activeLink(QUESTFORME)}className={classNameLink(QUESTFORME)}>
                        <div className="parentAnswer">
                           <div>Вопросы для меня</div>
                           <div className="countQuest">{sumUnreadQuest()}</div>
                        </div>
                        </NavDropdown.Item>
                        </li>
                      </ul>
                    </div> */}
                    <div>
                      <ul>
                        <li className="dropdown-header">
                          <div className="menu-icon-wrapper">
                            <div><img className="awesomeIcon" src={calendar}/></div>
                            <div><b>&nbsp;&nbsp;События</b></div>
                          </div>
                        </li>
                        <li className="job-sub-tabs">
                            <NavDropdown.Item  onClick={()=>activeLink(LENTSTATUS)}className={classNameLink(LENTSTATUS)}>
                                Cтатус заявок
                            </NavDropdown.Item>
                        </li>
                      </ul>
                    </div>
                 </div>
                </NavDropdown>
                <div className="parentAnswer myNoti">
                       <div className="countQuest">{sumInvited()+sumInvitedPrice()}</div>
                </div>
                <Nav.Link onClick={()=>activeLink(CHAT)}className={classNameLink(CHAT)}>
                <div className="parentAnswer">
                       <div>Сообщения</div>
                       <div className="countQuest">{sumUnread()}</div>
                    </div>
                </Nav.Link>
                <Nav.Link onClick={()=>activeLink(PRICES)}className={classNameLink(PRICES)}>Прайс</Nav.Link>
                <Nav.Link onClick={()=>activeLink(HELP)}className={classNameLink(HELP)}>Помощь</Nav.Link>
                <Nav.Link onClick={()=>activeLink(ABOUT)}className={classNameLink(ABOUT)}>О сервисе</Nav.Link>
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