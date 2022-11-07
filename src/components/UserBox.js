import React,{useState,useEffect,useContext,useRef} from 'react';
import UserService from '../services/UserService';
import MessageService from '../services/MessageService';
import {Context} from "../index";
import {
    Form,
    InputGroup,
  } from "react-bootstrap";
import dateFormat from "dateformat";

const UserBox = ({recevier,setRecevier}) => {

    const [fetching,setFetching] = useState(true) 
    const [contacts,setContacts] = useState([])
    const [totalDocsUser,setTotalDocsUser] = useState(0) 
    const [currentPageUser,setCurrentPageUser] = useState(1)
    const [searchUser, setSearchUser] = useState("")
    const {chat} = useContext(Context)
    const {user} = useContext(Context)
    const userBox = useRef(null)

    useEffect(()=>{
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
    },[])

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

    useEffect(() => {
        const element = userBox.current;
        element.addEventListener('scroll',scrollHandlerUser);
        return function(){
            element.removeEventListener('scroll',scrollHandlerUser);
        }
    },[]);

    const scrollHandlerUser = (e) =>{
        if((e.target.scrollHeight - e.target.offsetHeight)<e.target.scrollTop+1){
            setFetching(true)
        }    
    }

    const handleRecevier =(contact)=>{
        setRecevier(contact)
        if(chat.unread){
            const index = chat.unread.findIndex(item=>item.ID===contact.id)
            if(index!==-1){
                const newUnread = chat.unread;
                newUnread[index]={ID:contact.id,count:0}
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

    const handleUserSearch=(text)=>{
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
    }

    return (
        <div>
            <div className="userBox" ref={userBox}>
                {contacts.map((item,index)=>{
                    return(
                        <div key={index} id="userCard" className={item.contact?.id===recevier?.id?"userCardChange userCardListUserFlex":"userCard userCardListUserFlex"} 
                            onClick={(e)=>handleRecevier(item.contact)}>
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
        </div>
    );
};

export default UserBox;