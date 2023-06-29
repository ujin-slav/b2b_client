import React,{useState,useEffect,useContext,useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import {InputGroup, Table, Col, Container, Row, Lable,Form,Button} from "react-bootstrap";
import dateFormat, { masks } from "dateformat";
import PriceService from '../services/PriceService'
import { XCircle} from 'react-bootstrap-icons';
import { fetchUser} from '../http/askAPI';
import {Context} from "../index";
import { MYORDERSPRICE } from '../utils/routes';

const CreatePriceAsk = () => {
    const {chat} =  useContext(Context)
    const {idorg,idprod} = useParams();
    const [recevier, setRecevier] = useState();
    const [org, setOrg] = useState();
    const[fetching,setFetching] = useState(true);
    const [price,setPrice] = useState([]); 
    const history = useHistory();
    const [sumTotal,setSumTotal] = useState(0); 
    const [result,setResult] = useState([]); 
    const[totalDocs,setTotalDocs] = useState(0);
    const[currentPage,setCurrentPage] = useState(1);
    const[comment,setComment] = useState("");
    const[search,setSearch] = useState("");
    const {myalert} = useContext(Context);
    const {user} = useContext(Context);
    const[check,setCheck]  = useState( {data: {
        onlySpec:false
    }});
    const table = useRef(null)
    let limit = 30

    useEffect(() => {
        if(fetching){
            if(price.length===0 || price.length<totalDocs) {
            PriceService.getPrice({page:currentPage,limit,search,org:idorg,spec:check.data.onlySpec}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice([...price, ...data.docs]);
                setCurrentPage(prevState=>prevState + 1)
            }).finally(()=>setFetching(false))
        }
        }
    },[fetching]);

    useEffect(() => {
        if(idprod){
            PriceService.getPriceUnit(idprod).then((data)=>{
                addToResult(null,data)
            })
        }
        fetchUser(idorg).then((data)=>{
            setRecevier(data)
        })
        const element = table.current;
        element.addEventListener('scroll',scrollHandler);
        return function(){
            element.removeEventListener('scroll',scrollHandler);
        }
    },[]);

    const scrollHandler = (e) =>{
        if((e.target.scrollHeight - e.target.offsetHeight)<e.target.scrollTop+1){
            setFetching(true)
        }
    }

    const handleChecked = (e) =>{
        const { name, checked } = e.target;
        let data = check.data
        data[name] = checked
        setCheck({data})
        handleSearch(search)
    }

    const handleSearch = (text) =>{
        PriceService.getPrice({page:1,limit,search:text,org:idorg,spec:check.data.onlySpec}).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(2)
                setSearch(text)
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

    const saveOrder=async(Sent)=>{
        const res = await PriceService.saveAsk(
            {Table:result,
            To:idorg,
            Comment:comment,
            Author:user.user.id,
            Sum:sumTotal,
            Sent,
            FIZ:false
        })
        if (res.status===200){
            myalert.setMessage("Успешно"); 
            if(Sent){
                const data = {
                    To:idorg
                }
                chat.socket.emit("unread_invitedPrice", data);
            }
            history.push(MYORDERSPRICE)
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
                    onChange={(e)=>{handleSearch(e.target.value)}}
                    placeholder="Начните набирать артикул или название продукта"
                />
            </Form.Group>
            <InputGroup className="mt-3">
                <Form.Check
                    name="onlySpec"
                    type="checkbox"
                    checked={check.data.onlySpec}
                    onChange={handleChecked}
                >
                </Form.Check>
                <Form.Label>Показать только специальные предложения.</Form.Label>
            </InputGroup>
            <div class="table-responsive" ref={table}>
                <Table class="table table-hover">
                <thead>
                    <tr>
                        <th>Артикул</th>
                        <th>Наименование</th>
                        <th>Цена</th>
                        <th>Остаток</th>
                        <th>Ед.изм</th>
                        <th>Дата</th>
                    </tr>
                </thead>
                    <tbody>
                        {price?.map((item,index)=>
                            <tr key={index} onClick={(e)=>addToResult(e,item)}>
                                <td>{item?.Code}</td>
                                <td class="pointer">{item?.Name}</td>
                                <td>{item?.Price}</td>
                                <td>{item?.Balance}</td>
                                <td>{item?.Measure}</td>
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
                        <th>Ед.изм</th>
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
                                <td>{item.Measure}</td>
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
            <Form.Group className="mx-auto my-2">
                <Form.Control
                    onChange={(e)=>setComment(e.target.value)}
                    placeholder="Комментарий к заказу"
                    as="textarea"
                />
            </Form.Group>
            <Button
                variant="primary"
                className="btn mx-3 mt-3"
                onClick={()=>saveOrder(false)}
                >
                Записать
            </Button>
            <Button
                variant="primary"
                className="btn btn-success mt-3"
                onClick={()=>saveOrder(true)}
                >
                Отправить поставщику
            </Button>
        </div>
        </div>
        </div>
    );
};

export default CreatePriceAsk;