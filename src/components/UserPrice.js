import React,{useState,useEffect} from 'react';
import {Card, Table,Form} from "react-bootstrap";
import PriceService from '../services/PriceService'
import dateFormat, { masks } from "dateformat";
import {CaretDownFill,CaretUpFill} from 'react-bootstrap-icons';
import waiting from "../waiting.gif";
import { CARDSPECOFFER, CREATESPECOFFER } from '../utils/routes';
import {useHistory} from 'react-router-dom';

const UserPrice = ({id}) => {
    
    const history = useHistory();
    const [loading,setLoading] = useState(true) 
    const [price,setPrice] = useState([]); 
    const[visible,setVisible] = useState(false);
    const[totalDocs,setTotalDocs] = useState(0);
    const[fetching,setFetching] = useState(true);
    const[currentPage,setCurrentPage] = useState();
    const[search,setSearch] = useState("");
    let limit = 30

    useEffect(() => {
        if(loading || fetching){
            if(price.length===0 || price.length<totalDocs) {
            PriceService.getPrice({page:currentPage,limit,search,org:id}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice([...price, ...data.docs]);
                setCurrentPage(prevState=>prevState + 1)
            }).finally(()=>{
                setLoading(false)
                setFetching(false)
            })
            }
        }
    },[fetching,visible]);

    useEffect(() => {
        document.addEventListener('scroll',scrollHandler);
        return function(){
            document.removeEventListener('scroll',scrollHandler);
        }
    },[]);

    const scrollHandler = (e) =>{
        if((e.target.documentElement.scrollHeight - 
            (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
                setFetching(true)
            }
    }

    const handleSearch = (e) =>{
        PriceService.getPrice({page:currentPage,limit,search,org:id}).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(prevState=>prevState + 1)
                setSearch(e.target.value)
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
                     onChange={handleSearch}
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
                                    <td>{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</td>
                                </tr>
                            )}
                        </tbody>
                 </Table>
                 </div>
                 :
                 <div></div>
                }
                </Card>
        </div>
    );
};

export default UserPrice;