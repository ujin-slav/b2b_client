import React,{useState,useEffect,useRef} from 'react';
import {Card, Table,Form} from "react-bootstrap";
import PriceService from '../services/PriceService'
import dateFormat, { masks } from "dateformat";
import {CaretDownFill,CaretUpFill} from 'react-bootstrap-icons';
import waiting from "../waiting.gif";
import { CARDSPECOFFER, CREATESPECOFFER } from '../utils/routes';
import {useHistory} from 'react-router-dom';
import ReactPaginate from "react-paginate";

const UserPrice = ({idorg,idprod}) => {
    
    const history = useHistory();
    const [loading,setLoading] = useState(true) 
    const [price,setPrice] = useState([]); 
    const[visible,setVisible] = useState(false);
    const[totalDocs,setTotalDocs] = useState(0);
    const[fetching,setFetching] = useState(true);
    const[currentPage,setCurrentPage] = useState(1);
    const[search,setSearch] = useState("");
    const [pageCount, setpageCount] = useState(0);
    const input = useRef(null);
    let limit = 30

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
            setTotalDocs(data.totalDocs);
            setPrice([...price, ...data.docs]);
            setCurrentPage(prevState=>prevState + 1)
            setpageCount(data.totalPages);
        }).finally(()=>{
            setLoading(false)
            setFetching(false)
        })
    }

    const fetchComments = async (currentPage) => {
        PriceService.getPrice({page:currentPage,limit,search,org:idorg}).then(
            (data)=>{
            setPrice(data.docs);
        }).finally(()=>setLoading(false))
    };

    // const scrollHandler = (e) =>{
    //     if((e.target.documentElement.scrollHeight - 
    //         (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
    //             setFetching(true)
    //         }
    // }

    const handleSearch = (value) =>{
        PriceService.getPrice({page:1,limit,search,org:idorg}).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setpageCount(data.totalPages);
                setCurrentPage(prevState=>prevState + 1)
                setSearch(value)
        }).finally(
            ()=>setFetching(false)
        )
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
                  <img className="gifWaiting" src={waiting}/>
                :
                <div></div>
              }
              </Card>
        )
       }
    
    const handlePageClick = async (data) => {
        setCurrentPage(data.selected + 1)
        await fetchComments(data.selected + 1);
    };

    return (
        <div>
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
                <Table>
                    <thead>
                        <tr>
                            <th>Артикул</th>
                            <th>Наименование</th>
                            <th>Цена</th>
                            <th>Остаток</th>
                            <th>Дата</th>
                        </tr>
                        </thead>
                        <tbody>
                            {price?.map((item,index)=>
                                <tr key={index}>
                                    <td>{item?.Code}</td>
                                    <td>{item?.SpecOffer ? 
                                    <button className="myButtonMessage"
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
                                </tr>
                            )}
                        </tbody>
                 </Table>
                 <ReactPaginate
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
        </div>
    );
};

export default UserPrice;