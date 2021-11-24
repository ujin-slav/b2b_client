import React, {useState,
            useContext,
            useRef,
            useEffect,
            createRef} from "react";
import { Form,
        InputGroup,
        Button,
        Card,
        ListGroup,
     } from "react-bootstrap";
import QuestService from '../services/QuestService'; 
import {Context} from "../index"; 
import AnswerCard from "../components/AnswerCard"
import { ArrowReturnRight,XCircle} from 'react-bootstrap-icons';
import {observer} from "mobx-react-lite";
import {SocketContext} from "../App";
  
const Question = observer(({...props})=>{
    const {offers,
        author,
        user,
        id} = props   

    const [text,setText] = useState('')
    const [dest,setDest] = useState();
    const [fetch,setFetch] = useState(false);
    const [fetchAnswer,setFetchAnswer] = useState(false)
    const [quest,setQuest] = useState([]);
    const {myalert} = useContext(Context);
    const inputEl = useRef(null);
    const {socket} =  useContext(SocketContext)
    
    useEffect(() => {
        QuestService.fetchQuest({id,userId:user.user.id}).then((response)=>{
            if(response.status===200){
                setQuest(response.data)
                setFetch(false)
                setFetchAnswer(false)
                console.log(response.data)
            }                
        })
    },[fetch,fetchAnswer]);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const data = {
            Host:null,
            Text: text,
            Author:user.user.id,
            Ask: id,
            Destination:dest ?? author?._id
        }
        const result = await QuestService.addQuest(data)
        if(result.data?.errors){
            myalert.setMessage(result.data.message);
        } else {
            inputEl.current.value="";
            setFetch(true)
            socket.emit("unread_quest", {id:data.Destination});
        }
    }

    const delQuest = async (item) => {
        console.log(item)
        socket.emit("unread_quest", item.ID);
        const result = await QuestService.delQuest(item.ID);
        if (result.status===200){
            myalert.setMessage("Успешно"); 
          } else {
            myalert.setMessage(result.data.message);
          }
        setFetch(true)
    }

    return (
        <div>
        <Form onSubmit={handleSubmit}>    
            <InputGroup> 
            <Form.Label className="px-3 mt-2">Кому:</Form.Label>
                <Form.Control
                    as="select" 
                    onChange={(e)=>setDest(e.target.value)}        
                >       
                        <option value={author?._id}>Автору: {author?.name}</option>
                        {offers?.map((item,index)=>
                        <option key={index} value={item.AuthorID}>{item.Author}</option>
                        )}
                </Form.Control>
                <Button type="submit">Отправить
                </Button> 
            </InputGroup>
            <Form.Control
                    name="Text"
                    placeholder="Текст сообщения"
                    as="textarea"
                    ref={inputEl}
                    onChange={(e)=>setText(e.target.value)}
            />
        </Form>
        {quest?.map((item,index)=>
        <div key={index}>
            <Card>
            <Card.Header className="p-1"><div style={{fontSize:"12px"}}>
            {item.Author?._id===user.user.id ?
            <XCircle color="red" className="xcircleQuest"  onClick={e=>delQuest(item)} /> : <div></div>}            
                        <span style={{fontWeight:"bold"}}>Автор: </span>
                            {item.Author.name}
                        </div> 
                        <div style={{fontSize:"12px"}}>
                        <span style={{fontWeight:"bold"}}>Кому: </span>
                            {item.Destination?.name}                        
                        </div>               
            </Card.Header>
            <Card.Text className="m-3">
                <span style={{fontSize:"18px"}}>{item.Text}</span>
            </Card.Text>
            {item.Destination?._id===user.user.id ?     
                    <AnswerCard user={user} 
                                item={item}
                                id={id}
                                setFetchAnswer={setFetchAnswer}
                                />
            :
            <div></div>                    
            }
            </Card>
                {item.Answer.map((item)=>
                    <Card className="ms-5">
                        <Card.Text>
                        <ArrowReturnRight  style={{"width": "25px", "height": "25px"}}/>{item}
                        <span style={{"float": "right"}}>
                            <XCircle color="red" style={{"width": "25px", "height": "25px"}}/>
                        </span>
                        </Card.Text>
                    </Card>  
                )}       
        </div>)}                     
        </div>
    );
    })
  
export default Question;