import React,{useState,useEffect,useContext,useRef} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    InputGroup,
    Card,
    ListGroup,
  } from "react-bootstrap";
import {Envelope,Paperclip,X} from 'react-bootstrap-icons';
import {useHistory,NavLink,useLocation } from 'react-router-dom';
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import UserService from '../services/UserService';
import "../style.css";
import {Context} from "../index";
import {SocketContext} from "../App";
import {observer} from "mobx-react-lite";
import dateFormat, { masks } from "dateformat";
import waiting from "../waiting.gif";
import SocketIOFileClient from 'socket.io-file-client';
import {LOGIN_ROUTE} from "../utils/routes";

const ChatPage = observer(() => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [unread, setUnread] = useState([]);
    const messageBox = useRef(null)
    const userBox = useRef(null)
    const [users, setUsers] = useState([]);
    const [userPage, setUserPage] = useState(1);
    const [recevier, setRecevier] = useState(localStorage.getItem('recevier'));
    const [recevierName, setRecevierName] = useState(localStorage.getItem('recevierName'));
    const {user} = useContext(Context);
    const {chat} = useContext(Context);
    const history = useHistory();

    const inputEl = useRef(null);
    const fileInput = useRef(null);
    let formUpload = useRef(null);
    let uploader = useRef(null);

    const sendMessage = async () => {
    if (currentMessage !== "" && recevier!=="") {
      const messageData = {
        Author: user.user.id,
        Recevier: recevier, 
        Text: currentMessage,
        Date: new Date()
        };
      await chat.socket.emit("send_message", messageData);
      setMessageList(old=>[...old,messageData])
      setCurrentMessage("");
      inputEl.current.value = "";
        }
    };

    useEffect(() => {
        if (user.user.id!==undefined) {
        uploader.current  = new SocketIOFileClient(chat.socket)
        chat.socket.on("receive_message", (data) => {  
            chat.setTotalDocs(data.totalDocs)
            const reversed = data.docs.sort((a,b)=>{return new Date(a.Date) - new Date(b.Date)});
            setMessageList(reversed);
        });
        chat.socket.on("new_message", (data) => {   
            newMessage(data);
        })
        chat.socket.on("unread_message", (data) => {  
            if(chat.unread){
                const index = data.findIndex(item=>item.ID===localStorage.getItem('recevier'))
                if(index!==-1){
                    const newUnread = data;
                    newUnread[index]={ID:data.ID,count:0}
                    chat.setUnread(newUnread)
                } else {
                    chat.setUnread(data);
                }
                UserService.fetchUsers(8,userPage,user.user.id).then((response)=>{
                    if(response.status===200){
                        chat.totalPageUser = response.data.totalPages
                        chat.currentPageUser = response.data.page
                        setUsers(response.data.docs)
                    }            
                })
            }    
            
        })
        chat.socket.on("delete_message", (data) => {  
            newMessage(data);
        })
        chat.socket.emit("get_unread"); 
        localStorage.removeItem('recevier');
        localStorage.removeItem('recevierName')
        return ()=>{
            localStorage.removeItem('recevier');
            localStorage.removeItem('recevierName')
        }
    }    
    }, [user.user]); 

    useEffect(() => {
        if (messageBox && messageBox.current) {
            messageBox.current.addEventListener('scroll',scrollHandler,false);
        }
        if (userBox && userBox.current) {
            userBox.current.addEventListener('scroll',scrollHandlerUser,false);
        }
      })

    const scrollHandler = (e,list) =>{
        const getMessage = {
            No:2,
            UserId: user.user.id,
            RecevierId:localStorage.getItem('recevier')
        }
        if(e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight+1) {
            if(chat.limit<chat.totalDocs){
                chat.socket.emit("get_message", {...getMessage,page:1,limit:chat.limit}); 
                document.getElementById("chat").scrollTop = document.getElementById("chat").scrollTop - 1000
                chat.setLimit(chat.limit + 10)
            }
        }    
    }

    const scrollHandlerUser = (e) =>{
        if(e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight+1) {
            if(chat.currentPageUser<chat.totalPageUser){
                chat.currentPageUser = chat.currentPageUser + 1
                UserService.fetchUsers(8,userPage+1,user.user.id).then((response)=>{
                    if(response.status===200){
                        chat.totalDocsUser = response.data.totalDocs
                        setUsers(old=>[...old,...response.data.docs])  
                    }            
                })
            }
        }    
    }

    const newMessage =(data)=>{
        const getMessage = {
            No:2,
            UserId: user.user.id,
            RecevierId:localStorage.getItem('recevier')
        }
        if(data.Author===localStorage.getItem('recevier')||data.Author===user.user.id){
            if(getMessage.RecevierId!==''){
                chat.socket.emit("get_message", {...getMessage,limit:10}); 
            }    
        } else {
            chat.socket.emit("get_unread");  
        }
    }
    
    useEffect(() => {
        if(user.user.id!==undefined){
            UserService.fetchUsers(8,userPage,user.user.id).then((response)=>{
                if(response.status===200){
                    chat.totalPageUser = response.data.totalPages
                    chat.currentPageUser = response.data.page
                    setUsers(response.data.docs)
                }            
            })
    }
    }, [user.user]);

    const handleRecevier =(iD,name)=>{
        console.log(iD,name)
        const data = {
            No:3,
            UserId: user.user.id,
            RecevierId: iD
        }
        localStorage.setItem('recevier', iD);
        localStorage.setItem('recevierName', name);
        chat.setLimit(10);
        setRecevier(iD)
        setRecevierName(name)
        chat.socket.emit("get_message", {...data,limit:10});
        if(chat.unread){
            const index = chat.unread.findIndex(item=>item.ID===iD)
            if(index!==-1){
                const newUnread = chat.unread;
                newUnread[index]={ID:iD,count:0}
                chat.setUnread(newUnread)
            }
        }    
    }

    const searchUnread =(id)=>{
        let result = 0
        chat.unread.map((item)=>{
            if(item.ID===id){
                result = item.count;
            }
        })
        if (result!==0){
        return (
            <div className="unread">{result}</div>
        )} else {
            return (
                <div></div>
            )    
        }
    }
    if (chat.connected===false){
        return(
            <p className="waiting">
                <img height="320" src={waiting}/>
            </p>
        )
    }

    const upload = (e) => {
        //console.log(e.target.files);
        if(localStorage.getItem('userId')!==""&&localStorage.getItem('userId')!==""){
        uploader.current.upload(document.getElementById("myInput"), {
            data:{
                Author: localStorage.getItem('userId'),
                Recevier: localStorage.getItem('recevier'), 
                Date: new Date()
                }
        })};
    };
    const deleteMessage = (messageContent) => {
        console.log(messageContent);
        chat.socket.emit("delete_message", {...messageContent,iD:user.user.id});
    }

    const getAvatar=(author)=>{
        if(author===user.user.id){
            return user.user.name.match(/[A-Z]|[??-??]/g)
        } else {
            return recevierName.match(/[A-Z]|[??-??]/g)
        }
    }

    return (
            <Container fluid>
                <Row className="overflow-auto">
                    <Col className="col-3"> 
                    <div className="userBox" ref={userBox}>
                        {users?.map((item,index)=>{
                            return(<div key={index} className={item.contact._id===recevier?"userCardChange":"userCard"} 
                             onClick={(e)=>handleRecevier(item.contact._id,item.contact.name)}>
                                            <div>{item.contact.name}</div>
                                            <div>{item.contact.nameOrg}</div>
                                            {searchUnread(item.contact._id)}
                            </div>)
                        })}
                    </div>
                    </Col>
                    <Col className="col-9">
                        <div className="chat" id="chat"  ref={messageBox}>
                        <div className="messageBox">
                            {messageList.map((messageContent, index) => {
                                if(recevierName){
                                return (
                                <div key={index} >
                                    <table className="messageTable">
                                    <tbody>
                                        <tr>
                                            <td><div className="avatar"> 
                                            {getAvatar(messageContent.Author)} 
                                            </div></td>
                                            <td>
                                            <div className={messageContent.Author===user.user.id?"messageItem":"messageItemRecevier"}> 
                                            {messageContent.File ?  
                                            <img height="240" src={process.env.REACT_APP_API_URL + `download/` + messageContent.File}></img>
                                            :
                                            <div></div>
                                            }
                                            <div>{messageContent.Text}</div> 
                                        <div className="messageDate">
                                        <X color="red" 
                                         style={{"width": "20px",
                                        "height": "20px"}}
                                        onClick={(e)=>deleteMessage(messageContent)}/>   
                                            {dateFormat(messageContent.Date, "dd/mm/yyyy HH:MM:ss")}                                    
                                        </div> 
                                    </div> </td>
                                        </tr>
                                    </tbody>
                                     </table>     
                                </div> 
                                )};
                            })}
                        </div>
                        </div>
                        <InputGroup className="mt-3">
                                <label htmlFor="myInput">
                                <Paperclip type="file" color="blue"
                                    style={{"width": "50px",
                                    "height": "50px"}}/>
                                </label>
                                <input id="myInput" type="file"
                                ref={fileInput}   
                                onChange={upload}                         
                                accept="image/*"
                                style={{display:'none'}}
                                className="form-control"/>
                                <Form.Control as="textarea" 
                                rows={2} 
                                placeholder="?????????????? ?????????????????? " 
                                style={{marginRight:"15px"}}
                                ref={inputEl}
                                onChange={(event) => {
                                    setCurrentMessage(event.target.value);
                                  }}
                                  onKeyPress={(event) => {
                                    event.key === "Enter" && sendMessage();
                                }}/>
                                <div style={{display: "flex",
                                justifyContent:"center",
                                alignItems:"center"}}>
                                    <Envelope color="blue" 
                                    style={{"width": "50px",
                                    "height": "50px"}}
                                    onClick={sendMessage}/>
                                </div>
                         </InputGroup>
                    </Col>
                </Row>
            </Container>
    );
});

export default ChatPage;