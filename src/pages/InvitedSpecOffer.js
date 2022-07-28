import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { MODIFYPRICEASK,CARDPRICEASK } from '../utils/routes';
import SpecOfferService from '../services/SpecOfferService'
import { fetchAsks } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import ModalAlert from '../components/ModalAlert';
import AskService from '../services/AskService'
import { XCircle, Pen,Link45deg } from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import PriceService from '../services/PriceService'

const InvitedSpecOffer =  observer(() => {
    const {user} = useContext(Context);
    const {chat} =  useContext(Context)
    const [specAsk, setSpecAsk] = useState()
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
            SpecOfferService.getSpecAskUser({to:user.user.id,limit,page:currentPage}).then((data)=>{
                setSpecAsk(data.docs)
                setpageCount(data.totalPages);
              })
              chat.socket.emit("get_unread");
        }
      },[user.user,loading]);

    const fetchPage = async (currentPage) => {
        SpecOfferService.getSpecAskUser({authorId:user.user.id,limit,page:currentPage}).then((data)=>{
            setSpecAsk(data.docs)
        })
    };

    const deleteSpecAsk = async () =>{
      const result = await SpecOfferService.deletePriceAsk(deleteId);
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
        {specAsk?.map((item, index)=>
          <div key={index}  
           className='childSpecAsk'>
            <Card>
              <Card.Header>
              </Card.Header>
            <div className='cardPadding'>
            <div>
                <div>{item?.Name}</div>
                <div>{item?.Email}</div>
                <div>{item?.Telefon}</div>
                <div>{item?.City}</div>
            </div>
            <div>{item?.Amount}</div>
            <div>{item?.Comment}</div>
            <div>{dateFormat(item?.Date, "dd/mm/yyyy HH:MM:ss")}</div>
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
              setActive={setModalActive} funRes={deleteSpecAsk}/>
     </div> 
    );
});

export default InvitedSpecOffer;