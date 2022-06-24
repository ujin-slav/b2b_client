import React,{useState,useEffect,useParams,useContext} from 'react';
import {Card, Table, Col, Container, Row, Lable,Form,Button} from "react-bootstrap";
import dateFormat, { masks } from "dateformat";
import PriceService from '../services/PriceService'
import { XCircle} from 'react-bootstrap-icons';
import { fetchUser} from '../http/askAPI';
import {Context} from "../index";

const CreatePriceAsk = () => {
    //const {id} = useParams();
    const [recevier, setRecevier] = useState();
    const [org, setOrg] = useState();
    const[fetching,setFetching] = useState(true);
    const [price,setPrice] = useState([]); 
    const [sumTotal,setSumTotal] = useState(0); 
    const [result,setResult] = useState([]); 
    const[totalDocs,setTotalDocs] = useState(0);
    const[currentPage,setCurrentPage] = useState();
    const[search,setSearch] = useState("");
    const {myalert} = useContext(Context);
    let limit = 30

    useEffect(() => {
        if(fetching){
            if(price.length===0 || price.length<totalDocs) {
            PriceService.getPrice({page:currentPage,limit,search,org:"619e4028315b602a6439ff05"}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice([...price, ...data.docs]);
                setCurrentPage(prevState=>prevState + 1)
            }).finally(()=>setFetching(false))
            }
        }
    },[fetching]);

    useEffect(() => {
        fetchUser("619e4028315b602a6439ff05").then((data)=>{
            setRecevier(data)
        })
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
        PriceService.getPrice({page:currentPage,limit,search,org:"619e4028315b602a6439ff05"}).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(prevState=>prevState + 1)
                setSearch(e.target.value)
        }).finally(
            ()=>setFetching(false)
        )
    }
    
    const addToResult=(e,item)=>{
        let searchResult = false
        result.map((el,index)=>{
            if(el._id===item._id){
                searchResult = true
                result[index].Count = result[index].Count + 1
                return
            }
        })
        if(searchResult){
            setResult([...result])   
        }else{
            item.Count=1
            setResult([...result, item])  
        }
        setSumTotal(sumTotal + item.Price)
    }

    const delFromResult=(index)=>{
        setSumTotal(sumTotal - result[index].Price*result[index].Count)
        const newResult = result.filter((_,itemIndex) => index !== itemIndex)
        setResult(newResult)
    }

    const changeInput=(e,item)=>{
        let totalSum = 0
        result.map((el,index)=>{
            if(el._id===item._id){
                result[index].Count = e.target.value
            }
            totalSum = totalSum + result[index].Count * result[index].Price
        })
        setSumTotal(totalSum)
        setResult([...result]) 
    }

    const saveOrder=async()=>{
        const res = await PriceService.saveAsk({doc:result})
        if (res.ok){
            myalert.setMessage("Успешно"); 
        } else {
            myalert.setMessage(res?.data?.message);
        }
    }

    return (
        <div class="container-priceask">
        <div class="container-priceask-center">   
            <div>
            <Form.Group className="mx-auto my-2">
                <Form.Label>Получатель: {recevier?.name}, {recevier?.nameOrg},
                    ИНН: {recevier?.inn}
                </Form.Label>
            </Form.Group> 
            <Form.Group className="mx-auto my-2">
                <Form.Label>Поиск:</Form.Label>
                <Form.Control
                    onChange={handleSearch}
                    placeholder="Начните набирать артикул или название продукта"
                />
            </Form.Group>
            <div class="table-responsive">
                <Table class="table table-hover">
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
                            <tr key={index} onClick={(e)=>addToResult(e,item)}>
                                <td>{item?.Code}</td>
                                <td>{item?.Name}</td>
                                <td>{item?.Price}</td>
                                <td>{item?.Balance}</td>
                                <td>{dateFormat(item.Date, "dd/mm/yyyy")}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            </div>
            <div class="border-price">
            <div class="table-responsive">
                <Table  class="table table-hover">
                <thead>
                    <tr>
                        <th>Артикул</th>
                        <th>Наименование</th>
                        <th>Цена</th>
                        <th>Кол-во</th>
                        <th>Сумма</th>
                        <th>Del</th>
                    </tr>
                    </thead>
                    <tbody>
                        {result?.map((item,index)=>
                            <tr key={index}>
                                <td>{item.Code}</td>
                                <td>{item.Name}</td>
                                <td>{item.Price}</td>
                                <td style={{"width": "100px","padding":"3px"}}>
                                    <Form.Control 
                                        defaultValue={item.Count}
                                        type="number"
                                        onChange={(e)=>changeInput(e,item)}
                                    />
                                </td>
                                <td>{item.Count*item.Price}</td>
                                <td><XCircle color="red" 
                                style={{"width": "25px", "height": "20px"}} 
                                onClick={()=>delFromResult(index)}/></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <hr style={{"border": "none","background-color": "black","height": "5px"}}/>
                <div class="total-sum">
                    Сумма итого:<span style={{"font-weight":"500"}}>  {sumTotal}</span>
                    <div>Всего наименований: {result.length}</div>
                    </div>
            </div>
            <div  style={{"text-align": "right"}}>
            <Button
                variant="primary"
                className="btn mx-3 mt-3"
                onClick={saveOrder}
                >
                Записать
            </Button>
            <Button
                variant="primary"
                className="btn btn-success mt-3"
                >
                Отправить поставщику
            </Button>
        </div>
        </div>
        </div>
    );
};

export default CreatePriceAsk;