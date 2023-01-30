import {React,useContext,useEffect,useState} from 'react';
import {Card,InputGroup,Button,Col,Row,Form} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import SpecOfferService from '../services/SpecOfferService'
import {useHistory} from 'react-router-dom';
import {Context} from "../index";
import dateFormat from "dateformat";
import {getCategoryName} from '../utils/Convert'
import { regionNodes } from '../config/Region';
import DatePicker, { registerLocale } from 'react-datepicker'
import CardSpecOffer from '../pages/CardSpecOffer';
import { CARDSPECOFFER, CREATESPECOFFER } from '../utils/routes';
import ReactPaginate from "react-paginate";
import {CaretDownFill,CaretUpFill,PlusCircleFill,Search} from 'react-bootstrap-icons';


const SpecOffersTable = observer(() => {
    const [loading,setLoading] = useState(true) 
    const {ask} = useContext(Context);
    const [specOffers, setSpecOffers] = useState([]);
    const[visible,setVisible] = useState(false);
    const {myalert} = useContext(Context);
    const[fetching,setFetching] = useState(true);
    const history = useHistory();
    const [pageCount, setPageCount] = useState(0);
    const {user} = useContext(Context);
    const [currentPage,setCurrentPage] = useState(1)
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const[limit,setLimit] = useState(10);

    useEffect(() => {
    if(visible){
        setLoading(true)
        SpecOfferService.getFilterSpecOffer({
          filterCat:ask.categoryFilter,
          filterRegion:ask.regionFilter,
          searchText:ask.searchText,
          searchInn:ask.searchInn,
          startDate,
          endDate,
          limit,page:currentPage}).then((data)=>{
                setSpecOffers(data.docs)
                setPageCount(data.totalPages);
                setCurrentPage(data.page)
        }).finally(()=>setLoading(false))
    }
      },[ask.categoryFilter,ask.regionFilter,ask.searchText,ask.searchInn,visible,fetching]);

    const fetchPage = async (currentPage) => {
        setCurrentPage(currentPage)
        setFetching(!fetching)
    };

    const handlePageClick = async (data) => {
      await fetchPage(data.selected + 1);
    };

    const handleClickDate = () =>{
      setCurrentPage(1)
      setFetching(!fetching)
    }

    const handleSelect = (value) =>{
          setCurrentPage(1)
          setLimit(value)
          setFetching(!fetching)
    }
    
    if (loading){
        return(
            <Card className='section sectionOffers'>
            <Card.Header className='sectionHeaderOffer headerOffers' 
            onClick={()=>setVisible(!visible)}>
              <div className='sectionName'>
              {visible ?
                    <CaretUpFill className='caret'/>
                    :
                    <CaretDownFill className='caret'/>
                }
                Специальные предложения
              </div>
            </Card.Header>
              {visible ?
                  <div class="loader">Loading...</div>
                :
                <div></div>
              }
              </Card>
        )
       }

    return (
        <Card className='section sectionOffers'>
        <Card.Header className='sectionHeaderOffer headerOffers' 
        onClick={()=>setVisible(!visible)}>
          <div className='sectionName'>
          {visible ?
                <CaretUpFill className='caret'/>
                :
                <CaretDownFill className='caret'/>
            }
            Специальные предложения
          </div>
        </Card.Header>
        {visible ?
        <div>
              <Form className="searchFormMenu searchFormMenuMain">
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
          <PlusCircleFill onClick={()=>history.push(CREATESPECOFFER)}  className="addNew"/>
          <span className="createNew">Создать новое</span>
        <div className='parentSpec'>
            {specOffers.map((item)=>{
            return(
                <div onClick={()=>history.push(CARDSPECOFFER + '/' + item._id)} className='childSpec'>
                    <img 
                    className="fotoSpec"
                    src={process.env.REACT_APP_API_URL + `getpic/` + item?.Files[0]?.filename} />
                    <div className='specInfo'>
                      <div className="specName">
                          {item.Name}
                      </div>
                      <div className="specPrice">
                          {item.Price} ₽
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
                </div>
            )
            })}
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
        <div></div>
        }
        </Card>
    );
});

export default SpecOffersTable;