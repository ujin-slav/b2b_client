import React,{useState,useEffect,useContext} from 'react';
import {useHistory} from 'react-router-dom';
import QuestService from '../services/QuestService'; 
import {Context} from "../index";
import ReactPaginate from "react-paginate";
import {Card} from "react-bootstrap";
import dateFormat, { masks } from "dateformat";
import { CARDASK } from '../utils/routes';
import {observer} from "mobx-react-lite";

const QuestForMe = observer(() => {
    const {user} = useContext(Context);
    const [quest,setQuest] = useState([]); 
    const [search,setSearch] = useState(1)
    const [currentPage,setCurrentPage] = useState(1)
    const [pageCount, setpageCount] = useState(0);
    const history = useHistory();
    const {chat} = useContext(Context);
    let limit = 10;

    useEffect(() => {
        QuestService.fetchQuestUser({dest:"1",userId:user.user.id, limit,page:currentPage}).then((response)=>{
            if(response.status===200){
                setQuest(response.data.docs)
                setpageCount(response.data.totalPages);
            }                
        })
    },[chat.questUnread]);

    const fetchPage = async (currentPage) => {
        QuestService.fetchQuestUser({dest:search,userId:user.user.id,limit,page:currentPage}).then((response)=>{
            setQuest(response.data.docs);
      })
      };

    const handlePageClick = async (data) => {
        setCurrentPage(data.selected + 1);
        await fetchPage(currentPage);
      };

    const changeDest = (value) => {
        setSearch(value)
        QuestService.fetchQuestUser({dest:1,userId:user.user.id, limit,page:1}).then((response)=>{
            if(response.status===200){
                setQuest(response.data.docs)
                setpageCount(response.data.totalPages);
            }                
        })
    }  

    return (
        <div>
            <div className='parentSpecAsk'>
            {quest.map((item,index)=>{
            return(
                <div key={index} className='childSpecAsk'>
                <Card>
                <Card.Header></Card.Header>
                <div className='cardPadding'>
                    <div key={index} onClick={()=>history.push(CARDASK + '/' + item.Ask)}>
                    <div>{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</div>
                    <div>
                        <div>{item.Author?.name}</div>
                        <div>{item.Author?.nameOrg}</div>
                    </div>
                    <div>{item.Status===null ? 
                    <div style={{color:"red"}}>Нет</div> 
                    : item.Status.Text}</div>
                    <div>{item.Text.length>100 ?
                            `${item.Text.substring(0, 100)}...`
                            :
                            item.Text
                            }</div>
                    </div>
                </div>
                </Card>
                </div>
                )})}
            </div>
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
});

export default QuestForMe;