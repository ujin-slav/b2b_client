import React,{useState,useEffect,useRef,useContext} from 'react';
import {Card, Table,Form} from "react-bootstrap";
import PriceService from '../services/PriceService'
import dateFormat, { masks } from "dateformat";
import {CaretDownFill,CaretUpFill} from 'react-bootstrap-icons';
import { CARDSPECOFFER, CREATESPECOFFER } from '../utils/routes';
import {ORGINFO,CREATEPRICEASK, CREATEPRICEASKFIZ, UPLOADPRICE} from "../utils/routes";
import {useHistory} from 'react-router-dom';
import ReactPaginate from "react-paginate";
import { Cart4} from 'react-bootstrap-icons';
import {Context} from "../index";

const UserPrice = ({idorg,idprod}) => {
    
    const history = useHistory();
    const [loading,setLoading] = useState(true) 
    const [readMoreName,setReadMoreName] = useState([]) 
    const [price,setPrice] = useState([]); 
    const [width,setWidth] = useState() 
    const[visible,setVisible] = useState(false);
    const[totalDocs,setTotalDocs] = useState(0);
    const[fetching,setFetching] = useState(true);
    const[currentPage,setCurrentPage] = useState(1);
    const[search,setSearch] = useState("");
    const [pageCount, setpageCount] = useState(0);
    const input = useRef(null);
    const {user} = useContext(Context);
    let limit = 30

    const resizeWindow = () => {
        setWidth(window.innerWidth)
    }

    useEffect(()=>{
        window.addEventListener('resize',resizeWindow)
        setWidth(window.innerWidth)
        return ()=>{
            window.removeEventListener('resize',resizeWindow) 
        }
    },[])

    useEffect(() => {
        if(loading || fetching){
            if(price.length===0 || price.length<totalDocs) {
                if(idprod){
                    PriceService.getPriceUnit(idprod).then((data)=>{
                        setSearch(data.Name)
                        if(!data.errors){
                            setVisible(true)
                            getPrice()
                        }else{
                            setLoading(false)
                        }
                    })
                }else{
                    getPrice()
                }
            }
        }
    },[fetching,visible]);

    const getPrice = () =>{
        PriceService.getPrice({page:currentPage,limit,search,org:idorg}).then((data)=>{
            if(data){
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(data.page)
                setpageCount(data.totalPages);
            }
        }).finally(()=>{
            setLoading(false)
            setFetching(false)
        })
    }

    const fetchComments = async (currentPage) => {
        PriceService.getPrice({page:currentPage,limit,search,org:idorg}).then(
            (data)=>{
            setPrice(data.docs)
            setTotalDocs(data.totalDocs);
            setPrice(data.docs)
            setCurrentPage(data.page)
            setpageCount(data.totalPages)
        }).finally(()=>setLoading(false))
    };

    // const scrollHandler = (e) =>{
    //     if((e.target.documentElement.scrollHeight - 
    //         (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
    //             setFetching(true)
    //         }
    // }

    const handleSearch = (text) =>{
        PriceService.getPrice({page:1,limit,search:text,org:idorg}).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setpageCount(data.totalPages);
                setCurrentPage(1)
                setSearch(text)
        }).finally(
            ()=>setFetching(false)
        )
    }
    
    const handlePageClick = async (data) => {
        await fetchComments(data.selected+1);
    };

    const readMoreHandler = (id) => {
        if(readMoreName.includes(id)){
            setReadMoreName(readMoreName.filter(el=>el!==id))
        }else{
            setReadMoreName([...readMoreName,id])
        }
    }

    const readMoreGetText = (item) => {
        if(item.Name.length>50){
            return(
                <div>
                    {readMoreName.includes(item._id) ? item.Name : `${item.Name.substring(0, 50)}...`}
                    <a href="javascript:void(0)" onClick={() => readMoreHandler(item._id)}> 
                    {readMoreName.includes(item._id) ? 'Свернуть' : 'Показать больше'} </a>
                </div>
            )
        }else{
            return(
                <div>
                    {item.Name}
                </div>
            )
        }
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
                 <Form.Group className="mx-auto my-2">
                 <Form.Label>Поиск:</Form.Label>
                 <Form.Control
                     ref={input}
                     onChange={(e)=>handleSearch(e.target.value)}
                     placeholder="Начните набирать артикул или название продукта"
                 />
                </Form.Group>
                {width>650 ? 
                <Table>
                    <thead>
                        <tr>
                            <th>Артикул</th>
                            <th>Наименование</th>
                            <th>Цена</th>
                            <th>Остаток</th>
                            <th>Дата</th>
                            <th>+</th>
                        </tr>
                        </thead>
                        <tbody>
                            {price?.map((item,index)=>
                                <tr key={index}>
                                    <td>{item?.Code}</td>
                                    <td>{item?.SpecOffer ? 
                                    <button className='emptyButton'
                                      onClick={()=>history.push(CARDSPECOFFER + '/' + item?.SpecOffer)}>
                                         <span className='text-decoration-underline text-primary'>{item?.Name}</span> 
                                         <span className="text-danger"> Спецпредложение</span>
                                    </button>
                                    : 
                                    <span>{item?.Name}</span>
                                    }
                                    </td>
                                    <td>{item?.Price}</td>
                                    <td>{item?.Balance}</td>
                                    <td>{dateFormat(item.Date, "dd/mm/yyyy")}</td>
                                    <td><Cart4 color="#0D55FD" style={{"width": "25px", "height": "25px"}}
                                        onClick={()=>{
                                        if(user.isAuth){
                                            history.push(CREATEPRICEASK + '/' + item?.User?._id + '/' + item?._id)
                                        }else{
                                            history.push(CREATEPRICEASKFIZ + '/' + item?.User?._id + '/' + item?._id)
                                        }}}/>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                 </Table>
                 :
                 <div className='parentPrice'>
                 {price?.map((item,index)=>{
                    return(
                        <div key={index} className='childPrice'>
                            <div className='specInfo'>
                                <div>
                                    {item?.Code}
                                </div>
                                <div>
                                    {readMoreGetText(item)}
                                </div>
                                {item?.SpecOffer ? 
                                <button className='emptyButton'
                                    onClick={()=>history.push(CARDSPECOFFER + '/' + item?.SpecOffer)}>
                                    <span className="text-danger">Спецпредложение</span>
                                </button>
                                :
                                <span></span>
                                }
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
                                    Остаток: {item?.Balance}
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
                        </div>
                        )})}
                </div>
                }
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
                 </div>
                 :
                 <div></div>
                }
                </Card>
    );
};

export default UserPrice;