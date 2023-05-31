import React, {useState,
    useContext,
    useRef,
    useEffect} from "react";
import {CaretDownFill,CaretUpFill} from 'react-bootstrap-icons';
import { Form,Card, Button,} from "react-bootstrap";
import ReviewOrgService from '../services/ReviewOrgService'; 
import {Context} from "../index"; 
import AnswerCardReviewOrg from "../components/AnswerCardReviewOrg"
import { ArrowReturnRight,XCircle,XSquare} from 'react-bootstrap-icons';
import {observer} from "mobx-react-lite";
import dateFormat, { masks } from "dateformat";
import ReactPaginate from "react-paginate";
import bin from "../icons/bin.svg";


const ReviewWriteMe = () => {
    

    const [text,setText] = useState('')
    const[visible,setVisible] = useState(false);
    const {user} = useContext(Context);
    const id = user.user.id   
    const [fetch,setFetch] = useState(false);
    const [fetchAnswer,setFetchAnswer] = useState(false)
    const [review,setReview] = useState([]);
    const [loading,setLoading] = useState(true) 
    const {myalert} = useContext(Context);
    const inputEl = useRef(null);
    const {chat} =  useContext(Context)
    const [pageCount, setpageCount] = useState(0);
    const [currentPage,setCurrentPage] = useState(1)
    let limit = 10
    
    useEffect(() => {
        ReviewOrgService.fetchReviewOrg({author:id,limit,page:currentPage,user:user.user.id}).then((response)=>{
            if(response.status===200){
                setReview(response.data.docs)
                setFetch(false)
                setFetchAnswer(false)
                setpageCount(response.data.totalPages);
                chat.socket.emit("get_unread");
            }                
        }).finally(()=>setLoading(false))
    },[fetch,fetchAnswer,visible]);

    const fetchComments = async (currentPage) => {
        ReviewOrgService.fetchReviewOrg({
        id,limit,page:currentPage}).then((data)=>{
        setReview(data.docs)
        setpageCount(data.totalPages);
       }).finally(()=>setLoading(false))
    };

    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1)
      await fetchComments(data.selected + 1);
    };


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
            console.log(result)
            myalert.setMessage(result.data.message);
          }
        setFetch(true)
    }

    return (
        <div className='container-mycontr mt-3'>
            {review?.map((item,index)=>
                <div key={index}>
                    <Card className="reviewCard">
                    <Card.Header>
                        <span className="boldtext">Автор:</span> {item.Author?.name}, {item.Author?.nameOrg}
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
                                {item.Org===user.user.id ?
                                    <img 
                                        className="xcircleQuest" 
                                        src={bin}
                                        onClick={e=>delAnswer(item)}
                                    />  
                                    : 
                                    <div></div>
                                    } 
                                </span>
                                </Card.Text>
                            </Card> 
                            ) 
                        })}      
                </div>
                )} 
                <ReactPaginate
                    previousLabel={"предыдущий"}
                    nextLabel={"следующий"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
            />
        </div>
    );
};

export default ReviewWriteMe;