import React,{useState,useContext,useRef} from 'react';
import { Form,
    InputGroup,
    Button,
    Card,
    ListGroup,
 } from "react-bootstrap";
import QuestService from '../services/QuestService'; 
import {Context} from "../index"; 

const AnswerCard = ({...props}) => {
    const{user,id,item} = props
    const inputEl = useRef(null);
    const [textAnswer,setTextAnswer] = useState('')
    const [visible,setVisible] =  useState(false)
    const {myalert} = useContext(Context);
    
    const handleAnswer=async(e)=>{
        e.preventDefault();
        const data = {
            Host:item.ID,
            Text: textAnswer,
            Author:user.user.id,
            Ask: id,
            Destination:item.DestinationID 
        }
        
        const result = await QuestService.addQuest(data)
        if(result.data?.errors){
            myalert.setMessage(result.data.message);
        } else {
            inputEl.current.value = "";
        }

    }

    return (
        <div>
            <ListGroup>
                <ListGroup.Item style={{fontSize:"12px"}} className="p-1">
                <a href="javascript:void(0)" onClick={()=>setVisible(!visible)}> Ответить</a></ListGroup.Item>
            </ListGroup>
            {visible ? 
            <Card>
            <Form.Control
                name="Text"
                placeholder="Текст сообщения"
                ref={inputEl}
                as="textarea"
                onChange={(e)=>setTextAnswer(e.target.value)}
            />
            <Button onClick={(e)=>handleAnswer(e)} style={{width:"10%"}} >Отправить
            </Button> 
            </Card>  
            :
            <div></div>  
            }  
        </div>
    );
};

export default AnswerCard;