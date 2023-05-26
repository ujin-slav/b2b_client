import React,{useEffect,useState,useContext} from 'react';
import {useHistory} from 'react-router-dom';
import ru from "date-fns/locale/ru"
import {Form, InputGroup,Button,Card,Row} from "react-bootstrap";
import {Context} from "../index";
import ModalAlert from '../components/ModalAlert';
import {Search} from 'react-bootstrap-icons';
import ReactPaginate from "react-paginate";
import {ORGINFO} from "../utils/routes";
import ContrService from '../services/ContrService';
import bin from "../icons/bin.svg";

const MyContr = () => {
    const [list,setList] = useState([]);;
    const [modalActive,setModalActive] = useState(false);
    const [deleteId,setDeleteId] = useState();
    const history = useHistory();
    const {user} = useContext(Context);  
    const {myalert} = useContext(Context);
    const[fetching,setFetching] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const[search,setSearch] = useState("");
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(false)
    const[limit,setLimit] = useState(10);

    useEffect(() => {
        setLoading(true)
        ContrService.fetchContr({user:user.user.id,search,limit,page:currentPage})
        .then((data)=>{
                    console.log(data)
                    setList(data.docs);
                    setPageCount(data.totalPages);
                    setCurrentPage(data.page)
        }).finally(
            ()=>setLoading(false)
        )
      },[fetching]);

    const fetchPage = async (currentPage) => {
        setCurrentPage(currentPage)
        setFetching(!fetching)
    };

    const handlePageClick = async (data) => {
        await fetchPage(data.selected + 1);
      }
  
      const handleSearch = () =>{
        setCurrentPage(1)
        setFetching(!fetching)
      }
  
      const handleSelect = (value) =>{
          setCurrentPage(1)
          setLimit(value)
          setFetching(!fetching)
     }

     const deleteContr =async () =>{
        const result = await ContrService.delContr({id:deleteId})
        if (result.errors){
            myalert.setMessage(result.message); 
        } else {
            setFetching(!fetching)
        }
    }

    return (
        <div>
        <Form className="searchFormMenu">
          <Row> 
              <InputGroup className='mt-2'>
                  <Form.Control
                      onChange={(e)=>setSearch(e.target.value)}
                      placeholder="Название или инн организации"
                  />
                  <Button variant="outline-secondary" onClick={()=>handleSearch()}>
                      <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                  </Button>
              </InputGroup>
          </Row>   
          <Row>
          <div className='inputGroupMenuSelect'>
                  <div className='captionMenuSelect'>Показать:</div>
                  <Form.Control
                      as="select"  
                      value={limit}
                      className='searchFormMenuSelect'
                      onChange={(e)=>handleSelect(e.target.value)} 
                  >       
                          <option>10</option>
                          <option value='25'>25</option>
                          <option value='50'>50</option>
                          <option value='100'>100</option>
                  </Form.Control>
          </div>
          </Row>
      </Form>
      {!loading ? 
      <div>
         <div className='parentSpecAsk'>
      {list?.map((item,index)=>
             <div key={index} class="childCarousel">
                <div className="cardContrHead">
                    <a href="javascript:void(0)" onClick={()=>history.push(ORGINFO + '/' + item?._id)}>
                    <div>{item?.nameOrg}</div>
                        <img 
                            className="delContr" 
                            src={bin}
                            onClick={(e)=>{
                                e.stopPropagation();
                                setModalActive(true);
                                setDeleteId(item._id)
                            }}
                        /> 
                    </a>
                    <div>{item?.inn}</div>
                </div>
                <img className="logo" src={process.env.REACT_APP_API_URL + `getlogo/` + item?.logo?.filename} />
            </div>
      )}  
    </div> 
    <ReactPaginate
          forcePage = {currentPage-1}
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
            setActive={setModalActive} funRes={deleteContr}/>
      </div>
      :
      <div class="loader">Loading...</div>
      }
      </div>
    );
};

export default MyContr;