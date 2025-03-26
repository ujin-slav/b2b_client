import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card, Form, InputGroup,Button,Col,Row} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import {CARDSPECASK } from '../utils/routes';
import ru from "date-fns/locale/ru"
import "../style.css";
import ReactPaginate from "react-paginate";
import {  Search} from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import SpecOfferService from '../services/SpecOfferService'
import DatePicker, { registerLocale } from 'react-datepicker'
import {documentNum} from '../utils/documentNum'

const InvitedSpecOffer =  observer(() => {

  registerLocale("ru", ru)

  const {user} = useContext(Context);
  const {chat} = useContext(Context)
  const [askSpecOfferUser, setAskSpecOfferUser] = useState([])
  const {myalert} = useContext(Context);
  const [deleteId,setDeleteId] = useState();
  const [modalActive,setModalActive] = useState(false);
  const history = useHistory();
  const [pageCount, setPageCount] = useState(0)
  const [totalDocs, setTotalDocs] = useState(0)
  const [currentPage,setCurrentPage] = useState(1)
  const[searchInn,setSearchInn] = useState("");
  const[searchComment,setSearchComment] = useState("");
  const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
  const [endDate, setEndDate] = useState(new Date());
  const [loading,setLoading] = useState(false)
  const[fetching,setFetching] = useState(true);
  const[limit,setLimit] = useState(10);

    useEffect(() => {
      setLoading(true)
      SpecOfferService.getSpecAskUser({
          to:user.user.id,
          limit,
          searchInn,
          page:currentPage,
          startDate,
          endDate
          }).then((data)=>{
                setAskSpecOfferUser(data.docs);
                setPageCount(data.totalPages);
                setCurrentPage(data.page)
                setTotalDocs(data.totalDocs)
                console.log(data)
                //chat.socket.emit("get_unread");
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

    const handleClickDate = () =>{
      setCurrentPage(1)
      setFetching(!fetching)
    }
   
    const handleSelect = (value) =>{
      setCurrentPage(1)
      setLimit(value)
      setFetching(!fetching)
    }

    return (
      <div>
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
          <div className='parentSpecAsk'>
        {askSpecOfferUser?.map((item, index)=>
          <div key={index} className='childSpecAsk'>
            <Card>
              <Card.Header className="specNameDoc" onClick={()=>history.push(CARDSPECASK + '/' + item._id)}>
              <div className='boldtext'>№&nbsp; 
                {documentNum(item._id)}
              </div>
              <div>От {dateFormat(item?.Date, "dd/mm/yyyy HH:MM:ss")}</div>
              </Card.Header>
            <div className='cardPadding'>
              <div>
              <span className="specCloudy">Автор: </span>
              {item?.FIZ ? 
              `${item?.NameFiz + " " + item?.EmailFiz}`
              :
              `${item?.Author?.name + " " + item?.Author?.nameOrg}`
              }
              </div>
              <div><span className="specCloudy">Сумма: </span>{item?.Sum}</div>
              {!item?.FIZ ? 
                  <div><span className="specCloudy">Статус: </span>
                  {item?.Status?.Status ? 
                  <span className='statusLabel'>{item?.Status?.Status?.labelRu}</span>
                  :
                  <span className='statusLabel'>Доставлен поставщику</span>
                  }
                </div>
                :
                <div></div>
              }
            </div>
            </Card>
          </div>
        )} 
      </div>
          {askSpecOfferUser?.length!==0 ? 
                <ReactPaginate
                forcePage = {currentPage-1}
                previousLabel={"<"}
                nextLabel={">"}
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
            :
          <div></div>}
        </div>
        :
        <div class="loader">Loading...</div>
        }
     </div> 
    );
});

export default InvitedSpecOffer;