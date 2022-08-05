import React, {useState,
    useContext,
    useRef,
    useEffect} from "react";
import {useLocation} from "react-router-dom";
import { Form,Card,} from "react-bootstrap";
import ReviewOrgService from '../services/ReviewOrgService'; 
import {Context} from "../index"; 
import AnswerCardReviewOrg from "./AnswerCardReviewOrg"
import { ArrowReturnRight,XCircle,XSquare} from 'react-bootstrap-icons';
import {observer} from "mobx-react-lite";
import dateFormat, { masks } from "dateformat";

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
                console.log(response)
                setFetch(false)
                setFetchAnswer(false)
                //chat.socket.emit("unread_reviewOrg", {id:user.user.id});
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

    const delReview = async (item) => {
        const result = await ReviewOrgService.delReviewOrg(item.ID);
        if (result.status===200){
             myalert.setMessage("Успешно");
           } else {
             myalert.setMessage(result.data.message);
        }
        setFetch(true)
    }

    const delAnswer = async (item) => {
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
        <Card className='section borderRadius'>
            <Card.Header className='sectionHeader headerPrices'>
                <div className='sectionName'>
                Написать отзыв
                </div>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Сообщение:</Form.Label>
                    <Form.Control
                    name="Text"
                    placeholder="Текст сообщения"
                    as="textarea"
                    ref={inputEl}
                    onChange={(e)=>setText(e.target.value)}
                    />
                    <button className="myButton" type="submit" >
                        <div>
                            Отправить
                        </div>
                    </button>
                </Form.Group>
                </Form>
            </Card.Body>
        </Card>   
        {review?.map((item,index)=>
        <div key={index}>
            <Card className="reviewCard">
            <Card.Header>
                <span className="boldtext">Автор:</span> {item.Author?.name}, {item.Author?.nameOrg}
                {item.Author?._id===user.user.id ?
                <XCircle color="red" className="xcircleReview"  onClick={e=>delReview(item)} /> : <div></div>}
                <span className="dateAnswer">{dateFormat(item.Date, "dd/mm/yyyy HH:MM")}</span>
            </Card.Header>
            <Card.Text className="m-3"> 
                <span style={{fontSize:"18px"}}>{item.Text}</span>
            </Card.Text>
            {item?.Org===user.user.id ?     
                    <AnswerCardReviewOrg 
                                user={user} 
                                item={item}
                                setFetchAnswer={setFetchAnswer}
                                />
            :
            <div></div>                    
            }
            </Card>
                {item.Answer.map((item)=>{
                    return(
                    <Card className="answerReview">
                        <Card.Text>
                        <ArrowReturnRight  style={{"width": "25px", "height": "25px"}}/>{item.Text}
                        <span style={{"float": "right"}}>
                        {item.Author===user.user.id ?
                                <XCircle color="red" className="xcircleQuest"  onClick={e=>delAnswer(item)} /> : <div></div>} 
                        </span>
                        </Card.Text>
                    </Card> 
                    ) 
                })}      
        </div>
        )}                  
        </div>
    );
    })
  
export default ReviewOrgItems;