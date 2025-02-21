import {React,useContext,useEffect,useState} from 'react';
import {Card, Form, InputGroup,Button,Row} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import SpecOfferService from '../services/SpecOfferService'
import {useParams} from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import {Context} from "../index";
import PriceService from '../services/PriceService'
import dateFormat from "dateformat";
import {Search} from 'react-bootstrap-icons';
import DatePicker, { registerLocale } from 'react-datepicker'
import {getCategoryName} from '../utils/Convert'
import { regionNodes } from '../config/Region';
import CardSpecOffer from '../pages/CardSpecOffer';
import { CARDSPECOFFER,CREATEPRICE, MYPRICE } from '../utils/routes';
import ReactPaginate from "react-paginate";
import { PlusCircleFill,XCircle,Pen} from 'react-bootstrap-icons';
import ModalAlert from '../components/ModalAlert';
import bin from "../icons/bin.svg";
import excel from "../icons/excel.svg";


const MyPrices = observer(() => {

    const [prices, setPrices] = useState([]);
    const {myalert} = useContext(Context);
    const history = useHistory();
    const [modalActive,setModalActive] = useState(false);
    const [deleteId,setDeleteId] = useState();
    const [pageCount, setPageCount] = useState(0);
    const {user} = useContext(Context);
    const [search,setSearch] = useState("")
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(false)
    const [fetching,setFetching] = useState(true)
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const [limit,setLimit] = useState(10)

    useEffect(() => {
        setLoading(true)
        PriceService.getPricesUser({
            id:user.user.id,
            limit,
            search,
            page:currentPage,
            startDate,
            endDate
            }).then((data)=>{
                    setPrices(data.docs);
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

    const handleClickDate = () =>{
        setCurrentPage(1)
        setFetching(!fetching)
    }

    const handleSelect = (value) =>{
        setCurrentPage(1)
        setLimit(value)
        setFetching(!fetching)
    }
  
    const deletePrice = async () =>{
        const result = await PriceService.clearPrice({org:user.user.id,priceId: deleteId});
        if (result.status===200){
            myalert.setMessage("Успешно");
            setCurrentPage(1)
            setFetching(!fetching)
        } else {
            myalert.setMessage(result.data.message);
        }
    }
   
    return (
        <div>
             <Form className="searchFormMenu">
            <Row> 
                <InputGroup>
                    <Form.Control
                        onChange={(e)=>setSearch(e.target.value)}
                        placeholder="Текст или название прайса"
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
        <PlusCircleFill onClick={()=>history.push(CREATEPRICE)}  className="addSpecOffer"/>
        <span className="createNewOfferText">Загрузить новый прайс</span>
        {!loading ? 
            <div>
                <div className='parentSpec'>
                {prices?.map((item)=>{
                return(
                    <div onClick={()=>history.push(MYPRICE + '/' + item._id)} className='childSpec'>
                        <div  className="delSpecOfferContainer">
                            {/* <XCircle className="delSpecOffer"
                                onClick={(e)=>{
                                    e.stopPropagation()
                                    setModalActive(true);
                                    setDeleteId(item._id)
                                }}
                            /> */}
                            <img 
                                className="delSpecOffer" 
                                src={bin}
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    setModalActive(true);
                                    setDeleteId(item._id)
                                }}
                            /> 
                        </div>
                        <img 
                        className="fotoSpec"
                        src={excel} />
                        <div className="specName">
                            {item.Name}
                        </div>
                        <div className="specNameOrg">
                            {item.NameOrg}
                        </div>
                        <div className="specCloudy">
                            {getCategoryName(item.Region, regionNodes).join(", ").length>40 ?
                            `${getCategoryName(item.Region, regionNodes).join(", ").substring(0, 40)}...`
                            :
                            getCategoryName(item.Region, regionNodes).join(", ")
                            }
                        </div>
                        <div className="specCloudy">
                            {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
                        </div>
                    </div>
                    
                )
                })}
            </div>
            {prices?.length!==0 ? 
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
                <ModalAlert header="Вы действительно хотите удалить" 
                active={modalActive} 
                setActive={setModalActive} funRes={deletePrice}/>
            </div> 
        : 
            <div class="loader">Loading...</div>
        }
        </div>
    );
});

export default MyPrices;