import React,{useEffect,useState,useContext} from 'react';
import {fetchUserOffers} from '../http/askAPI';
import { fetchOffers } from '../http/askAPI';
import {Card} from "react-bootstrap";
import {Context} from "../index";
import ModalAlert from './ModalAlert';
import AskService from '../services/AskService'
import { XCircle} from 'react-bootstrap-icons';
import ReactPaginate from "react-paginate";
import {observer} from "mobx-react-lite";
import {Eye} from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";

const TableOffer = observer(() => {

    const {offerUser} = useContext(Context);
    const [modalActive,setModalActive] = useState(false);
    const [deleteId,setDeleteId] = useState();
    const [offers, setOffers] = useState();
    const {user} = useContext(Context);  
    const {myalert} = useContext(Context);
    const [pageCount, setpageCount] = useState(0);
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(false)
    let limit = 10;

    useEffect(() => {
      AskService.fetchUserOffers({authorId:user.user.id, limit,page:currentPage}).then((data)=>{
            offerUser.setOffer(data.docs);
            setpageCount(data.totalPages);
            console.log(data)
        })
    },[]);

    const fetchPage = async (currentPage) => {
      AskService.fetchUserOffers({authorId:user.user.id,limit,page:currentPage}).then((data)=>{
        offerUser.setOffer(data.docs);
    })
    };

    const deleteOffer = async () =>{
      const result = await AskService.deleteOffer(deleteId);
      offerUser.setOffer(
        offerUser.getOffer().filter(item=>item._id!==deleteId)
      )
      if (result.status===200){
        myalert.setMessage("Успешно"); 
        setLoading(!loading)
      } else {
        myalert.setMessage(result.data.message);
      }
      console.log(result);
    }

    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1)
      await fetchPage(data.selected + 1);
    };

    return (
      <div>
        <div className='parentSpecAsk'>
        {offerUser.getOffer().map((item,index)=>
          <div key={index} className='childSpecAsk'>
            <Card>
              <Card.Header>{item?.Ask?.Name?.length>15 ?
            `${item.Name.substring(0, 15)}...`
             :
             item?.Ask?.Name
             }
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
            <div>
            <div>{item?.Ask?.Author?.name}</div> 
            <div>{item?.Ask?.Author?.nameOrg}</div>
            </div>
            <div className="tdText">
            {item?.Ask?.Text?.length > 50 ? 
              `${item?.Ask?.Text?.substring(0,50)}...`
              :
              item?.Ask?.Text
            }
            </div>
            <div>Текст: {item?.Text?.length > 30 ? 
              `${item?.Text?.substring(0,30)}...`
              :
              item?.Text
              }</div>
            <div>Стоимость: {item?.Price}</div>
            <div>
            {item?.Files?.map((item,index)=><div key={index}>
                              <a href={process.env.REACT_APP_API_URL + `download/` + item.filename}>{item.originalname}</a>
                              <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                              ${process.env.REACT_APP_API_URL}download/${item.filename}`)}/>
                          </div>)}
            </div>
            <div className="specCloudy">{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</div>
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
              setActive={setModalActive} funRes={deleteOffer}/>
    </div>
    );
});

export default TableOffer;