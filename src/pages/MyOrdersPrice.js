import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card, Form, InputGroup,Button,Col,Row} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { MODIFYPRICEASK,CARDPRICEASK } from '../utils/routes';
import "../style.css";
import ru from "date-fns/locale/ru"
import ReactPaginate from "react-paginate";
import ModalAlert from '../components/ModalAlert';
import {ORGINFO} from "../utils/routes";
import AskService from '../services/AskService'
import { XCircle, Search} from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import PriceService from '../services/PriceService'
import DatePicker, { registerLocale } from 'react-datepicker'

const MyOrdersPrice = () => {
    registerLocale("ru", ru)

    const {user} = useContext(Context);
    const [askPriceUser, setAskPriceUser] = useState([])
    const {myalert} = useContext(Context);
    const [deleteId,setDeleteId] = useState();
    const [modalActive,setModalActive] = useState(false);
    const history = useHistory();
    const [pageCount, setPageCount] = useState(0)
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
      PriceService.getAskPrice({
          authorId:user.user.id,
          limit,
          searchInn,
          searchComment,
          page:currentPage,
          startDate,
          endDate
          }).then((data)=>{
            console.log(data)
                  setAskPriceUser(data.docs);
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
      await fetchPage(data.selected + 1);
    }

    const handleSearchInn = () =>{
      setCurrentPage(1)
      setFetching(!fetching)
    }

    const handleSearchComment = () =>{
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
                <InputGroup className='mt-2'>
                    <Form.Control
                        onChange={(e)=>setSearchComment(e.target.value)}
                        placeholder="Комментарий к закупке"
                    />
                    <Button variant="outline-secondary" onClick={()=>handleSearchComment()}>
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
        {askPriceUser?.map((item, index)=>
          <div key={index}  
            className='childSpecAsk'
          >
            <Card>
              <Card.Header  className="specNameDoc"
                  onClick={()=>item?.Sent ?
                    history.push(CARDPRICEASK + '/' + item._id)
                    :
                    history.push(MODIFYPRICEASK + '/' + item._id)
                  }
              >
              <div>№ 
                  {dateFormat(item?.Date, "ddmmyyyyHHMMss")}
              </div>
              <div>от {dateFormat(item?.Date, "dd/mm/yyyy HH:MM:ss")}</div>
              <span className="cardMenu">
                     <XCircle color="red"  className='menuIcon'
                    onClick={(e)=>{
                    e.stopPropagation();
                    setModalActive(true);
                    setDeleteId(item._id)
              }} />     
              </span> 
              </Card.Header>
            <div className='cardPadding'>
            <div><span className="specCloudy">Получатель: </span> 
              <a href="javascript:void(0)" onClick={(e)=>{
                e.stopPropagation()
                history.push(ORGINFO + '/' + item?.To?._id)
              }}>
                {item?.To?.name}, {item?.To?.nameOrg}
              </a>
            </div>
            <div><span className="specCloudy">Стоимость: </span>{item?.Sum}</div>
            <div></div>
            <div><span className="specCloudy">Отправлен: </span>{item?.Sent ?
                    <span style={{"color":"green"}}>
                    Да
                    </span>
                    :
                    <span  style={{"color":"red"}}>
                    Нет</span>
            }</div>
            {item?.Sent ?
              <div><span className="specCloudy">Статус: </span>{item?.Status?.Status?.labelRu}</div>
              :
              <div></div>
            }
            <div>
              <span className="specCloudy">Комментарий к закупке: </span>
              {item?.Comment?.length > 50 ? 
              `${item?.Comment?.substring(0,50)}...`
              :
              item?.Comment
              }
            </div>
            <div>
            </div>
          </div>
          </Card>
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
              setActive={setModalActive} funRes={deletePriceAsk}/>
        </div>
        :
        <div class="loader">Loading...</div>
        }
     </div> 
    );
};

export default MyOrdersPrice;