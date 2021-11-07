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
import {observer} from "mobx-react-lite";
import dateFormat, { masks } from "dateformat";
import waiting from "../waiting.gif";
import SocketIOFileClient from 'socket.io-file-client';

const ChatPage = observer(() => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [unread, setUnread] = useState([]);
    const [users, setUsers] = useState([]);
    const [recevier, setRecevier] = useState();
    const [recevierName, setRecevierName] = useState();
    const {user} = useContext(Context);
    const {chat} = useContext(Context);
    const data = new FormData();

    const inputEl = useRef(null);
    const fileInput = useRef(null);
    let socket = useRef(null);
    let uploader = useRef(null);

    const sendMessage = async () => {
    if (currentMessage !== "" && recevier!=="") {
      const messageData = {
        Author: user.user.id,
        Recevier: recevier, 
        Text: currentMessage,
        Date: new Date()
        };
      await socket.current.emit("send_message", messageData);
      setMessageList(old=>[...old,messageData])
      setCurrentMessage("");
      inputEl.current.value = "";
        }
    };

    useEffect(() => {
        if (user.user.id!==undefined) {
        socket.current = io(`http://localhost:5000?userId=${user.user.id}`);
        uploader.current = new SocketIOFileClient(socket.current);
        socket.current.on("receive_message", (data) => {   
            setMessageList(data);
        });
        socket.current.on("new_message", (data) => {   
            newMessage(data);
        })
        socket.current.on("unread_message", (data) => {  
            setUnread(data);
        })
        socket.current.emit("get_unread"); 
        localStorage.setItem('userId', user.user.id);
        localStorage.setItem('recevier', "");
        localStorage.setItem('recevierName', "");
    }    
    }, [user.user]);

    useEffect(() => {
        return () => {
            socket.current.disconnect();
        };
    }, []);   

    const newMessage =(data)=>{
        const getMessage = {
            UserId: user.user.id,
            RecevierId:localStorage.getItem('recevier')
        }
        if(data.Author===localStorage.getItem('recevier')||data.Recevier===user.user.id){
            socket.current.emit("get_message", getMessage); 
        } else {
            socket.current.emit("get_unread");  
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
            UserId: user.user.id,
            RecevierId: iD
        }
        localStorage.setItem('recevier', iD);
        localStorage.setItem('recevierName', name);
        setRecevier(iD)
        setRecevierName(name)
        socket.current.emit("get_message", data);
        const index = unread.findIndex(item=>item.ID===iD)
        if(index!==-1){
            const newUnread = unread;
            newUnread[index]={ID:iD,count:0}
            setUnread(newUnread)
        }
    }

    const searchUnread =(id)=>{
        let result = 0
        unread.map((item)=>{
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
    if (!socket.current){
        return(
            <p className="waiting">
                <img height="320" src={waiting}/>
            </p>
        )
    }

    const onInputChange = (e) => {
        uploader.current.upload(document.getElementById("myInput"), {
            data:{
                Author: user.user.id,
                Recevier: recevier, 
                Date: new Date()
                }
        });
    };
    const deleteMessage = (messageContent) => {
        socket.current.emit("delete_message", messageContent._id);
        setMessageList(messageList.filter(item=>item._id!==messageContent._id))
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
                                <table className="messageTable">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>{item.name}</div>
                                            <div>{item.nameOrg}</div>
                                            <div>{item.email}</div>
                                        </td>
                                        <td>
                                            {searchUnread(item._id)}
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
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
                                            {messageContent.Author===localStorage.getItem('userId')?user.user.name.match(/\b(\w)/g):recevierName.match(/\b(\w)/g)}    
                                            </div></td>
                                            <td>
                                            <div className={messageContent.Author===localStorage.getItem('userId')?"messageItem":"messageItemRecevier"}> 
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
                                    onClick={onInputChange}
                                    style={{"width": "50px",
                                    "height": "50px"}}/>
                                </label>
                                <input id="myInput" type="file"
                                ref={fileInput}
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