import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { MODIFYPRICEASK,CARDPRICEASK } from '../utils/routes';
import { fetchAsks } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import ModalAlert from '../components/ModalAlert';
import {ORGINFO} from "../utils/routes";
import AskService from '../services/AskService'
import { XCircle, Pen,Link45deg } from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import PriceService from '../services/PriceService'

const MyOrdersPrice = () => {
    const {user} = useContext(Context);
    const [askPriceUser, setAskPriceUser] = useState()
    const {myalert} = useContext(Context);
    const [deleteId,setDeleteId] = useState();
    const [modalActive,setModalActive] = useState(false);
    const history = useHistory();
    const [pageCount, setpageCount] = useState(0)
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(false)
    let limit = 10;

    useEffect(() => {
        if(user?.user?.id){
            PriceService.getAskPrice({authorId:user.user.id,limit,page:currentPage}).then((data)=>{
                setAskPriceUser(data.docs)
                setpageCount(data.totalPages);
            })
        }
      },[loading]);

    const fetchPage = async (currentPage) => {
       PriceService.getAskPrice({authorId:user.user.id,limit,page:currentPage}).then((data)=>{
            setAskPriceUser(data.docs)
        })
    };

    const deletePriceAsk = async () =>{
      const result = await PriceService.deletePriceAsk(deleteId);
      if (result.status===200){
        myalert.setMessage("Успешно"); 
        setLoading(!loading)
      } else {
        myalert.setMessage(result.data.message);
      }
    }

    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1)
      await fetchPage(data.selected + 1);
    };

    return (
      <div>
        <div className='parentSpecAsk'>
        {askPriceUser?.map((item, index)=>
          <div key={index}  
            className='childSpecAsk'
            onClick={()=>item?.Sent ?
              history.push(CARDPRICEASK + '/' + item._id)
              :
              history.push(MODIFYPRICEASK + '/' + item._id)
            }
          >
            <Card>
              <Card.Header>
              <span className="cardMenu">
                     <XCircle color="red"  className='menuIcon'
                    onClick={(e)=>{
                    e.stopPropagation();
                    setModalActive(true);
                    setDeleteId(item._id)
              }} />     
              </span> 
              </Card.Header>
            <div className='cardPadding'>
            <div>Получатель:&nbsp; 
              <a href="javascript:void(0)" onClick={(e)=>{
                e.stopPropagation()
                history.push(ORGINFO + '/' + item?.To?._id)
              }}>
                {item?.To?.name}, {item?.To?.nameOrg}
              </a>
            </div>
            <div>Стоимость: {item?.Sum}</div>
            <div></div>
            <div>Отправлен: {item?.Sent ?
                    <span style={{"color":"green"}}>
                    Да
                    </span>
                    :
                    <span  style={{"color":"red"}}>
                    Нет</span>
                    }</div>
            <div>
            </div>
          </div>
          </Card>
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
          <ModalAlert header="Вы действительно хотите удалить" 
              active={modalActive} 
              setActive={setModalActive} funRes={deletePriceAsk}/>
     </div> 
    );
};

export default MyOrdersPrice;