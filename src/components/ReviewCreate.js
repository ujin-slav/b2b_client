import React, {useState,useContext,useRef,useEffect} from "react";
import ReviewOrgService from '../services/ReviewOrgService'; 
import { Form, Button} from "react-bootstrap";
import {Context} from "../index"; 
import StarsRating from "../components/StarsRating"; 
import StarsRatingShow from "../components/StarsRatingShow"; 
import bin from "../icons/bin.svg";
import { Card} from "react-bootstrap";
import dateFormat, { masks } from "dateformat";
import AnswerCardReviewOrg from "../components/AnswerCardReviewOrg"

const ReviewCreate = ({id,priceAskId}) => {

    const [text,setText] = useState('')
    const [fetch,setFetch] = useState(true)
    const {user} = useContext(Context);
    const {chat} =  useContext(Context)
    const [review,setReview] = useState()
    const inputEl = useRef(null);
    const {myalert} = useContext(Context);
    const [currentStar, setCurrentStar] = useState();
    const [fetchAnswer,setFetchAnswer] = useState(false)

    useEffect(() => {
        if(fetch){
            ReviewOrgService.fetchReviewPriceAsk({priceAskId}).then((data)=>{
                setReview(data.data)
                console.log(data)
            }).finally(()=>{
                setFetch(false)
            })
        }
    },[fetch]);

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

    const handleSubmit =async(e)=>{
        e.preventDefault();
        if(!currentStar){
            myalert.setMessage("Выберите оценку")
            return
        }
        const data = {
            Host:null,
            Text: text,
            Author:user.user.id,
            Org: id,
            Stars: currentStar,
            PriceAsk: priceAskId
        }
        const result = await ReviewOrgService.addReviewOrg(data)
        if(result.data?.errors){
            myalert.setMessage(result.data.message);
        } else {
            chat.socket.emit("unread_review_org", data)
            inputEl.current.value=""
            setFetch(true)
        }
    }
    if(review){
        let item = review
        return(
            <div className='mt-4'>
                    <div className='headerReviewCreate'>
                        Отзыв
                    </div>
                    <Card className="reviewCard">
                    <Card.Header className="bg-body d-flex justify-content-between">
                    <div className="d-flex">
                        <img className="avatarChat" src={process.env.REACT_APP_API_URL + `getlogo/` + item.Author?.logo?.filename} />
                            <div>
                                <div>{item.Author?.name}</div>
                                <div>{item.Author?.nameOrg}</div>
                                <StarsRatingShow stars={item.Stars}/>
                            </div>
                        </div>
                        <div>
                            {item.Author?._id===user.user.id ?
                                <img 
                                    className="xcircleReview" 
                                    src={bin}
                                    onClick={e=>delReview(item)}
                                />   
                                : 
                                <div></div>
                            }
                            <span className="dateAnswer">{dateFormat(item.Date, "dd/mm/yyyy HH:MM")}</span>
                        </div>
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
                        {item.Answer?.map((item)=>{
                            return(
                            <Card className="answerReview border-0 mt-2 mb-5">
                                 <Card.Header className="bg-body d-flex justify-content-between">
                                    <div className="d-flex">
                                        <img className="avatarChat" src={process.env.REACT_APP_API_URL + `getlogo/` + item.Author?.logo?.filename} />
                                        <div>
                                            <div>{item.Author?.name}</div>
                                            <div>{item.Author?.nameOrg}</div>
                                        </div>
                                    </div>
                                    <div className="position-static">
                                        {item.Org===user.user.id ?
                                            <img 
                                                className="xcircleReview" 
                                                src={bin}
                                                onClick={e=>delAnswer(item)}
                                            />   
                                            : <div></div>
                                        } 
                                        <span className="dateAnswer">{dateFormat(item.Date, "dd/mm/yyyy HH:MM")}</span>
                                    </div>
                                </Card.Header>
                                <Card.Text>
                                    {item.Text}
                                </Card.Text>
                            </Card> 
                            ) 
                        })}      
            </div>
        )
    }
    return (
        <div>
            <div className='formReviewOrg'>
                <div className='headerReviewCreate'>
                        Написать отзыв
                </div>
                <div className="mb-2">Сообщение:</div>
                <Form.Control
                name="Text"
                placeholder="Текст сообщения"
                as="textarea"
                ref={inputEl}
                onChange={(e)=>setText(e.target.value)} />
                <StarsRating currentStar={currentStar} setCurrentStar={setCurrentStar}/>
                <button className="myButtonMessage mt-2" onClick={handleSubmit}>
                    Отправить
                </button>
            </div> 
        </div>
    );
};

export default ReviewCreate;