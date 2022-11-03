import React,{useState,useEffect,useContext,useRef} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    ProgressBar,
    InputGroup,
  } from "react-bootstrap";
import {Envelope,Paperclip,X,Search,XLg,Eye} from 'react-bootstrap-icons';
import {useHistory} from 'react-router-dom';
import ScrollToBottom from "react-scroll-to-bottom";
import UserService from '../services/UserService';
import ChatService from '../services/ChatService';
import MessageService from '../services/MessageService';
import "../style.css";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import dateFormat, { masks } from "dateformat";
import waiting from "../waiting.gif";
import SocketIOFileClient from 'socket.io-file-client';

const ChatPage = observer(() => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [progress, setProgress] = useState(0);
    const [searchMessage, setSearchMessage] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const messageBox = useRef(null)
    const {myalert} = useContext(Context);
    const userBox = useRef(null)
    const [fetching,setFetching] = useState(true) 
    const [fetchingMessage,setFetchingMessage] = useState(false)

    const [totalDocsMessage,setTotalDocsMessage] = useState(0) 
    const [currentPageMessage,setCurrentPageMessage] = useState(1)
    const [totalDocsUser,setTotalDocsUser] = useState(0) 
    const [currentPageUser,setCurrentPageUser] = useState(1)
    const [contacts,setContacts] = useState([])

    const [recevier, setRecevier] = useState(localStorage.getItem('recevier'));
    const [recevierName, setRecevierName] = useState(localStorage.getItem('recevierName'));
    const {user} = useContext(Context);
    const {chat} = useContext(Context);
    const history = useHistory();

    const inputEl = useRef(null);
    const fileInput = useRef(null);
    let formUpload = useRef(null);
    let uploader = useRef(null);
    let limitUser = 4
    let limitMessage = 4
    let scrollTopChat = 0

    const sendMessage = async () => {
    if (currentMessage !== "" && recevier!=="") {
      const messageData = {
        Author: user.user.id,
        Recevier: recevier, 
        Text: currentMessage,
        Date: new Date()
        };
      await chat.socket.emit("send_message", messageData);
      chat.setMessageList(old=>[...old,messageData])
      setCurrentMessage("");
      inputEl.current.value = "";
        }
    };

    useEffect(() => {
        if (user.user.id!==undefined) {
        chat.socket.on("receive_message", (data) => {  
            setTotalDocsMessage(data.totalDocs)
            const reversed = data.docs.sort((a,b)=>{return new Date(a.Date) - new Date(b.Date)});
            chat.setMessageList(reversed);
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
                UserService.fetchUsers({limit:8,page:1,user:user.user.id,search:searchUser})
                .then((response)=>{
                    if(response.status===200){
                        setTotalDocsUser(response.data.totalDocs)
                        setCurrentPageUser(currentPageUser + 1)
                        setContacts(response.data.docs)
                    }            
                })
            }    
            
        })
        chat.socket.on("delete_message", (data) => {  
            newMessage(data);
        })
        chat.socket.on("user_disconnected", (data) => { 
            let newUsers = contacts.map((item)=>{
                if(item.contact._id===data){
                    item.statusLine = false
                    item.lastVisit = new Date()
                }
                return item 
            })
            setContacts(newUsers)
        })
        chat.socket.on("user_connected", (data) => { 
            let newUsers = contacts.map((item)=>{
                if(item.contact._id===data){
                    item.statusLine = true
                }
                return item 
            })
            setContacts(newUsers)
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
            messageBox.current.addEventListener('scroll',scrollHandler,false)
            limitMessage = Math.ceil(messageBox.current.clientHeight / 86)
        }
        if (userBox && userBox.current) {
            userBox.current.addEventListener('scroll',scrollHandlerUser,false)
            limitUser = Math.ceil(userBox.current.clientHeight / 76)
        }
    },[messageBox.current,userBox.current])

    const scrollHandler = (e) =>{
        if((e.target.scrollHeight - e.target.offsetHeight)<e.target.scrollTop+1){
            const data = {
                No:2,
                UserId: user.user.id,
                RecevierId:localStorage.getItem('recevier'),
                SearchText: searchMessage
            }
            if(chat.messageList.length < chat.totalDocsMessage){
                MessageService.getMessage({...data,limit:10,page:chat.currentPageMessage})
                .then((response)=>{
                    chat.totalDocsMessage=response.data.totalDocs
                    chat.currentPageMessage=chat.currentPageMessage+1
                    const reversed = response.data.docs.sort((a,b)=>{return new Date(a.Date) - new Date(b.Date)});
                    chat.setMessageList([...reversed,...chat.messageList])
                    messageBox.current.scrollTo(0,messageBox.current.scrollHeight - 86)
                }).finally((data)=>chat.setFetchingMessage(false))
            }
        } 
    }

    const scrollHandlerUser = (e) =>{
        if((e.target.scrollHeight - e.target.offsetHeight)<e.target.scrollTop+1){
            setFetching(true)
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
        if(fetching){
            if(contacts.length===0 || contacts.length<totalDocsUser)
            UserService.fetchUsers({limit:8,page:currentPageUser,user:user.user.id,search:searchUser})
            .then((response)=>{
                if(response.status===200){
                    setTotalDocsUser(response.data.totalDocs)
                    setCurrentPageUser(prevState=>prevState + 1)
                    setContacts([...contacts,...response.data.docs])
                }            
            }).finally(()=>setFetching(false))
    }
    }, [fetching]);

    const handleRecevier =(iD,name)=>{
        const data = {
            No:3,
            UserId: user.user.id,
            RecevierId: iD,
            SearchText: searchMessage
        }
        localStorage.setItem('recevier', iD);
        localStorage.setItem('recevierName', name);
        setRecevier(iD)
        setRecevierName(name)
        MessageService.getMessage({...data,limit:10,page:1})
            .then((response)=>{
                chat.totalDocsMessage=response.data.totalDocs
                chat.currentPageMessage=2
                const reversed = response.data.docs.sort((a,b)=>{return new Date(a.Date) - new Date(b.Date)});
                chat.setMessageList(reversed)
                messageBox.current.scrollTo(0,0)
        })
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
        e.preventDefault();
        const options = {
            onUploadProgress: (progressEvent) => {
            const {loaded, total} = progressEvent;
            let percent = Math.floor( (loaded * 100) / total )
            if( percent < 100 ){
                setProgress(percent)
            }
            }
        }
        const data = new FormData();
        data.append("file", e.target.files[0])
        ChatService.upLoadFile(data,options).then((result)=>{
            if (result.status!==200){
                myalert.setMessage(result?.data?.message)
            }else{
                chat.socket.emit("uploadcomplete", 
                    {
                        Author: localStorage.getItem('userId'),
                        Recevier: localStorage.getItem('recevier'), 
                        Date: new Date(),
                        File: result.data
                    }
                )
            }
        })
        fileInput.current.value = null
    };
    const deleteMessage = (messageContent) => {
        chat.socket.emit("delete_message", {...messageContent,iD:user.user.id});
    }

    const getAvatar=(author)=>{
        if(author===user.user.id){
            return user.user.name.match(/[A-Z]|[А-Я]/g)
        } else {
            return recevierName.match(/[A-Z]|[А-Я]/g)
        }
    }

    const handleMessageSearch=(text)=>{
        if(localStorage.getItem('recevier')&&user.user.id){
            const data = {
                No:3,
                UserId: user.user.id,
                RecevierId: localStorage.getItem('recevier'),
                SearchText: text
            }
            chat.socket.emit("get_message", {...data,limit:10});
            setSearchMessage(text)
        }
    }

    const handleUserSearch=(text)=>{
        if(user.user.id!==undefined){
            UserService.fetchUsers({limit:8,page:1,user:user.user.id,search:text}).
            then((response)=>{
                if(response.status===200){
                    setTotalDocsUser(response.data.totalDocs)
                    setCurrentPageUser(2)
                    setContacts(response.data.docs)
                    setSearchUser(text)
                }            
        }).finally(
            ()=>setFetching(false)
        )
    }}

    return (
            <Container fluid>
                <Row className="overflow-auto">
                    <Col className="col-3"> 
                    <div className="userBox" ref={userBox}>
                        {contacts.map((item,index)=>{
                            return(
                                <div key={index} id="userCard" className={item.contact?._id===recevier?"userCardChange userCardListUserFlex":"userCard userCardListUserFlex"} 
                                    onClick={(e)=>handleRecevier(item.contact?.id,item.contact.name)}>
                                    <img className="avatarChat" src={process.env.REACT_APP_API_URL + `getlogo/` + item.contact?.logo?.filename} />
                                    <div>
                                        <div>{item.contact?.name}</div>
                                        <div>{item.contact?.nameOrg}</div>
                                    </div>
                                    {searchUnread(item?.contact?._id)}
                                    {item?.statusLine ? 
                                    <div></div>
                                    :
                                    <div className="lastVisit">
                                        {item?.lastVisit!==null ? dateFormat(item?.lastVisit?.Date, "dd/mm/yyyy HH:MM:ss"):``}
                                    </div>}
                                    {item?.statusLine ? 
                                    <div className="online"></div>
                                    :
                                    <div className="offline"></div>}
                                </div>)
                        })}
                    </div>
                    <InputGroup className="mt-2 bottom-0 mb-3">
                                <Form.Control 
                                    type="nameOrder" 
                                    placeholder="Поиск по имени автора или организации" 
                                    onChange={(e)=>handleUserSearch(e.target.value)}
                                />
                    </InputGroup>
                    </Col>
                    <Col className="col-9">
                        <InputGroup className="mb-2 mt-2">
                                <Form.Control 
                                    placeholder="Поиск по тексту сообщения" 
                                    onChange={(e)=>handleMessageSearch(e.target.value)}
                                />
                        </InputGroup>
                        <div className="chat" id="chat"  ref={messageBox}>
                        <div className="messageBox">
                            {chat.messageList.map((messageContent, index) => {
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
                                            <span>
                                                <a href={process.env.REACT_APP_API_URL + `download/` + messageContent.File.filename}>{messageContent.File.originalname}</a>
                                                <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                                                ${process.env.REACT_APP_API_URL}download/${messageContent.File.filename}`)}/>
                                             </span>
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
                        {progress!==0 ? 
                        <ProgressBar now={progress} active label={`${progress}%`} className="mt-3 mb-3"/>
                        :
                        <div></div>
                        }
                        {localStorage.getItem('recevier')!==null ?
                        <InputGroup className="mt-3">
                                <label htmlFor="myInput">
                                <Paperclip type="file" color="blue"
                                    style={{"width": "50px",
                                    "height": "50px"}}/>
                                </label>
                                <input id="myInput" type="file"
                                ref={fileInput}   
                                onChange={upload}                         
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
                         :
                         <span></span>
                        }
                    </Col>
                </Row>
            </Container>
    );
});

export default ChatPage;