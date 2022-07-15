import {React,useContext,useEffect,useState} from 'react';
import {Card,Col,Row} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import SpecOfferService from '../services/SpecOfferService'
import {useHistory} from 'react-router-dom';
import {Context} from "../index";
import dateFormat from "dateformat";
import {getCategoryName} from '../utils/Convert'
import { regionNodes } from '../config/Region';
import CardSpecOffer from '../pages/CardSpecOffer';
import { CARDSPECOFFER,CREATESPECOFFER, MODIFYSPECOFFER } from '../utils/routes';
import ReactPaginate from "react-paginate";
import { PlusCircleFill,XCircle,Pen} from 'react-bootstrap-icons';
import ModalAlert from '../components/ModalAlert';

const MySpecOffers = observer(() => {
    const {ask} = useContext(Context);
    const [specOffers, setSpecOffers] = useState([]);
    const {myalert} = useContext(Context);
    const history = useHistory();
    const [modalActive,setModalActive] = useState(false);
    const [deleteId,setDeleteId] = useState();
    const [pageCount, setpageCount] = useState(0);
    const {user} = useContext(Context);
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(false)
    let limit = 10;

    useEffect(() => {
        if(user.user.id){
            SpecOfferService.getSpecOfferUser({
                id:user.user.id,
                limit,page:currentPage
            }).then((data)=>{
                setSpecOffers(data.docs)
                setpageCount(data.totalPages);
            })
        }
      },[user.user,loading]);

    const fetchComments = async (currentPage) => {
        SpecOfferService.getSpecOfferUser({
            id:user.user.id,
            limit,page:currentPage
    }).then((data)=>{
        setSpecOffers(data.docs)
        setpageCount(data.totalPages);
    })};

    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1)
      await fetchComments(data.selected + 1);
    };

    const deleteSpecOffer = async () =>{
        const result = await SpecOfferService.deleteSpecOffer({id:deleteId});
        if (result.status===200){
          myalert.setMessage("Успешно"); 
          setLoading(!loading)
        } else {
          myalert.setMessage(result.data.message);
        }
      }

    return (
        <div>
        <PlusCircleFill onClick={()=>history.push(CREATESPECOFFER)}  className="addSpecOffer"/>
        <span className="createNewOfferText">Создать новое</span>
        <div className='parentSpec'>
            {specOffers?.map((item)=>{
            return(
                <div onClick={()=>history.push(CARDSPECOFFER + '/' + item._id)} className='childSpec'>
                    <div  className="delSpecOfferContainer">
                        <XCircle className="delSpecOffer"
                            onClick={(e)=>{
                                e.stopPropagation()
                                console.log(item)
                                setModalActive(true);
                                setDeleteId(item._id)
                            }}
                        />
                    </div>
                    <img 
                    className="fotoSpec"
                    src={process.env.REACT_APP_API_URL + `getpic/` + item.Files[0].filename} />
                    <div className="specName">
                        {item.Name}
                    </div>
                    <div className="specPrice">
                        {item.Price} ₽
                    </div>
                    <div className="specNameOrg">
                        {item.NameOrg}
                    </div>
                    <div className="specCloudy">
                        {getCategoryName(item.Region, regionNodes).join(", ").length>40 ?
                        `${getCategoryName(item.Region, regionNodes).join(", ").substring(0, 40)}...`
                        :
                        getCategoryName(item.Region, regionNodes).join(", ")
                        }
                    </div>
                    <div className="specCloudy">
                        {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
                    </div>
                    <div>
                        <a href="javascript:void(0)" 
                            onClick={(e)=>{
                                e.stopPropagation()
                                history.push(MODIFYSPECOFFER + '/' + item._id)
                            }}>
                        Редактировать
                        </a>
                        <Pen  className="changeSpecOffer"/>
                    </div>
                </div>
                
            )
            })}
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
              setActive={setModalActive} funRes={deleteSpecOffer}/>
        </div>
    );
});

export default MySpecOffers;