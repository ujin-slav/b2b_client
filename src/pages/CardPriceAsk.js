import React,{useState,useEffect,useContext} from 'react';
import {Card, Table, Col, Container, Row, Lable,Form,Button} from "react-bootstrap";
import dateFormat, { masks } from "dateformat";
import PriceService from '../services/PriceService'
import { XCircle} from 'react-bootstrap-icons';
import { fetchUser} from '../http/askAPI';
import {Context} from "../index";
import {useParams} from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import { MYORDERSPRICE } from '../utils/routes';
const CardPriceAsk = () => {
    
    const {id} = useParams();
    const [recevier, setRecevier] = useState();
    const [price,setPrice] = useState([]); 
    const [sumTotal,setSumTotal] = useState(0); 
    const [result,setResult] = useState([]); 
    const [dateDoc,setDateDoc] = useState()
    const [sent,setSent] = useState(false); 
    const[comment,setComment] = useState("");

    useEffect(() => {
        PriceService.getAskPriceId(id).then((data)=>{
            setResult(data.Table)
            setRecevier(data.To)
            setSumTotal(data.Sum)
            setComment(data.Comment)
            setSent(data.Sent)
            setDateDoc(data.Date)
        })
    },[]);

   

    return (
        <div class="container-priceask">
        <div class="container-priceask-center"> 
            <Form.Group className="mx-auto my-2">
                <Form.Label>Получатель: {recevier?.name}, {recevier?.nameOrg},
                    ИНН: {recevier?.inn}
                </Form.Label>
            </Form.Group>   
            <Form.Group className="mx-auto my-2">
                <Form.Label>
                    Дата документа: {dateFormat(dateDoc, "dd/mm/yyyy HH:MM:ss")}
                </Form.Label>
            </Form.Group>  
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
                                        value={item.Count}
                                        type="number"
                                    />
                                </td>
                                <td>{item.Count*item.Price}</td>
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
                    placeholder="Комментарий"
                />
            </Form.Group>
        </div>
        </div>
        </div>
    );
};

export default CardPriceAsk;