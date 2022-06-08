import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Table} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { CARDASK } from '../utils/routes';
import { fetchInvitedAsks} from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import dateFormat, { masks } from "dateformat";
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import { CircleFill } from 'react-bootstrap-icons';
import {checkAccessAsk} from '../utils/CheckAccessAsk'

const Invited = observer(({authorId}) => {
    const {ask} = useContext(Context);
    const {myalert} = useContext(Context);
    const history = useHistory();
    const [pageCount, setpageCount] = useState(0);
    const [currentPage,setCurrentPage] = useState(1)
    const {user} = useContext(Context);
    let limit = 10;

    useEffect(() => {
        fetchInvitedAsks({
          email:user.user.email,
          limit,page:currentPage}).then((data)=>{
          ask.setAsk(data.docs)
          setpageCount(data.totalPages);
        })
      },[]);

    const fetchComments = async (currentPage) => {
        fetchInvitedAsks({
        email:user.user.email,
        limit,page:currentPage}).then((data)=>{
        ask.setAsk(data.docs)
    })};

    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1);
      await fetchComments(data.selected + 1);
    };

    const redirect = (item)=>{
        history.push(CARDASK + '/' + item._id)
    }

    return (
      <div>
        <Table striped bordered hover className="tableAsk">
            <col style={{"width":"2%"}}/>
          	<col style={{"width":"5%"}}/>
            <col style={{"width":"5%"}}/>
          	<col style={{"width":"6%"}}/>
            <col style={{"width":"25%"}}/>
          	<col style={{"width":"10%"}}/>
            <col style={{"width":"10%"}}/>
          	<col style={{"width":"5%"}}/>
        <thead>
          <tr>
            <th>#</th>
            <th>Название</th>
            <th>Статус</th>
            <th>Организация</th>
            <th>Текст</th>
            <th>Регионы</th>
            <th>Категории товара</th>
            <th>Окончание предложений</th>
          </tr>
        </thead>
        <tbody className="tableAsk">
        {ask?.getAsk()?.map((item,index)=>{
          return (
          <tr key={index} onClick={()=>redirect(item)}>
            <td>{index+1+(currentPage-1)*limit}</td>
            <td>{item.Name.length>15 ?
                `${item.Name.substring(0, 15)}...`
                 :
                 item.Name
                 }</td>
            {Date.parse(item.EndDateOffers) > new Date().getTime() ?
            <td className="tdGreen">
            Активная
            </td>
            :
            <td className="tdRed">
            Истек срок
            </td>
            }
            <td>{item.Author.inn}
                <div>{item.Author.nameOrg}</div>
            </td>
            <td>
            {item.Text.length>50 ?
                `${item.Text.substring(0, 50)}...`
                 :
                 item.Text
                 }</td>
            <td className="categoryColumn">
                {getCategoryName(item.Region, regionNodes).join(", ").length>40 ?
                `${getCategoryName(item.Region, regionNodes).join(", ").substring(0, 40)}...`
                 :
                 getCategoryName(item.Region, regionNodes).join(", ")
                 }</td>
            <td className="categoryColumn">
                {getCategoryName(item.Category, categoryNodes).join(", ").length>40 ?
                `${getCategoryName(item.Category, categoryNodes).join(", ").substring(0, 40)}...`
                 :
                 getCategoryName(item.Category, categoryNodes).join(", ")
                 }</td>
            <td>{dateFormat(item.EndDateOffers, "dd/mm/yyyy HH:MM:ss")}</td>
          </tr>)
        })}  
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
     </div> 
    );
});

export default Invited;