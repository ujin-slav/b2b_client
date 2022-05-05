import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Table} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { CARDASK } from '../utils/routes';
import { fetchFilterAsks,fetchUser } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import dateFormat, { masks } from "dateformat";
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import { CircleFill } from 'react-bootstrap-icons';

const TableAsk = observer(({authorId}) => {
    const {ask} = useContext(Context);
    const {myalert} = useContext(Context);
    const history = useHistory();
    const [pageCount, setpageCount] = useState(0);
    let limit = 10;

    useEffect(() => {
        fetchFilterAsks({filterCat:ask.categoryFilter,filterRegion:ask.regionFilter,limit,page:1}).then((data)=>{
            ask.setAsk(data.docs)
            setpageCount(data.totalPages);
        })
      },[ask.categoryFilter]);

    const fetchComments = async (currentPage) => {
      fetchFilterAsks({limit,page:currentPage}).then((data)=>{
        ask.setAsk(data.docs)
    })};

    const handlePageClick = async (data) => {
      let currentPage = data.selected + 1;
      await fetchComments(currentPage);
    };
    return (
      <div>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Название</th>
            <th>Статус</th>
            <th>ИНН заказчика</th>
            <th>Регионы</th>
            <th>Категории товара</th>
            <th>Окончание предложений</th>
          </tr>
        </thead>
        <tbody className="tableAsk">
        {ask?.getAsk().map((item,index)=>{
          console.log(getCategoryName(item.Category, categoryNodes))
          return (
          <tr key={index} onClick={()=>history.push(CARDASK + '/' + item._id)}>
            <td>{index+1}</td>
            <td>{item.Name}</td>
            {Date.parse(item.EndDateOffers) > new Date().getTime() ?
            <td className="tdGreen">
            Активная
            </td>
            :
            <td className="tdRed">
            Истек срок
            </td>
            }
            <td>{item.Author.inn}</td>
            <td className="categoryColumn">
                {getCategoryName(item.Region, regionNodes).join(", ").length>50 ?
                `${getCategoryName(item.Region, regionNodes).join(", ").substring(0, 50)}...`
                 :
                 getCategoryName(item.Region, regionNodes).join(", ")
                 }</td>
            <td className="categoryColumn">
                {getCategoryName(item.Category, categoryNodes).join(", ").length>50 ?
                `${getCategoryName(item.Category, categoryNodes).join(", ").substring(0, 50)}...`
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

export default TableAsk;