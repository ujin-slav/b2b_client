import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Table,Container} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { CARDASK, MODIFYASK } from '../utils/routes';
import { fetchAsks } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import ModalAlert from './ModalAlert';
import AskService from '../services/AskService'
import { XCircle, Pen,Link45deg } from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";

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
    return (
      <div>
        <Table striped hover  className="tableAsk">
            <col style={{"width":"3%"}}/>
          	<col style={{"width":"5%"}}/>
            <col style={{"width":"5%"}}/>
          	<col style={{"width":"25%"}}/>
            <col style={{"width":"15%"}}/>
          	<col style={{"width":"7%"}}/>
            <col style={{"width":"6%"}}/>
        <thead>
          <tr>
            <th>#</th>
            <th>Название</th>
            <th>Статус</th>
            <th>Текст</th>
            <th>Комментарий</th>
            <th>Окончание предложений</th>
            <th>Уд./Ре./Ко.</th>
          </tr>
        </thead>
        <tbody>
        {askUser?.getAsk().map((item, index)=>
          <tr key={index} onClick={()=>history.push(CARDASK + '/' + item._id)}>
            <td>{index+1+(currentPage-1)*limit}</td>
            <td>{item.Name.length>15 ?
                `${item.Name.substring(0, 15)}...`
                 :
                 item.Name
                 }</td>
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
              {item.Text.length > 30 ? 
              `${item.Text.substring(0,30)}...`
              :
              item.Text
              }
            </td>
            <td>{item.Comment.length > 30 ? 
              `${item.Comment.substring(0,30)}...`
              :
              item.Comment
              }</td>
            <td>{dateFormat(item.EndDateOffers, "dd/mm/yyyy HH:MM:ss")}</td>
            <td><XCircle color="red" style={{"width": "25px", "height": "25px"}}
                onClick={(e)=>{
                    e.stopPropagation();
                    setModalActive(true);
                    setDeleteId(item._id)
            }} /><Pen color="green" style={{"margin-left":"15px","width": "25px", "height": "25px"}}
            onClick={(e)=>{
                e.stopPropagation();
                history.push(MODIFYASK + '/' + item._id)
        }} />
            <Link45deg style={{"margin-left":"15px","width": "25px", "height": "25px"}} 
              onClick={(e)=>{
                e.stopPropagation();
                navigator.clipboard.writeText(process.env.REACT_APP_URL + CARDASK + '/' + item._id)
                myalert.setMessage("Ссылка скопирована");
              }}/>
        </td>
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