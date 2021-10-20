import React, {useState,useContext} from "react";
import { Form,
        InputGroup,
        Button
     } from "react-bootstrap";
import QuestService from '../services/QuestService'; 
import {Context} from "../index";  
  
const Question =({...props})=>{
    const {offers,
        author,
        user,
        id} = props   
    const [text,setText] = useState('')
    const [dest,setDest] = useState();
    const {myalert} = useContext(Context);

    const handleClick=async()=>{
        const data = {
            Text: text,
            Author:user.user.id,
            Ask: id,
            Destination:dest 
        }
        const result = await QuestService.addQuest(data)
        if(result.data?.errors){
            myalert.setMessage(result.data.message);
        } 
    }

    return (
        <div>
        <InputGroup> 
        <Form.Label className="px-3 mt-2">Кому:</Form.Label>
            <Form.Control
                as="select" 
                onChange={(e)=>setDest(e.target.value)}        
            >       
                    <option value={author}>Автору: {author}</option>
                    {offers?.map((item,index)=>
                    <option value={item.AuthorID}>{item.Author}</option>
                    )}
            </Form.Control>
            <Button onClick={()=>handleClick()}>Отправить
            </Button> 
        </InputGroup>
        <Form.Control
                name="Text"
                placeholder="Текст сообщения"
                as="textarea"
                onChange={(e)=>setText(e.target.value)}
        />
        </div>
    );
    }
  
export default Question;