import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card,InputGroup,Button,Col,Row,Form} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { CARDASK,CREATEASK } from '../utils/routes';
import { fetchFilterAsks,fetchUser } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import dateFormat, { masks } from "dateformat";
import {getCategoryName} from '../utils/Convert'
import DatePicker, { registerLocale } from 'react-datepicker'
import { categoryNodes } from '../config/Category';
import {Search} from 'react-bootstrap-icons';
import { regionNodes } from '../config/Region';
import { PlusCircleFill,CaretDownFill,CaretUpFill} from 'react-bootstrap-icons';
import {checkAccessAsk} from '../utils/CheckAccessAsk'


const TableAsk = observer(({authorId}) => {
    const {ask} = useContext(Context);
    const [loading,setLoading] = useState(false) 
    const [asks, setAsks] = useState([])
    const {myalert} = useContext(Context);
    const history = useHistory();
    const[fetching,setFetching] = useState(true);
    const[visible,setVisible] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const[search,setSearch] = useState("");
    const {user} = useContext(Context);
    const [currentPage,setCurrentPage] = useState(1)
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const[limit,setLimit] = useState(10);

    useEffect(() => {
      if(visible){
        setLoading(true)
        fetchFilterAsks({
          filterCat:ask.categoryFilter,
          filterRegion:ask.regionFilter,
          searchText:ask.searchText,
          searchInn:ask.searchInn,
          startDate,
          endDate,
          limit,
          page:currentPage
          }).then((data)=>{
                setAsks(data.docs);
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

    const redirect = (item)=>{
      if(checkAccessAsk(user,item).Open){
        history.push(CARDASK + '/' + item._id)
      } else {
        myalert.setMessage("Пользователь ограничил участников");
      }
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

    if (loading){
      return(
            <Card className='section'>
            <Card.Header className='sectionHeader headerAsks' 
            onClick={()=>setVisible(!visible)}>
              <div className='sectionName'>
              {visible ?
                    <CaretUpFill className='caret'/>
                    :
                    <CaretDownFill className='caret'/>
                }
                Заявки
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
      <Card className='section'>
        <Card.Header className='sectionHeader headerAsks' 
        onClick={()=>setVisible(!visible)}>
          <div className='sectionName'>
          {visible ?
                <CaretUpFill className='caret'/>
                :
                <CaretDownFill className='caret'/>
            }
            Заявки
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
          <PlusCircleFill onClick={()=>history.push(CREATEASK)}  className="addNew"/>
          <span className="createNew">Создать новое</span>
        <div className='parentSpecAsk'>
        {asks.map((item,index)=>{
          if(!checkAccessAsk(user,item).Open){
            return (
              <div onClick={()=>redirect(item)} className='childSpecAsk'>
              <Card>
              <Card.Header>
                <div className="specName blurry-text-head">
                     Название 
                </div>
              </Card.Header>
              <div className='cardPadding'>
                <div className="blurry-text">
                    Название
                </div>
                <div className="blurry-text">
                    Текст
                </div>
                <div className="blurry-text">
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
                <div className="blurry-text">
                        <div>ИНН: 8888888888</div>
                        <div>Орг: Название</div>
                </div>
                <div className="blurry-text">
                    Регионы
                </div>
                <div className="blurry-text">
                    Категории
                </div>
                <div className="blurry-text">
                    {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
                </div>
              </div>
              </Card>
              </div>
            )
          }else{
            return( 
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
        )}})}  
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

export default TableAsk;