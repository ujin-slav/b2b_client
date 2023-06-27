import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useHistory} from 'react-router-dom';
import {Card, Form, InputGroup,Button,Row} from "react-bootstrap";
import { CARDASK } from '../utils/routes';
import { fetchIWinnerAsks} from "../http/askAPI";
import dateFormat, { masks } from "dateformat";
import ru from "date-fns/locale/ru"
import "../style.css";
import ReactPaginate from "react-paginate";
import {Search} from 'react-bootstrap-icons';
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import DatePicker, { registerLocale } from 'react-datepicker'
import { CircleFill } from 'react-bootstrap-icons';
import {checkAccessAsk} from '../utils/CheckAccessAsk'

const IWinner = observer(({authorId}) => {
    registerLocale("ru", ru)

    const [ask,setAsk] = useState([])
    const {myalert} = useContext(Context)
    const history = useHistory()
    const [pageCount, setPageCount] = useState(0)
    const [currentPage,setCurrentPage] = useState(1)
    const [fetching,setFetching] = useState(true)
    const [search,setSearch] = useState("")
    const [searchInn,setSearchInn] = useState("")
    const {user} = useContext(Context)
    const {chat} = useContext(Context)
    const [limit,setLimit] = useState(10)
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const [loading,setLoading] = useState(false)

    useEffect(() => {
      setLoading(true)
      fetchIWinnerAsks({
          userId:user.user.id,
          limit,
          search,
          searchInn,
          page:currentPage,
          startDate,
          endDate
          }).then((data)=>{
                  setAsk(data.docs);
                  setPageCount(data.totalPages);
                  setCurrentPage(data.page)
                  chat.socket.emit("get_unread")
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

    const redirect = (item)=>{
        history.push(CARDASK + '/' + item._id)
    }

    const handleSearch = () =>{
      setCurrentPage(1)
      setFetching(!fetching)
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
                <InputGroup>
                    <Form.Control
                        onChange={(e)=>setSearch(e.target.value)}
                        placeholder="Текст или название заявки"
                    />
                    <Button variant="outline-secondary" onClick={()=>handleSearch()}>
                        <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                    </Button>
                </InputGroup>
                <InputGroup className='mt-2'>
                    <Form.Control
                        onChange={(e)=>setSearchInn(e.target.value)}
                        placeholder="Назавние или инн организации"
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
      <div className='parentSpecAsk'>
        {ask?.map((item,index)=>{
          return (
            <div onClick={()=>redirect(item)} className='childSpecAsk'>
            <Card>
              <Card.Header>
              <div className="specName">
                    {item.Name.length>15 ?
                    `${item.Name.substring(0, 15)}...`
                    :
                    item.Name
                    }
            </div>
            </Card.Header>
            <div className='cardPadding'>
            <div>
            Текст: {item.Text.length>50 ?
            `${item.Text.substring(0, 50)}...`
             :
             item.Text
             }
            </div>
            <div>
                    {Date.parse(item.EndDateOffers) > new Date().getTime() ?
                    <div style={{color:"green"}}>
                    Активная
                    </div>
                    :
                    <div style={{color:"red"}}>
                    Истек срок
                    </div>
                    } 
            </div>
            <div>
                    <div>ИНН: {item.Author.inn}</div>
                    <div>Орг: {item.Author.nameOrg}</div>
            </div>
            <div className="specCloudy">
                {getCategoryName(item.Region, regionNodes).join(", ").length>40 ?
                `${getCategoryName(item.Region, regionNodes).join(", ").substring(0, 40)}...`
                :
                getCategoryName(item.Region, regionNodes).join(", ")
                }
            </div>
            <div className="specCloudy">
                {getCategoryName(item.Category, categoryNodes).join(", ").length>40 ?
                `${getCategoryName(item.Category, categoryNodes).join(", ").substring(0, 40)}...`
                :
                getCategoryName(item.Category, categoryNodes).join(", ")
                }
            </div>
            <div className="specCloudy">
                {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
            </div>
            </div>
            </Card>
            </div>
        )})}  
       
     </div> 
        {ask?.length!==0 ? 
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
            :
        <div></div>}
     </div>
    );
});

export default IWinner;