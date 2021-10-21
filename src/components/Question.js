import React, {useState,
            useContext,
            useRef,
            useEffect} from "react";
import { Form,
        InputGroup,
        Button,
        Card,
        ListGroup,
     } from "react-bootstrap";
import QuestService from '../services/QuestService'; 
import {Context} from "../index"; 

  
const Question = ({...props})=>{
    const {offers,
        author,
        user,
        id} = props   
    const [text,setText] = useState('')
    const [dest,setDest] = useState();
    const [quest,setQuest] = useState([]);
    const {myalert} = useContext(Context);
    const inputEl = useRef(null);

    useEffect(() => {
        QuestService.fetchQuest(id).then((data)=>{
            setQuest(data.data)    
            console.log(quest)
        })
    },[]);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const data = {
            Host:null,
            Text: text,
            Author:user.user.id,
            Ask: id,
            Destination:dest 
        }
        const result = await QuestService.addQuest(data)
        if(result.data?.errors){
            myalert.setMessage(result.data.message);
        } else {
            inputEl.current.value="";
        }
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
                        <option value={author}>Автору: {author}</option>
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
                        <span style={{fontWeight:"bold"}}>Автор: </span>
                            {item.Author}
                        </div> 
                        <div style={{fontSize:"12px"}}>
                        <span style={{fontWeight:"bold"}}>Кому: </span>
                            {item.Destination}
                        </div>
            </Card.Header>
            <Card.Text className="m-3">
                <span style={{fontSize:"18px"}}>{item.Text}</span>
            </Card.Text>    
                <ListGroup variant="flush" >
                    <ListGroup.Item style={{fontSize:"12px"}} className="p-1">
                    <a href="javascript:void(0)"> Ответить</a></ListGroup.Item>
                </ListGroup>
            </Card>
        </div>)}
                        
        </div>
    );
    }
  
export default Question;