import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Table} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { CARDASK, MODIFYASK } from '../utils/routes';
import { fetchAsks } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import ModalAlert from './ModalAlert';
import AskService from '../services/AskService'
import { XCircle, Pen } from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";

const TableAsk = observer(() => {
    const {askUser} = useContext(Context);
    const {user} = useContext(Context);
    const {myalert} = useContext(Context);
    const [deleteId,setDeleteId] = useState();
    const [modalActive,setModalActive] = useState(false);
    const history = useHistory();
    const [pageCount, setpageCount] = useState(0);
    let limit = 10;

    useEffect(() => {
        if(user.user.id){
            fetchAsks({authorId:user.user.id,limit,page:1}).then((data)=>{
                askUser.setAsk(data.docs)
                setpageCount(data.totalPages);
            })
        }
      },[user.user]);

    const fetchPage = async (currentPage) => {
      fetchAsks({authorId:user.user.id,limit,page:currentPage}).then((data)=>{
        askUser.setAsk(data.docs)
    })};

    const deleteAsk = async () =>{
      const result = await AskService.deleteAsk(deleteId);
      if (result.status===200){
        myalert.setMessage("Успешно"); 
      } else {
        myalert.setMessage(result.data.message);
      }
       console.log(user.user.id);
    }

    const handlePageClick = async (data) => {
      let currentPage = data.selected + 1;
      await fetchPage(currentPage);
    };
    return (
      <div>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Название</th>
            <th>Статус</th>
            <th>Текст</th>
            <th>Окончание предложений</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
        {askUser?.getAsk().map((item, index)=>
          <tr key={index} onClick={()=>history.push(CARDASK + '/' + item._id)}>
            <td>{index+1}</td>
            <td>{item.Name}</td>
            <td>
            {Date.parse(item.EndDateOffers) > new Date().getTime() ?
            <td className="tdGreen">
            Активная
            </td>
            :
            <td className="tdRed">
            Истек срок
            </td>
            }
            </td>
            <td className="tdText">
              {item.Text.length > 50 ? 
              `${item.Text.substring(0,400)}...`
              :
              item.Text
              }
            </td>
            <td>{dateFormat(item.EndDateOffers, "dd/mm/yyyy")}</td>
            <td><XCircle color="red" style={{"width": "25px", "height": "25px"}}
                onClick={(e)=>{
                    e.stopPropagation();
                    setModalActive(true);
                    setDeleteId(item._id)
            }} /><Pen color="green" style={{"margin-left":"15px","width": "25px", "height": "25px"}}
            onClick={(e)=>{
                e.stopPropagation();
                history.push(MODIFYASK + '/' + item._id)
        }} /></td>
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
              setActive={setModalActive} funRes={deleteAsk}/>
     </div> 
    );
});

export default TableAsk;