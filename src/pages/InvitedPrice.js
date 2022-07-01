import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Table,Container} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { MODIFYPRICEASK,CARDPRICEASK } from '../utils/routes';
import { fetchAsks } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import ModalAlert from '../components/ModalAlert';
import AskService from '../services/AskService'
import { XCircle, Pen,Link45deg } from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import PriceService from '../services/PriceService'

const InvitedPriceAsk =  observer(() => {
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
                console.log(data)
              })
        }
      },[user.user,loading]);

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
        <Table striped hover  className="tableAsk">
            <col style={{"width":"3%"}}/>
          	<col style={{"width":"10%"}}/>
            <col style={{"width":"5%"}}/>
          	<col style={{"width":"15%"}}/>
            <col style={{"width":"5%"}}/>
        <thead>
          <tr>
            <th>#</th>
            <th>От кого</th>
            <th>Сумма</th>
            <th>Комментарий</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
        {askPriceUser?.map((item, index)=>
          <tr key={index}  
            onClick={()=>history.push(CARDPRICEASK + '/' + item._id)}>
            <td>{index+1+(currentPage-1)*limit}</td>
            <td>{item?.Author?.name} {item?.Author?.nameOrg}</td>
            <td>{item?.Sum}</td>
            <td>{item?.Comment}</td>
            <td>{dateFormat(item?.Date, "dd/mm/yyyy HH:MM:ss")}</td>
          </tr>
        )}  
        </tbody>
        </Table>
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
});

export default InvitedPriceAsk;