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

const ChatPage = observer(() => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [unread, setUnread] = useState([]);
    const [users, setUsers] = useState([]);
    const [recevier, setRecevier] = useState(localStorage.getItem('recevier'));
    const [recevierName, setRecevierName] = useState(localStorage.getItem('recevierName'));
    const {user} = useContext(Context);
    const {chat} = useContext(Context);

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
        //uploader.current  = new SocketIOFileClient(chat.socket)
        chat.socket.on("receive_message", (data) => {   
            setMessageList(data);
        });
        chat.socket.on("new_message", (data) => {   
            newMessage(data);
        })
        chat.socket.on("unread_message", (data) => {  
            //setUnread(data);
            chat.setUnread(data);
        })
        chat.socket.on("delete_message", (data) => {  
            newMessage(data);
        })
        chat.socket.emit("get_unread"); 
        localStorage.setItem('recevier', "");
        localStorage.setItem('recevierName', "")
        return ()=>{
            localStorage.setItem('recevier', "");
            localStorage.setItem('recevierName', "")
        }
    }    
    }, [user.user]); 

    const newMessage =(data)=>{
        console.log(data)
        const getMessage = {
            No:2,
            UserId: user.user.id,
            RecevierId:localStorage.getItem('recevier')
        }
        if(data.Author===localStorage.getItem('recevier')||data.Author===user.user.id){
            if(getMessage.RecevierId!==''){
                chat.socket.emit("get_message", getMessage); 
            }    
        } else {
            chat.socket.emit("get_unread");  
        }
    }
    
    useEffect(() => {
        UserService.fetchUsers().then((response)=>{
            if(response.status===200){
                setUsers(response.data)
            }            
        })
    }, []);

    const handleRecevier =(iD,name)=>{
        const data = {
            No:3,
            UserId: user.user.id,
            RecevierId: iD
        }
        localStorage.setItem('recevier', iD);
        localStorage.setItem('recevierName', name);
        setRecevier(iD)
        setRecevierName(name)
        chat.socket.emit("get_message", data);
        if(chat.getUnread()){
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
        if(chat.getUnread()){
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
        }else{
            return (<div></div>)
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
            return user.user.name.match(/\b(\w)/g)
        } else {
            return recevierName.match(/\b(\w)/g)
        }
    }

    return (
            <Container fluid>
                <Row className="overflow-auto">
                    <Col className="col-3"> 
                    <div className="userBox">
                        {users.map((item,index)=>{
                            if(item._id!==user.user.id){ 
                            return(<div key={index} className={item._id===recevier?"userCardChange":"userCard"} 
                             onClick={(e)=>handleRecevier(item._id,item.name)}>
                                            <div>{item.name}</div>
                                            <div>{item.nameOrg}</div>
                                            <div>{item.email}</div>
                                            {searchUnread(item._id)}
                            </div>)}
                        })}
                    </div>
                    </Col>
                    <Col className="col-9">
                        <div className="chat">
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
                                            {messageContent.Text} 
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
                                placeholder="Введите сообщение " 
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