import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { fetchLentStatus } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import dateFormat, { masks } from "dateformat";
import { CARDASK, CARDPRICEASK } from '../utils/routes';

const LentStatus = observer(() => {
    const [lent, setLent] = useState([])
    const {user} = useContext(Context)
    const {myalert} = useContext(Context)
    const {chat} =  useContext(Context)
    const history = useHistory();
    const [pageCount, setpageCount] = useState(0)
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(false)
    let limit = 10;

    useEffect(() => {
        if(user?.user?.id){
            fetchLentStatus({userId:user.user.id,limit,page:currentPage}).then((data)=>{
                setLent(data.docs)
                setpageCount(data.totalPages);
            })
            chat.socket.emit("get_unread");
        }
      },[user.user,loading]);

    const fetchPage = async (currentPage) => {
        fetchLentStatus({userId:user.user.id,limit,page:currentPage}).then((data)=>{
          setLent(data.docs)
    })};


    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1)
      await fetchPage(data.selected + 1);
    }

    const redirect = (item)=>{
      if(item.PriceAsk){
        history.push(CARDPRICEASK + '/' + item?.PriceAsk?._id)
      }else{
        history.push(CARDASK + '/' + item?.Ask?._id)
      }
    }

    return (
      <div className='container-mycontr mt-3'>
       <div class="lentStatus overflow-auto">
          {lent?.map((item,index)=>
            <div key={index} class="userCardListUser">
              <div class="userCardListUserFlex">
                <div className='mx-3'> 
                    <span className="specNameDoc" onClick={()=>redirect(item)}>№{dateFormat(item?.Ask?.Date || item?.PriceAsk?.Date, "ddmmyyyyHHMMss")}</span> 
                    <div>от {dateFormat(item?.Ask?.Date || item?.PriceAsk?.Date, "dd/mm/yyyy HH:MM:ss")}</div>
                </div>
                <div>Изменил статус:</div>
                <div>
                  <span className="specCloudy">{item?.Author?.name} {item?.Author?.nameOrg}</span>
                </div>
                <div>Было: <span className="specCloudy">{item?.PrevStatus?.labelRu}</span></div>
                <div>
                Стало:
                <span className="specCloudy"> {item?.Ask?.Status?.Status?.labelRu || item?.PriceAsk?.Status?.Status?.labelRu}</span> 
                </div>
                <div>
                  Дата изменения:  
                  <span className="specCloudy"> {dateFormat(item?.Date, "dd/mm/yyyy HH:MM:ss")}</span>
                </div>
              </div>
            </div>
            )}  
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
})

export default LentStatus;