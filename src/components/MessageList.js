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
import videojs from 'video.js';
import VideoJS from '../components/VideoJS';
import Fountaing from '../components/Fountaing'

const MessageList = ({recevier}) => {

    const [messageList,setMessageList] = useState([])
    const [searchMessage, setSearchMessage] = useState("")
    const [currentMessage, setCurrentMessage] = useState("")
    const [totalDocsMessage,setTotalDocsMessage] = useState(0) 
    const [currentPageMessage,setCurrentPageMessage] = useState(1)
    const [fetchingMessage,setFetchingMessage] = useState(false) 
    const [fetchingNewMessage,setFetchingNewMessage] = useState(false) 
    const [progress, setProgress] = useState(0)
    const [dragActive, setDragActive] = useState(false);
    const inputEl = useRef(null)
    const messageBox = useRef(null)
    const playerRef = useRef(null);
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
                const index = data.findIndex(item=>item.ID===chat.recevier?.id)
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
                messageBox.current.scrollTo(0,messageBox.current.scrollHeight)
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
                    //const reversed = response.data.docs
                    const reversed = response.data.docs.sort((a,b)=>{return new Date(a.Date) - new Date(b.Date)});
                    setMessageList([...reversed,...messageList])
                    messageBox.current.scrollTo(0,messageBox.current.scrollHeight - 1000)
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
                //const reversed = response.data.docs
                const reversed = response.data.docs.sort((a,b)=>{return new Date(a.Date) - new Date(b.Date)});
                setMessageList(reversed)
                messageBox.current.scrollTo(0,messageBox.current.scrollHeight)
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
        if(e.target.scrollTop===0){
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
            //const reversed = response.data.docs
            const reversed = response.data.docs.sort((a,b)=>{return new Date(a.Date) - new Date(b.Date)});
            setMessageList(reversed)
            setSearchMessage(text)
            messageBox.current.scrollTo(0,messageBox.current.scrollHeight)
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
          inputEl.current.focus()
          messageBox.current.scrollTo(0,messageBox.current.scrollHeight)
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

    const uploadFile = (files)=>{
        if(files[0].size > 10485760){
            myalert.setMessage("Превышен размер файла");
            return false
        }  
        const options = {
            onUploadProgress: (progressEvent) => {
                const {loaded, total} = progressEvent;
                let percent = Math.floor( (loaded * 100) / total )
                if( loaded < total ){
                    setProgress(percent)
                }else{
                    setProgress(0)
                }
            }
        }
        const data = new FormData();
        data.append("file", files[0])
        ChatService.upLoadFile(data,options).then((result)=>{
            if (result.status!==200){
                myalert.setMessage(result?.data?.message)
                //setProgress(0)
            }else{
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
    }

    const upload = (e) => {
        e.preventDefault();
        uploadFile(e.target.files)
    };

    const showImageOrVideo = (file) =>{
        const playerOptions = {
            sourceUrl: `${process.env.REACT_APP_API_URL + `chatdownload/` + file?.filename}`,
            width: 400,
            controls: true,
            fluid: true,
            autoplay: false,
            muted: false,
            responsive: true,
            playsinline: false,
          };
        const { width: playerWidth, sourceUrl: videoBaseUrl, controls, fluid, responsive, autoplay, muted, playsinline } = playerOptions;
        const videoJsOptions = {
          controls,
          responsive,
          fluid,
          autoplay,
          muted,
          playsinline,
          sources: [{
            src: `${process.env.REACT_APP_API_URL + `chatdownload/` + file?.filename}${playerWidth ? `?tr=w-${playerWidth}` : ''}`,
            type: 'video/mp4'
          }]
        }

        const handlePlayerReady = (player) => {
            playerRef.current = player;
            player.on('waiting', () => {
              videojs.log('player is waiting');
            });
            player.on('dispose', () => {
              videojs.log('player will dispose');
            });
        };

        if (file.filename.match(/\.(jpg|jpeg|png|gif)$/i)){
            return(
                <span>
                    <div>
                        <img 
                            className="chatImage" 
                            src={process.env.REACT_APP_API_URL + `chatdownload/` + file?.filename} 
                        />
                    </div>
                    <div>
                        <a href={process.env.REACT_APP_API_URL + `chatdownload/` + file.filename}>{file.originalname}</a>
                        <Eye className="eye" onClick={()=>window.open(`https://docs.yandex.ru/docs/view?url=
                        ${process.env.REACT_APP_API_URL}chatdownload/${file.filename}`)}/>
                    </div>
                </span>
            )
        }
        if (file.filename.match(/\.(webm|mkv|flv|avi|mp4|mpg|mpeg|mp4|mov)$/i)){
            return(
                <span>
                    <div style={{ 
                        width: `${playerWidth}px`,
                        "pointer-events":"all"
                        }}>
                        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
                    </div>
                </span>
            )
        }
        return(
            <span>
                <a href={process.env.REACT_APP_API_URL + `chatdownload/` + file.filename}>{file.originalname}</a>
                <Eye className="eye" onClick={()=>window.open(`https://docs.yandex.ru/docs/view?url=${process.env.REACT_APP_API_URL}chatdownload/${file.filename}`)}/>
            </span>
        )
    }

    const handleDrag = function(e) {
        if(recevier){
            e.preventDefault();
            e.stopPropagation();
            //console.log(e)
            if (e.type === "dragenter" || e.type === "dragover") {
              setDragActive(true);
            } else if (e.type === "dragleave") {
              setDragActive(false);
            }
        }
      };
      
      const handleDrop = function(e) {
        if(recevier){
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            uploadFile(e.dataTransfer.files)
        }
      };
    
    
    return (
        <div>
            <InputGroup className="mb-2 mt-2">
                <Form.Control 
                    placeholder="Поиск по тексту сообщения" 
                    onChange={(e)=>handleMessageSearch(e.target.value)}
                />
            </InputGroup>
            <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
            <input id="myInput" type="file" ref={fileInput} onChange={upload} style={{display:'none'}} className="form-control"/>
                <div className="chat" id="chat"  ref={messageBox}>
                <div className="messageBox" onDragLeave={(e)=>{e.preventDefault()}}>
                    {messageList.map((messageContent, index) => {
                        return (
                        <div key={index} >
                            <table className="messageTable">
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="avatar"> 
                                            {getAvatar(messageContent.Author)} 
                                        </div>
                                    </td>
                                    <td>
                                    <div className={messageContent.Author===user.user.id?"messageItem":"messageItemRecevier"}> 
                                    {messageContent.File ?
                                        <span>
                                            {showImageOrVideo(messageContent.File)}
                                        </span>
                                        :
                                        <div></div>
                                    }
                                    <div>{messageContent.Text}</div> 
                                <div className="messageDate">
                                <X color="red" 
                                    style={{
                                        "width": "30px",
                                        "height": "30px",
                                        "pointer-events":"all"
                                }}
                                onClick={(e)=>deleteMessage(messageContent)}/>   
                                    {dateFormat(messageContent.Date, "dd/mm/yyyy HH:MM:ss")}                                    
                                </div> 
                            </div> </td>
                                </tr>
                            </tbody>
                            </table> 
                            <Fountaing show={fetchingMessage}/>    
                        </div> 
                        )
                    })}
                    {dragActive ? 
                        <div className='modalDragFile' onMouseDown={()=>console.log("Down mouse")}>
                            Перетащите сюда файлы.
                        </div>
                    :
                        <span>
                        </span>
                    }
                </div>
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
                                            if(event.key === "Enter"){
                                                event.preventDefault();
                                                sendMessage();
                                            }    
                                        }}
                                        onKeyUp={(event)=>{
                                            console.log(event)
                                            chat.socket.emit("typing", {id:recevier.id,from: user?.user?.id});
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