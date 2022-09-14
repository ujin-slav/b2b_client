import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { CARDASK, MODIFYASK } from '../utils/routes';
import { fetchAsks } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import ModalAlert from './ModalAlert';
import AskService from '../services/AskService'
import { XCircle, Pen,Link45deg } from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';

const TableAsk = observer(() => {
    const {askUser} = useContext(Context);
    const {user} = useContext(Context);
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
            fetchAsks({authorId:user.user.id,limit,page:currentPage}).then((data)=>{
                askUser.setAsk(data.docs)
                setpageCount(data.totalPages);
            })
        }
      },[loading]);

    const fetchPage = async (currentPage) => {
      fetchAsks({authorId:user.user.id,limit,page:currentPage}).then((data)=>{
        askUser.setAsk(data.docs)
    })};

    const deleteAsk = async () =>{
      const result = await AskService.deleteAsk(deleteId);
      if (result.status===200){
        myalert.setMessage("Успешно"); 
        setLoading(!loading)
      } else {
        myalert.setMessage(result.data.message);
      }
       console.log(user.user.id);
    }

    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1)
      await fetchPage(data.selected + 1);
    };
    
    const redirect = (item)=>{
        history.push(CARDASK + '/' + item._id)
    }

    return (
      <div>
      <div className='parentSpecAsk'>
        {askUser?.getAsk().map((item, index)=>
               <div onClick={()=>redirect(item)} className='childSpecAsk'>
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
                 <div className="specName">
                       {item.Name.length>15 ?
                       `${item.Name.substring(0, 15)}...`
                       :
                       item.Name
                       }
               </div>
               </Card.Header>
               <div className='cardPadding'>
               <div>
               Текст: {item.Text.length>50 ?
               `${item.Text.substring(0, 50)}...`
                :
                item.Text
                }
               </div>
               <div>
                       {Date.parse(item.EndDateOffers) > new Date().getTime() ?
                       <div style={{color:"green"}}>
                       Активная
                       </div>
                       :
                       <div style={{color:"red"}}>
                       Истек срок
                       </div>
                       } 
               </div>
               <div>
                       <div>ИНН: {item.Author.inn}</div>
                       <div>Орг: {item.Author.nameOrg}</div>
               </div>
               <div className="specCloudy">
                   {getCategoryName(item.Region, regionNodes).join(", ").length>40 ?
                   `${getCategoryName(item.Region, regionNodes).join(", ").substring(0, 40)}...`
                   :
                   getCategoryName(item.Region, regionNodes).join(", ")
                   }
               </div>
               <div className="specCloudy">
                   {getCategoryName(item.Category, categoryNodes).join(", ").length>40 ?
                   `${getCategoryName(item.Category, categoryNodes).join(", ").substring(0, 40)}...`
                   :
                   getCategoryName(item.Category, categoryNodes).join(", ")
                   }
               </div>
                <div>
                <a href="javascript:void(0)" 
                    onClick={(e)=>{
                        e.stopPropagation();
                        history.push(MODIFYASK + '/' + item._id)
                }}>
                Редактировать
                </a>
                <Pen  className="changeSpecOffer"/>
                </div>
                <div>
                <a href="javascript:void(0)" 
                    onClick={(e)=>{
                        e.stopPropagation();
                        navigator.clipboard.writeText(process.env.REACT_APP_URL + CARDASK + '/' + item._id)
                        myalert.setMessage("Ссылка скопирована");
                    }}>
                Скопировать ссылку
                </a>
                <Link45deg  className="changeSpecOffer"/>
                </div>
                <div className="specCloudy">
                   {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
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
        setActive={setModalActive} funRes={deleteAsk}/>
    </div>
    );
});

export default TableAsk;