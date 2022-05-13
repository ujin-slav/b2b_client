import React,{useEffect,useState,useContext} from 'react';
import {fetchUserOffers} from '../http/askAPI';
import { fetchOffers } from '../http/askAPI';
import {Table, Container} from "react-bootstrap";
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
    let limit = 10;

    useEffect(() => {
      AskService.fetchUserOffers({authorId:user.user.id, limit,page:1}).then((data)=>{
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
      } else {
        myalert.setMessage(result.data.message);
      }
      console.log(result);
    }

    const handlePageClick = async (data) => {
      let currentPage = data.selected + 1;
      await fetchPage(currentPage);
    };

    return (
      <Container className="mx-auto my-4">
         <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Автор</th>
            <th>Текст</th>
            <th>Сообщение</th>
            <th>Цена</th>
            <th>Фаилы</th>
            <th>Дата</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
        {offerUser.getOffer().map((item,index)=>
          <tr key={index}>
            <td>{index+1}</td>
            <td>
            <div>{item.Ask.Author.name}</div> 
            <div>{item.Ask.Author.nameOrg}</div>
            </td>
            <td className="tdText">
            {item.Text.length > 50 ? 
              `${item.Ask.Text.substring(0,400)}...`
              :
              item.Ask.Text
            }
            </td>
            <td>{item.Text}</td>
            <td>{item.Price}</td>
            <td>
            {item?.Files?.map((item,index)=><div key={index}>
                              <a href={process.env.REACT_APP_API_URL + `download/` + item.filename}>{item.originalname}</a>
                              <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                              ${process.env.REACT_APP_API_URL}download/${item.filename}`)}/>
                          </div>)}
            </td>
            <td>{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</td>
            <td><XCircle color="red" style={{"width": "25px", "height": "25px"}} onClick={()=>{
              setModalActive(true);
              setDeleteId(item._id)}}/></td>
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
              setActive={setModalActive} funRes={deleteOffer}/>
    </Container>
    );
});

export default TableOffer;