import React, {useContext,useEffect,useState,useRef} from 'react';
import {Context} from "../index";
import {SocketContext} from "../App";
import {observer} from "mobx-react-lite";
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
        QUESTFORME} from "../utils/routes";
import {useHistory,NavLink,useLocation } from 'react-router-dom';
import { Button,Navbar,Nav, NavDropdown } from "react-bootstrap";
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
        console.log("sum inv" + chat.invitedPriceUnread )
        if(chat.invitedPriceUnread > 0){
            return chat.invitedPriceUnread
        }else{
            return ""
        } 
    }

    const sumInvitedSpecOffers=()=>{
        console.log("sum offer ask" + chat.invitedPriceUnread )
        if(chat.specOfferAskUnread > 0){
            return chat.specOfferAskUnread
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
                    <Nav.Link onClick={()=>activeLink(B2B_ROUTE)} className="generalLink">??????????????</Nav.Link>
                    <NavDropdown title="??????">
                        <NavDropdown.Item onClick={()=>activeLink(MYORDERS)}className={active===MYORDERS ? "active" : ""}>?????? ????????????</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(MYOFFERS)}className={active===MYOFFERS ? "active" : ""}>?????? ??????????????????????</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(MYCONTR)}className={active===MYCONTR ? "active" : ""}>?????? ??????????????????????</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(INVITED)}className={active===INVITED ? "active" : ""}>
                        <div className="parentAnswer" id="invited">
                           <div>?????? ??????????????????????</div>
                           <div className="countQuest">
                               <div className='yellowtext'>{sumInvited()}</div>
                           </div>
                        </div>
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(MYPRICE)}className={active===MYPRICE ? "active" : ""}>?????? ??????????</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(UPLOADPRICE)}className={active===UPLOADPRICE ? "active" : ""}>?????????????????? ??????????</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(INVITEDPRICE)}className={active===INVITEDPRICE ? "active" : ""}>
                        <div className="parentAnswer">
                           <div>?????? ???????????????? ???? ????????????</div>
                           <div className="countQuest">
                               <div className='yellowtext'>{sumInvitedPrice()}</div>
                           </div>
                        </div>
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(INVITEDSPECOFFER)}className={active===INVITEDSPECOFFER ? "active" : ""}>
                        <div className="parentAnswer">
                           <div>?????? ???????????????? ???? ????????. ??????????????????????</div>
                           <div className="countQuest">
                               <div className='yellowtext'>{sumInvitedSpecOffers()}</div>
                           </div>
                        </div>
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(QUESTFORME)}className={active===QUEST ? "active" : ""}>
                        <div className="parentAnswer">
                           <div>?????????????? ?????? ????????</div>
                           <div className="countQuest">{sumUnreadQuest()}</div>
                        </div>
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(QUESTFROMME)}className={active===INVITEDPRICE ? "active" : ""}>?????????????? ???? ????????</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(MYORDERSPRICE)}className={active===MYORDERSPRICE ? "active" : ""}>?? ?????????????????? ???? ????????????</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>activeLink(MYSPECOFFERS)}className={active===MYSPECOFFERS ? "active" : ""}>?????? ?????????????????????? ??????????????????????</NavDropdown.Item>
                    </NavDropdown>
                    <div className="parentAnswer myNoti">
                           <div className="countQuest">{sumInvited()+sumInvitedPrice()}</div>
                    </div>
                    <Nav.Link onClick={()=>activeLink(CHAT)}className={active===CHAT ? "active" : ""}>
                    <div className="parentAnswer">
                           <div>??????????????????</div>
                           <div className="countQuest">{sumUnread()}</div>
                        </div>
                    </Nav.Link>
                    <Nav.Link onClick={()=>activeLink(PRICES)}className={active===PRICES ? "active" : ""}>??????????</Nav.Link>
                    <Nav.Link onClick={()=>activeLink(HELP)}className={active===HELP ? "active" : ""}>????????????</Nav.Link>
                    <Nav.Link onClick={()=>activeLink(ABOUT)}className={active===ABOUT ? "active" : ""}>?? ??????????????</Nav.Link>
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
                        <Nav.Link onClick={()=>user.logout()} className="generalLink">??????????</Nav.Link>
                    :
                        <Nav.Link onClick={()=>history.push(LOGIN_ROUTE)} className="generalLink">??????????</Nav.Link>     
                    }  
                </Nav>
            </div>
            </Navbar>
        </div>    

    );
});

export default NavBar;