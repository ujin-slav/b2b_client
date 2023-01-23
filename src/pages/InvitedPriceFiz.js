import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card, Form, InputGroup,Button,Col,Row} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { MODIFYPRICEASK,CARDPRICEASK } from '../utils/routes';
import ru from "date-fns/locale/ru"
import "../style.css";
import ReactPaginate from "react-paginate";
import ModalAlert from '../components/ModalAlert';
import AskService from '../services/AskService'
import { XCircle, Search} from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import PriceService from '../services/PriceService'
import DatePicker, { registerLocale } from 'react-datepicker'

const InvitedPriceAskFiz =  observer(() => {
  registerLocale("ru", ru)

  const {user} = useContext(Context);
  const {chat} = useContext(Context)
  const [askPriceUser, setAskPriceUser] = useState([])
  const {myalert} = useContext(Context);
  const [deleteId,setDeleteId] = useState();
  const [modalActive,setModalActive] = useState(false);
  const history = useHistory();
  const [pageCount, setPageCount] = useState(0)
  const [currentPage,setCurrentPage] = useState(1)
  const[search,setSearch] = useState("");
  const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
  const [endDate, setEndDate] = useState(new Date());
  const [loading,setLoading] = useState(false)
  const[fetching,setFetching] = useState(true);
  const[limit,setLimit] = useState(10);

    useEffect(() => {
      setLoading(true)
      PriceService.getAskPriceFiz({
          to:user.user.id,
          limit,
          search,
          page:currentPage,
          startDate,
          endDate
          }).then((data)=>{
                  setAskPriceUser(data.docs);
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

    const handleSearch = () =>{
      setCurrentPage(1)
      setFetching(!fetching)
    }

    const handleClickDate = () =>{
      setCurrentPage(1)
      setFetching(!fetching)
    }
   
    const handleSelect = (value) =>{
      setLimit(value)
      setFetching(!fetching)
    }

    return (
      <div>
        <Form className="searchFormMenu">
            <Row> 
                <InputGroup className='mt-2'>
                    <Form.Control
                        onChange={(e)=>setSearch(e.target.value)}
                        placeholder="Имя, имейл или телефон физ.лица"
                    />
                    <Button variant="outline-secondary" onClick={()=>handleSearch()}>
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
          <div key={index} className='childSpecAsk'>
            <Card>
              <Card.Header className="specNameDoc" onClick={()=>history.push(CARDPRICEASK + '/' + item._id)}>
              <div className='boldtext'>№ 
                {dateFormat(item?.Date, "ddmmyyyyHHMMss")}
              </div>
              <div>От {dateFormat(item?.Date, "dd/mm/yyyy HH:MM:ss")}</div>
              </Card.Header>
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
        <div></div>
        }
     </div> 
    );
});

export default InvitedPriceAskFiz;