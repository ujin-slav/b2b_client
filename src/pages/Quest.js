import React,{useState,useEffect,useContext} from 'react';
import QuestService from '../services/QuestService'; 
import {Context} from "../index";
import ReactPaginate from "react-paginate";

const Quest = () => {
    const {user} = useContext(Context);
    const [quest,setQuest] = useState([]);  
    const [pageCount, setpageCount] = useState(0);
    let limit = 10;

    useEffect(() => {
        QuestService.fetchQuestUser({userId:user.user.id, limit,page:1}).then((response)=>{
            if(response.status===200){
                setQuest(response.data.docs)
                setpageCount(response.data.totalPages);
            }                
        })
    },[]);

    const fetchPage = async (currentPage) => {
        QuestService.fetchQuestUser({authorId:user.user.id,limit,page:currentPage}).then((response)=>{
            setQuest(response.data.docs);
      })
      };

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        await fetchPage(currentPage);
      };

    return (
        <div>
            {quest.map(item=><div>{item.Text}</div>)}
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

export default Quest;