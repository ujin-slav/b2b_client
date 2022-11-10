import React,{useState,useContext,useRef,useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {Context} from "../index";
import {
    Form,
    ProgressBar,
    InputGroup,
} from "react-bootstrap";
import {CHAT} from "../utils/routes";
import {Envelope,Paperclip,X,Eye} from 'react-bootstrap-icons';
import dateFormat from "dateformat";
import ChatService from '../services/ChatService';
import MessageService from '../services/MessageService';


const MessageList = ({recevier}) => {

    const [messageList,setMessageList] = useState([])
    const [searchMessage, setSearchMessage] = useState("")
    const [currentMessage, setCurrentMessage] = useState("")
    const [totalDocsMessage,setTotalDocsMessage] = useState(0) 
    const [currentPageMessage,setCurrentPageMessage] = useState(1)
    const [fetchingMessage,setFetchingMessage] = useState(false) 
    const [fetchingNewMessage,setFetchingNewMessage] = useState(false) 
    const [progress, setProgress] = useState(0)
    const inputEl = useRef(null)
    const messageBox = useRef(null)
    const fileInput = useRef(null)
    const {myalert} = useContext(Context);
    const {user} = useContext(Context)
    const {chat} = useContext(Context)
    const location = useLocation();

    useEffect(() => {
        chat.socket.on("new_message", (data) => {  
            newMessage(data)
        })
        chat.socket.on("unread_message", (data) => {  
            if(chat.unread){
                const index = data.findIndex(item=>item.ID===chat.recevier.id)
                if(index!==-1){
                    const newUnread = data;
                    newUnread[index]={ID:data.ID,count:0}
                    chat.setUnread(newUnread)
                } else {
                    chat.setUnread(data);
                }
                // UserService.fetchUsers({limit:8,page:1,user:user.user.id,search:searchUser})
                // .then((response)=>{
                //     if(response.status===200){
                //         setTotalDocsUser(response.data.totalDocs)
                //         setCurrentPageUser(currentPageUser + 1)
                //         setContacts(response.data.docs)
                //     }            
                // })
            }
        })
        chat.socket.on("delete_message", (data) => {  
            newMessage(data);
        })
    },[])

    useEffect(() => {
        const element = messageBox.current;
        element.addEventListener('scroll',scrollHandler);
        return function(){
            element.removeEventListener('scroll',scrollHandler);
        }
    },[])

    useEffect(() => {
        if(recevier){
            const data = {
                UserId: user.user.id,
                RecevierId:recevier.id,
                SearchText: searchMessage
            }
            MessageService.getMessage({...data,limit:10,page:1})
            .then((response)=>{
                setTotalDocsMessage(response.data.totalDocs)
                setCurrentPageMessage(2)
                const reversed = response.data.docs.sort((a,b)=>{return new Date(a.Date) - new Date(b.Date)});
                setMessageList(reversed)
                messageBox.current.scrollTo(0,0)
            }).finally(()=>setFetchingMessage(false))
        }
    },[recevier])
    
    useEffect(() => {
        if(fetchingMessage){
            const data = {
                UserId: user.user.id,
                RecevierId:chat.recevier.id,
                SearchText: searchMessage
            }
            if(messageList.length===0 || messageList.length<totalDocsMessage){
                MessageService.getMessage({...data,limit:10,page:currentPageMessage})
                .then((response)=>{
                    setTotalDocsMessage(response.data.totalDocs)
                    setCurrentPageMessage(prevState=>prevState + 1)
                    const reversed = response.data.docs.sort((a,b)=>{return new Date(a.Date) - new Date(b.Date)});
                    setMessageList([...reversed,...messageList])
                    messageBox.current.scrollTo(0,messageBox.current.scrollHeight - 860)
                }).finally(()=>setFetchingMessage(false))
            }
        }
    },[fetchingMessage])

    useEffect(() => {
        if(fetchingNewMessage){
            const data = {
                UserId: user.user.id,
                RecevierId:chat.recevier.id,
                SearchText: searchMessage
            }
            MessageService.getMessage({...data,limit:10,page:1})
            .then((response)=>{
                setTotalDocsMessage(response.data.totalDocs)
                setCurrentPageMessage(2)
                const reversed = response.data.docs.sort((a,b)=>{return new Date(a.Date) - new Date(b.Date)});
                setMessageList(reversed)
                messageBox.current.scrollTo(0,0)
            }).finally(()=>setFetchingNewMessage(false))
        }
    },[fetchingNewMessage])

    const newMessage = (data) => {
        if(data.Author===chat?.recevier?.id||data.Author===user.user.id){
            setFetchingNewMessage(true)
        } else {
            chat.socket.emit("get_unread_message");  
        }
    }

    const scrollHandler = (e) =>{
        if((e.target.scrollHeight - e.target.offsetHeight)<e.target.scrollTop+1){
            setFetchingMessage(true)
        } 
    }

    const handleMessageSearch=(text)=>{
        const data = {
            UserId: user.user.id,
            RecevierId: chat.recevier.id,
            SearchText: text
        }
        MessageService.getMessage({...data,limit:10,page:1})
        .then((response)=>{
            setTotalDocsMessage(response.data.totalDocs)
            setCurrentPageMessage(2)
            const reversed = response.data.docs.sort((a,b)=>{return new Date(a.Date) - new Date(b.Date)});
            setMessageList(reversed)
            setSearchMessage(text)
            messageBox.current.scrollTo(0,0)
        }).finally(()=>setFetchingMessage(false))
    }

    const sendMessage = async () => {
        if (currentMessage !== "") {
          const messageData = {
            Author: user.user.id,
            Recevier: chat.recevier.id, 
            Text: currentMessage,
            Date: new Date()
            };
          await chat.socket.emit("send_message", messageData);
          setMessageList(old=>[...old,messageData])
          setCurrentMessage("");
          inputEl.current.value = "";
        }
    };

    const getAvatar=(author)=>{
        if(author===user.user.id){
            return user.user.name.match(/[A-Z]|[А-Я]/g)
        } else {
            return chat.recevier?.name?.match(/[A-Z]|[А-Я]/g)
        }
    }

    const deleteMessage = (messageContent) => {
        chat.socket.emit("delete_message", {...messageContent,iD:user.user.id});
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
                console.log(result)
                chat.socket.emit("uploadcomplete", 
                    {
                        Author: user.user.id,
                        Recevier: chat.recevier.id, 
                        Date: new Date(),
                        File: result.data
                    }
                )
            }
        })
        fileInput.current.value = null
    };

    
    return (
        <div>
            <InputGroup className="mb-2 mt-2">
                <Form.Control 
                    placeholder="Поиск по тексту сообщения" 
                    onChange={(e)=>handleMessageSearch(e.target.value)}
                />
            </InputGroup>
                <div className="chat" id="chat"  ref={messageBox}>
                <div className="messageBox">
                    {messageList.map((messageContent, index) => {
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
                        )
                    })}
                </div>
                </div>
                {progress!==0 ? 
                <ProgressBar now={progress} active label={`${progress}%`} className="mt-3 mb-3"/>
                :
                <div></div>
                }
                {recevier ?
                <InputGroup className="mt-3">
                        <label htmlFor="myInput">
                        <Paperclip type="file" color="blue" style={{"width": "50px","height": "50px"}}/>
                        </label>
                        <input id="myInput" type="file" ref={fileInput} onChange={upload} style={{display:'none'}} className="form-control"/>
                        <Form.Control as="textarea" rows={2} placeholder="Введите сообщение " style={{marginRight:"15px"}} ref={inputEl}
                            onChange={(event) => {
                                        setCurrentMessage(event.target.value);
                                        }}
                                        onKeyPress={(event) => {
                                        event.key === "Enter" && sendMessage();
                                    }}
                        />
                        <div style={{display: "flex",justifyContent:"center",alignItems:"center"}}>
                        <Envelope color="blue" style={{"width": "50px","height": "50px"}} onClick={sendMessage}/>
                        </div>
                </InputGroup>
                    :
                <span></span>
                        
            }
        </div>
    );
};

export default MessageList;