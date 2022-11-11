import React,{useEffect, useState,useContext} from 'react';
import PriceService from '../services/PriceService'
import {
    Table,
    Card
  } from "react-bootstrap";
 import CardOrg from '../components/CardOrg'; 
 import {Context} from "../index";
 import dateFormat, { masks } from "dateformat";
 import {ORGINFO,CREATEPRICEASK, CREATEPRICEASKFIZ, UPLOADPRICE} from "../utils/routes";
 import {useHistory} from 'react-router-dom';
 import {observer} from "mobx-react-lite";
 import {getCategoryName} from '../utils/Convert'
 import RegionTree from '../components/RegionTree';
 import { regionNodes } from '../config/Region';
 import ModalCT from '../components/ModalCT';
 import { Cart4,CaretDownFill,CaretUpFill,PlusCircleFill} from 'react-bootstrap-icons';
 import ReactPaginate from "react-paginate";
 import waiting from "../waiting.gif";

const Prices = observer(() => {
    const [readMoreName,setReadMoreName] = useState(false) 
    const [loading,setLoading] = useState(true) 
    const [width,setWidth] = useState() 
    const {user} = useContext(Context);
    const[price,setPrice] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const[visible,setVisible] = useState(false);
    const[currentPage,setCurrentPage] = useState(1);
    const[totalDocs,setTotalDocs] = useState(0);
    const[search,setSearch] = useState("");
    const history = useHistory();
    let limit = 30

    useEffect(()=>{
        window.addEventListener('resize',resizeWindow)
        setWidth(window.innerWidth)
        return ()=>{
            window.removeEventListener('resize',resizeWindow) 
        }
    },[])

    useEffect(() => {
        if(visible){
            if(price.length===0 || price.length<totalDocs) {
            PriceService.getPrice({page:currentPage,limit,search}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(prevState=>prevState + 1)
                setpageCount(data.totalPages);
            }).finally(()=>setLoading(false))
            }
        }  
    },[visible]);

    const resizeWindow = () => {
        setWidth(window.innerWidth)
    }

    const fetchComments = async (currentPage) => {
        PriceService.getPrice({page:currentPage,limit,search}).then(
            (data)=>{
            setPrice(data.docs);
        }).finally(()=>setLoading(false))
    };
    
    const handlePageClick = async (data) => {
        setCurrentPage(data.selected + 1)
        await fetchComments(data.selected + 1);
      };

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
                        </div>)}
                    </div>
                </div>
            }
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
    );
});

export default Prices;