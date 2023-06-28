import React,{useEffect, useState,useContext} from 'react';
import PriceService from '../services/PriceService'
import DatePicker, { registerLocale } from 'react-datepicker'
import CardOrg from '../components/CardOrg'; 
import {Context} from "../index";
import dateFormat, { masks } from "dateformat";
import {ORGINFO,CREATEPRICEASK, CREATEPRICEASKFIZ, UPLOADPRICE} from "../utils/routes";
import {Card,InputGroup,Button,Col,Row,Form,Table} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import {observer} from "mobx-react-lite";
import {getCategoryName} from '../utils/Convert'
import RegionTree from '../components/RegionTree';
import { regionNodes } from '../config/Region';
import ModalCT from '../components/ModalCT';
import { Cart4,CaretDownFill,CaretUpFill,PlusCircleFill,Search} from 'react-bootstrap-icons';
import ReactPaginate from "react-paginate";

const Prices = observer(() => {
    const {ask} = useContext(Context);
    const [readMoreName,setReadMoreName] = useState(false) 
    const [loading,setLoading] = useState(true) 
    const [width,setWidth] = useState() 
    const {user} = useContext(Context);
    const[price,setPrice] = useState([]);
    const[visible,setVisible] = useState(false);
    const[totalDocs,setTotalDocs] = useState(0);
    const[fetching,setFetching] = useState(true);
    const[search,setSearch] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const history = useHistory();
    const [currentPage,setCurrentPage] = useState(1)
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const[limit,setLimit] = useState(10);

    useEffect(()=>{
        window.addEventListener('resize',resizeWindow)
        setWidth(window.innerWidth)
        return ()=>{
            window.removeEventListener('resize',resizeWindow) 
        }
    },[])

    useEffect(() => {
        if(visible){
            setLoading(true)
            PriceService.getFilterPrice({
              filterCat:ask.categoryFilter,
              filterRegion:ask.regionFilter,
              searchText:ask.searchText,
              searchInn:ask.searchInn,
              startDate,
              endDate,
              limit,page:currentPage}).then((data)=>{
                    setPrice(data.docs);
                    setPageCount(data.totalPages);
                    setCurrentPage(data.page)
            }).finally(()=>setLoading(false))
        }
    },[ask.categoryFilter,ask.regionFilter,ask.searchText,ask.searchInn,visible,fetching]);

    const resizeWindow = () => {
        setWidth(window.innerWidth)
    }

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
            <Card className='section'>
            <Card.Header className='sectionHeader headerPrices' 
            onClick={()=>setVisible(!visible)}>
              <div className='sectionName'>
              {visible ?
                    <CaretUpFill className='caret'/>
                    :
                    <CaretDownFill className='caret'/>
                }
                Прайс
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
        <Card.Header className='sectionHeader headerPrices' 
        onClick={()=>setVisible(!visible)}>
          <div className='sectionName'>
          {visible ?
                <CaretUpFill className='caret'/>
                :
                <CaretDownFill className='caret'/>
            }
            Прайс
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
            <PlusCircleFill onClick={()=>history.push(UPLOADPRICE)}  className="addNew"/>
                 <span className="createNew">Загрузить свой прайс</span>
            {width>650 ? 
                   <Table>
                   <thead>
                      <tr>
                          <th>Артикул</th>
                          <th>Наименование</th>
                          <th>Цена</th>
                          <th>Остаток</th>
                          <th>Ед.изм</th>
                          <th>Организация</th>
                          <th>Дата</th>
                          <th>+</th>
                      </tr>
                      </thead>
                      <tbody>
                          {price?.map((item,index)=>
                          
                              <tr key={index}>
                                  <td>{item?.Code}</td>
                                  <td>{item?.Name}</td>
                                  <td>{item?.Price}</td>
                                  <td>{item?.Balance}</td>
                                  <td>{item?.Measure}</td>
                                  <td> <a href="javascript:void(0)" onClick={()=>history.push(ORGINFO + '/' + item?.User?._id)}>
                                      {item?.User?.nameOrg}</a></td>
                                  <td>{dateFormat(item.Date, "dd/mm/yyyy")}</td>
                                  <td><Cart4 color="#0D55FD" style={{"width": "25px", "height": "25px"}}
                                  onClick={()=>{
                                      if(user.isAuth){
                                          history.push(CREATEPRICEASK + '/' + item?.User?._id + '/' + item?._id)
                                      }else{
                                          history.push(CREATEPRICEASKFIZ + '/' + item?.User?._id + '/' + item?._id)
                                      }
                                  }}
                                  /></td>
                              </tr>
                          )}
                       </tbody>
                  </Table>
            : 
                <div>
                    <div className='parentPrice'>
                        {price?.map((item,index)=>
                        <div key={index} className='childPrice'>
                            <div className='specInfo'>
                                <div>
                                    {item?.Code}
                                </div>
                                <div>
                                    {readMoreName ? item.Name : `${item.Name.substring(0, 50)}...`}
                                    <a href="javascript:void(0)" onClick={() => setReadMoreName(!readMoreName)}> 
                                    {readMoreName ? 'Свернуть' : 'Показать больше'} </a>
                                </div>
                                <div>
                                    Цена: {item?.Price} ₽
                                    <Cart4 color="#0D55FD" className='iconCartMobile'
                                    onClick={()=>{
                                        if(user.isAuth){
                                            history.push(CREATEPRICEASK + '/' + item?.User?._id + '/' + item?._id)
                                        }else{
                                            history.push(CREATEPRICEASKFIZ + '/' + item?.User?._id + '/' + item?._id)
                                        }
                                    }}
                                    />
                                </div>
                                <div>
                                    Остаток: {item?.Balance} {item?.Measure}
                                </div>
                                <div>
                                    <a href="javascript:void(0)" onClick={()=>history.push(ORGINFO + '/' + item?.User?._id)}>
                                      {item?.User?.nameOrg}
                                    </a>
                                </div>
                                <div className="specCloudy">
                                    {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
                                </div>
                            </div>
                        </div>)}
                    </div>
                </div>
            }
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

export default Prices;