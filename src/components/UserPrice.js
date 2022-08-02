import React,{useState,useEffect} from 'react';
import {Card, Table,Form} from "react-bootstrap";
import PriceService from '../services/PriceService'
import dateFormat, { masks } from "dateformat";
import {CaretDownFill,CaretUpFill} from 'react-bootstrap-icons';
import waiting from "../waiting.gif";

const UserPrice = ({id}) => {

    const [loading,setLoading] = useState(true) 
    const [price,setPrice] = useState([]); 
    const[visible,setVisible] = useState(false);
    const[totalDocs,setTotalDocs] = useState(0);
    const[currentPage,setCurrentPage] = useState();
    const[search,setSearch] = useState("");
    let limit = 30

    useEffect(() => {
        if(loading){
            if(price.length===0 || price.length<totalDocs) {
            PriceService.getPrice({page:currentPage,limit,search,org:id}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice([...price, ...data.docs]);
                setCurrentPage(prevState=>prevState + 1)
            }).finally(()=>setLoading(false))
            }
        }
    },[visible]);

    useEffect(() => {
        document.addEventListener('scroll',scrollHandler);
        return function(){
            document.removeEventListener('scroll',scrollHandler);
        }
    },[]);

    const scrollHandler = (e) =>{
        if((e.target.documentElement.scrollHeight - 
            (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
                setLoading(true)
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
            ()=>setLoading(false)
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
                                    <td>{item?.Name}</td>
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