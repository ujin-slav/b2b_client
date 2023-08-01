import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card,InputGroup,Button,Col,Row} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { ADMIN_ASKSPAMLIST, CARDASK, MODIFYASK } from '../utils/routes';
import DatePicker, { registerLocale } from 'react-datepicker'
import ru from "date-fns/locale/ru"
import "../style.css";
import ReactPaginate from "react-paginate";
import ModalAlert from '../components/ModalAlert';
import AdminService from '../services/AdminService'
import { XCircle, Pen,Link45deg,Eye } from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import {Form} from "react-bootstrap";
import {Search} from 'react-bootstrap-icons';
import StatusAsk from '../components/StatusAsk';

const AdminAsk = () => {
    registerLocale("ru", ru)

    const [ask, setAsk] = useState([])
    const {user} = useContext(Context);
    const {myalert} = useContext(Context);
    const [deleteId,setDeleteId] = useState();
    const [modalActive,setModalActive] = useState(false);
    const history = useHistory();
    const[fetching,setFetching] = useState(true);
    const[loading,setLoading] = useState(false);
    const[currentPage,setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const[search,setSearch] = useState("");
    const[searchInn,setSearchInn] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const[limit,setLimit] = useState(10);

    useEffect(() => {
        setLoading(true)
        AdminService.getAsks({
            limit,
            searchText:search,
            searchInn,
            page:currentPage,
            startDate,
            endDate
            }).then((data)=>{
                    console.log(data)
                    setAsk(data.docs);
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

    const deleteAsk = async () =>{
      const result = await AdminService.deleteAsk(deleteId);
      if (result.status===200){
        myalert.setMessage("Успешно"); 
        setFetching(!fetching)
      } else {
        myalert.setMessage(result.data.message);
      }
    }

    const handlePageClick = async (data) => {
      await fetchPage(data.selected + 1);
    };
    
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
                        placeholder="Текст сообщения"
                    />
                    <Button variant="outline-secondary" onClick={()=>handleSearch()}>
                        <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                    </Button>
                </InputGroup>
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
            {ask?.map((item, index)=>
                <div onClick={()=>redirect(item)} className='childSpecAsk'>
                <Card>
                    <Card.Header>
                    <span className="cardMenu">
                    <XCircle color="red"  className='menuIcon'
                        onClick={(e)=>{
                        e.stopPropagation();
                        setModalActive(true);
                        setDeleteId(item._id)
                        }} />
                    </span> 
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
                    <StatusAsk 
                        EndDateOffers={item.EndDateOffers}
                        Winner={item.Winner}
                    />
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
                    <div>
                    <a href="javascript:void(0)" 
                        onClick={(e)=>{
                            e.stopPropagation();
                            history.push(MODIFYASK + '/' + item._id)
                    }}>
                    Редактировать
                    </a>
                    <Pen  className="changeSpecOffer"/>
                    </div>
                    <div>
                    <a href="javascript:void(0)" 
                        onClick={(e)=>{
                            e.stopPropagation();
                            history.push(ADMIN_ASKSPAMLIST + '/' + item._id)
                    }}>
                    Лист организаций
                    </a>
                    </div>
                        <div>
                        Отправлено пакетов {item?.CountSentMailPack}
                        </div>
                    <div>
                    <a href="javascript:void(0)" 
                        onClick={(e)=>{
                            e.stopPropagation();
                            navigator.clipboard.writeText(process.env.REACT_APP_URL + CARDASK + '/' + item._id)
                            myalert.setMessage("Ссылка скопирована");
                        }}>
                    Скопировать ссылку
                    </a>
                    <Link45deg  className="changeSpecOffer"/>
                    </div>
                    <div>
                        <div><span className="specCloudy">Файлы: </span></div>
                        {item?.Files?.map((item,index)=><div key={index}>
                                        <a href={process.env.REACT_APP_API_URL + `download/` + item.filename}>{item.originalname}</a>
                                        <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                                        ${process.env.REACT_APP_API_URL}download/${item.filename}`)}/>
                                    </div>)}
                        </div>
                    <div className="specCloudy">
                    {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
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
                setActive={setModalActive} funRes={deleteAsk}/>
            </div>
         :
         <div class="loader">Loading...</div>
        }
        </div>
    );
};

export default AdminAsk;