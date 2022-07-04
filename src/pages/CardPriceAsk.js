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
import * as XLSX from 'xlsx';

const CardPriceAsk = () => {
    
    const {id} = useParams();
    const [recevier, setRecevier] = useState();
    const [author, setAuthor] = useState();
    const [price,setPrice] = useState([]); 
    const [sumTotal,setSumTotal] = useState(0); 
    const [result,setResult] = useState([]); 
    const [dateDoc,setDateDoc] = useState()
    const [fiz,setFiz] = useState(
        {
            FIZ:false,
            NameFiz:"",
            EmailFiz:"",
            TelefonFiz:""
        }
    )
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
            setAuthor(data.Author)
            setFiz(
                {
                    FIZ:data.FIZ,
                    NameFiz:data.NameFiz,
                    EmailFiz:data.EmailFiz,
                    TelefonFiz:data.TelefonFiz
                }
            )
        })
    },[]);

    const saveToFile = () => {
        
        const fileName = 'test.xlsx';

		const ws = XLSX.utils.json_to_sheet(result);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'test');

		XLSX.writeFile(wb, fileName);
    }

    return (
        <div class="container-priceask">
        <div class="container-priceask-center"> 
            <Form.Group className="mx-auto my-2">
                <Form.Label><span className="boldtext">Автор:</span> 
                <span className="mx-2">
                    {fiz.FIZ ? 
                    `${fiz.NameFiz + ", " + fiz.EmailFiz + ", " +  fiz.TelefonFiz}`
                    :
                    `${author?.name + ", " + author?.nameOrg}`
                    }
                </span>
                </Form.Label>
            </Form.Group>   
            <Form.Group className="mx-auto my-2">
                <Form.Label><span class="boldtext">Получатель:</span>
                <span className="mx-2">
                    {recevier?.name}, {recevier?.nameOrg}
                </span>
                </Form.Label>
            </Form.Group>   
            <Form.Group className="mx-auto my-2">
                <Form.Label>
                <span class="boldtext">
                    Дата документа: 
                </span>  
                <span className="mx-2">
                    {dateFormat(dateDoc, "dd/mm/yyyy HH:MM:ss")}
                </span>
                </Form.Label>
            </Form.Group>
            <div class="mb-3 row">
                <label for="inputPassword" class="col-sm-2 col-form-label boldtext">
                    Комментарий к заказу
                </label>
                <div class="col-sm-10">
                    <Form.Control
                        value={comment}
                        placeholder="Комментарий"
                        as="textarea"
                    />
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
        </div>
        <Button
            variant="primary"
            className="btn btn-success mt-3 mx-3"
            onClick={()=>saveToFile()}
        >
            Сохранить
        </Button>
        </div>
        </div>
    );
};

export default CardPriceAsk;