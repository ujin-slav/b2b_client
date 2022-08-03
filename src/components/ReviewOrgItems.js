import React, {useState,
    useContext,
    useRef,
    useEffect,
    createRef} from "react";
import {useLocation} from "react-router-dom";
import { Form,
InputGroup,
Button,
Card,
ListGroup,
} from "react-bootstrap";
import ReviewOrgService from '../services/ReviewOrgService'; 
import {Context} from "../index"; 
import AnswerCard from "./AnswerCard"
import { ArrowReturnRight,XCircle,XSquare} from 'react-bootstrap-icons';
import {observer} from "mobx-react-lite";
import {SocketContext} from "../App";
import { checkAccessAsk } from "../utils/CheckAccessAsk";

const ReviewOrgItems = observer(({...props})=>{
    const {id} = props   

    const [text,setText] = useState('')
    const {user} = useContext(Context);
    const [fetch,setFetch] = useState(false);
    const [fetchAnswer,setFetchAnswer] = useState(false)
    const [review,setReview] = useState([]);
    const {myalert} = useContext(Context);
    const inputEl = useRef(null);
    const {chat} =  useContext(Context)
    
    useEffect(() => {
        ReviewOrgService.fetchReviewOrg({id}).then((response)=>{
            if(response.status===200){
                setReview(response.data)
                setFetch(false)
                setFetchAnswer(false)
                chat.socket.emit("unread_reviewOrg", {id:user.user.id});
            }                
        })
    },[fetch,fetchAnswer]);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const data = {
            Host:null,
            Text: text,
            Author:user.user.id,
            Org: id,
        }
        const result = await ReviewOrgService.addReviewOrg(data)
        if(result.data?.errors){
            myalert.setMessage(result.data.message);
        } else {
            inputEl.current.value="";
            setFetch(true)
            chat.socket.emit("unread_quest_mail", {data});
        }
    }

    const delQuest = async (item) => {
        const result = await ReviewOrgService.delReviewOrg(item.ID);
        if (result.status===200){
             myalert.setMessage("Успешно");
               chat.socket.emit("unread_quest", {id:item.Destination._id}); 
           } else {
             myalert.setMessage(result.data.message);
        }
        setFetch(true)
    }

    const delAnswer = async (item) => {
        console.log(item)
        const result = await ReviewOrgService.delAnswerOrg(item._id);
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
            {user.isAuth === true ?
                <InputGroup> 
                    <Button type="submit">Отправить
                    </Button> 
                </InputGroup>
            :
            <div></div> 
            }    
            <Form.Control
                    name="Text"
                    placeholder="Текст сообщения"
                    as="textarea"
                    ref={inputEl}
                    onChange={(e)=>setText(e.target.value)}
            />
        </Form>
        {review?.map((item,index)=>
        <div key={index}>
            <Card>
            <Card.Text className="m-3">
            {item.Author?._id===user.user.id ?
            <XSquare color="red" className="xcircleQuest"  onClick={e=>delQuest(item)} /> : <div></div>} 
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
                {item.Answer.map((item)=>{
                    console.log(item)
                    return(
                    <Card className="ms-5">
                        <Card.Text>
                        <ArrowReturnRight  style={{"width": "25px", "height": "25px"}}/>{item.Text}
                        <span style={{"float": "right"}}>
                        {item.Author===user.user.id ?
                                <XSquare color="red" className="xcircleQuest"  onClick={e=>delAnswer(item)} /> : <div></div>} 
                        </span>
                        </Card.Text>
                    </Card> 
                    ) 
                })}
                <div style={{"height":"5px","background":"#ECECEC"}}></div>          
        </div>
        )}                  
        </div>
    );
    })
  
export default ReviewOrgItems;