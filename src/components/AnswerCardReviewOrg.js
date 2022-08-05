import React,{useState,useContext,useRef} from 'react';
import { Form,
    InputGroup,
    Button,
    Card,
    ListGroup,
 } from "react-bootstrap";
import ReviewOrgService from '../services/ReviewOrgService'; 
import {Context} from "../index"; 

const AnswerCardReviewOrg = ({...props}) => {
    const{user,id,item,setFetchAnswer} = props
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
            Org:item.Org 
        }     
        const result = await ReviewOrgService.addReviewOrg(data)
        if(result.data?.errors){
            myalert.setMessage(result.data.message);
        } else {
            inputEl.current.value = "";
            setVisible(false)
            setFetchAnswer(true)
        }

    }

    return (
        <div>
            <ListGroup>
                <ListGroup.Item className="answer">
                <a href="javascript:void(0)" onClick={()=>setVisible(!visible)}> Ответить</a></ListGroup.Item>
            </ListGroup>
            {visible ? 
            <Card className="borderRadius">
            <Form.Control
                name="Text"
                placeholder="Текст сообщения"
                ref={inputEl}
                as="textarea"
                onChange={(e)=>setTextAnswer(e.target.value)}
            />
            <button className="myButton" onClick={(e)=>handleAnswer(e)}>
                    <div>
                         Отправить
                    </div>
            </button> 
            </Card>  
            :
            <div></div>  
            }  
        </div>
    );
};

export default AnswerCardReviewOrg;