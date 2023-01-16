import React,{useEffect,useState,useContext} from 'react';
import {useHistory} from 'react-router-dom';
import ru from "date-fns/locale/ru"
import {Card, Form, InputGroup,Button,Col,Row} from "react-bootstrap";
import {Context} from "../index";
import ModalAlert from './ModalAlert';
import AskService from '../services/AskService'
import { XCircle, Search} from 'react-bootstrap-icons';
import ReactPaginate from "react-paginate";
import {observer} from "mobx-react-lite";
import {Eye} from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import { CARDASK} from '../utils/routes';
import DatePicker, { registerLocale } from 'react-datepicker'

const TableOffer = observer(() => {
    registerLocale("ru", ru)

    const [offers,setOffers] = useState([]);;
    const [modalActive,setModalActive] = useState(false);
    const [deleteId,setDeleteId] = useState();
    const history = useHistory();
    const {user} = useContext(Context);  
    const {myalert} = useContext(Context);
    const[fetching,setFetching] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const[search,setSearch] = useState("");
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(false)
    const[limit,setLimit] = useState(10);

    useEffect(() => {
      setLoading(true)
      AskService.fetchUserOffers({
          authorId:user.user.id,
          limit,
          search,
          page:currentPage,
          startDate,
          endDate
          }).then((data)=>{
                  console.log(data)
                  setOffers(data.docs);
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

    const deleteOffer = async () =>{
      const result = await AskService.deleteOffer(deleteId);
      if (result.status===200){
        myalert.setMessage("Успешно"); 
        setLoading(!fetching)
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
                <InputGroup>
                    <Form.Control
                        onChange={(e)=>setSearch(e.target.value)}
                        placeholder="Название, текст или комментарий"
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
        <div className='parentSpecAsk'>
        {offers.map((item,index)=>
          <div key={index} className='childSpecAsk'>
            <Card>
              <Card.Header onClick={()=>history.push(CARDASK + '/' + item?.Ask)} >
              <div className="specNameDoc">№ 
                  {dateFormat(item?.Date, "ddmmyyyyHHMMss")}
                </div>
              <div>от {dateFormat(item?.Date, "dd/mm/yyyy HH:MM:ss")}</div>
              <span className="cardMenu">
                     <XCircle color="red"  className='menuIcon'
                    onClick={(e)=>{
                    e.stopPropagation();
                    setModalActive(true);
                    setDeleteId(item._id)
              }}/>     
            </span> 
             </Card.Header>
            <div className='cardPadding'>
            <div>
            <div>{item?.Ask?.Author?.name}</div> 
            <div>{item?.Ask?.Author?.nameOrg}</div>
            </div>
            <div className="tdText">
            {item?.Ask?.Text?.length > 50 ? 
              `${item?.Ask?.Text?.substring(0,50)}...`
              :
              item?.Ask?.Text
            }
            </div>
            <div><span className="specCloudy">Текст: </span>{item?.Text?.length > 30 ? 
              `${item?.Text?.substring(0,30)}...`
              :
              item?.Text
              }</div>
            <div><span className="specCloudy">Стоимость: </span>{item?.Price}</div>
            <div>
            <div><span className="specCloudy">Файлы: </span></div>
            {item?.Files?.map((item,index)=><div key={index}>
                              <a href={process.env.REACT_APP_API_URL + `download/` + item.filename}>{item.originalname}</a>
                              <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                              ${process.env.REACT_APP_API_URL}download/${item.filename}`)}/>
                          </div>)}
            </div>
            <div className="specCloudy">{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</div>
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
              setActive={setModalActive} funRes={deleteOffer}/>
    </div>
    );
});

export default TableOffer;