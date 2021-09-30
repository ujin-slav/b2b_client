import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Table} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { CARDASK } from '../utils/routes';
import { fetchAsks } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";

const TableAsk = observer(({authorId}) => {
    const {ask} = useContext(Context);
    const history = useHistory();
    const [pageCount, setpageCount] = useState(0);
    let limit = 10;

    useEffect(() => {
        fetchAsks({authorId,limit,page:1}).then((data)=>{
            ask.setAsk(data.docs)
            setpageCount(data.totalPages);
        })
      },[]);
    const fetchComments = async (currentPage) => {
      fetchAsks({limit,page:currentPage}).then((data)=>{
        ask.setAsk(data.docs)
    })

    };

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
            <th>Максимальная цена</th>
            <th>Окончание предложений</th>
          </tr>
        </thead>
        <tbody>
        {ask?.getAsk().map((item)=>
          <tr onClick={()=>history.push(CARDASK + '/' + item._id)}>
            <td>1</td>
            <td>{item.Name}</td>
            <td>{item.Status}</td>
            <td></td>
            <td></td>
            <td>{item.Price}</td>
            <td>{item.EndDateOffers}</td>
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
     </div> 
    );
});

export default TableAsk;