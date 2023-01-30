import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card, Form, InputGroup,Button,Col,Row} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { fetchLentStatus } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import { XCircle, Search} from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import { CARDASK, CARDPRICEASK } from '../utils/routes';
import DatePicker, { registerLocale } from 'react-datepicker'

const LentStatus = observer(() => {
    const [lent, setLent] = useState([])
    const {user} = useContext(Context)
    const {myalert} = useContext(Context)
    const {chat} =  useContext(Context)
    const history = useHistory();
    const[searchInn,setSearchInn] = useState("");
    const[searchStatus,setSearchStatus] = useState("");
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const [pageCount, setPageCount] = useState(0)
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(false)
    const[fetching,setFetching] = useState(true);
    const[limit,setLimit] = useState(10);

    useEffect(() => {
      setLoading(true)
      fetchLentStatus({
          userId:user.user.id,
          limit,
          searchInn,
          searchStatus,
          page:currentPage,
          startDate,
          endDate
          }).then((data)=>{
                  setLent(data.docs);
                  setPageCount(data.totalPages);
                  setCurrentPage(data.page)
                  chat.socket.emit("get_unread");
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

    const handleSearchInn = () =>{
      setCurrentPage(1)
      setFetching(!fetching)
    }

    const handleSearchStatus = () =>{
      setCurrentPage(1)
      setFetching(!fetching)
    }

    const handleClickDate = () =>{
      setCurrentPage(1)
      setFetching(!fetching)
    }
   
    const handleSelect = (value) =>{
      setCurrentPage(1)
      setLimit(value)
      setFetching(!fetching)
    }

    const redirect = (item)=>{
      if(item.PriceAsk){
        history.push(CARDPRICEASK + '/' + item?.PriceAsk?._id)
      }else{
        history.push(CARDASK + '/' + item?.Ask?._id)
      }
    }

    return (
      <div className='container-mycontr mt-1'>
        <Form className="searchFormMenu">
            <Row> 
                <InputGroup className='mt-2'>
                    <Form.Control
                        onChange={(e)=>setSearchInn(e.target.value)}
                        placeholder="Название или инн организации"
                    />
                    <Button variant="outline-secondary" onClick={()=>handleSearchInn()}>
                        <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                    </Button>
                </InputGroup>
            </Row>    
            <Row> 
                <InputGroup className='mt-2'>
                    <Form.Control
                        onChange={(e)=>setSearchStatus(e.target.value)}
                        placeholder="Статус(в настоящий момент)"
                    />
                    <Button variant="outline-secondary" onClick={()=>handleSearchStatus()}>
                        <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                    </Button>
                </InputGroup>
            </Row>  
            <Row>
            <div className='inputGroupMenuSelect'>
                    <div className='captionMenuSelect'>Период:</div>
                        <InputGroup>
                            <DatePicker
                                locale="ru"
                                selected={startDate}
                                name="StartDateOffers"
                                className='form-control datePicker'
                                dateFormat="dd.MM.yyyy"
                                onChange={date=>setStartDate(date)}
                            />
                            <Button 
                                variant="outline-secondary"
                                className='buttonSearchDataPicker'
                                onClick={()=>handleClickDate()}
                            >
                                <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                            </Button>
                        </InputGroup>
                        <InputGroup>
                            <DatePicker
                                locale="ru"
                                selected={endDate}
                                name="EndDateOffers"
                                className='form-control datePicker'
                                dateFormat="dd.MM.yyyy"
                                onChange={date=>setEndDate(date)}
                            />
                            <Button 
                                variant="outline-secondary" 
                                className='buttonSearchDataPicker'
                                onClick={()=>handleClickDate()}
                            >
                                <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                            </Button>
                        </InputGroup>
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
            <div class="lentStatus overflow-auto mt-2">
                  {lent?.map((item,index)=>
                    <div key={index} class="userCardListUser">
                      <div class="userCardListUserFlex">
                        <div className='mx-3'> 
                            <span className="specNameDoc" onClick={()=>redirect(item)}>№{dateFormat(item?.Ask?.Date || item?.PriceAsk?.Date, "ddmmyyyyHHMMss")}</span> 
                            <div>от {dateFormat(item?.Ask?.Date || item?.PriceAsk?.Date, "dd/mm/yyyy HH:MM:ss")}</div>
                        </div>
                        <div>Изменил статус:</div>
                        <div>
                          <span className="specCloudy">{item?.Author?.name} {item?.Author?.nameOrg}</span>
                        </div>
                        <div>Было: <span className="specCloudy">{item?.PrevStatus?.labelRu}</span></div>
                        <div>
                        Стало:
                        <span className="specCloudy"> {item?.Ask?.Status?.Status?.labelRu || item?.PriceAsk?.Status?.Status?.labelRu}</span> 
                        </div>
                        <div>
                          Дата изменения:  
                          <span className="specCloudy"> {dateFormat(item?.Date, "dd/mm/yyyy HH:MM:ss")}</span>
                        </div>
                      </div>
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
          </div> 
        : 
          <div class="loader">Loading...</div>
        }
    </div>
    );
})

export default LentStatus;