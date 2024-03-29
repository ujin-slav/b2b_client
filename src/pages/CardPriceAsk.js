import React,{useState,useEffect,useContext} from 'react';
import {Table,Form} from "react-bootstrap";
import dateFormat, { masks } from "dateformat";
import PriceService from '../services/PriceService'
import {Card,Container} from "react-bootstrap";
import {useParams} from 'react-router-dom';
import * as XLSX from 'xlsx';
import { FileEarmarkSpreadsheet } from 'react-bootstrap-icons';
import OrderStatus from './OrderStatus';
import ModalCT from '../components/ModalCT';
import MessageBox from '../components/MessageBox';

const CardPriceAsk = () => {
    
    const {id} = useParams();
    const [recevier, setRecevier] = useState();
    const [author, setAuthor] = useState();
    const [price,setPrice] = useState([]); 
    const [sumTotal,setSumTotal] = useState(0); 
    const [modalActiveMessage,setModalActiveMessage] = useState(false)
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
    const [error, setError] = useState()

    useEffect(() => {
        PriceService.getAskPriceId(id).then((result)=>{
            if(result.status===200){
                setResult(result.data.Table)
                setRecevier(result.data.To)
                setSumTotal(result.data.Sum)
                setComment(result.data.Comment)
                setSent(result.data.Sent)
                setDateDoc(result.data.Date)
                setAuthor(result.data.Author)
                setFiz(
                    {
                        FIZ:result.data.FIZ,
                        NameFiz:result.data.NameFiz,
                        EmailFiz:result.data.EmailFiz,
                        TelefonFiz:result.data.TelefonFiz
                    }
                )
            }else{
                setError(result.data.errors)
            }
        })
    },[]);

    const saveToFile = () => { 
        const fileName = `ZAKAZ${id}.xlsx`;
        const aoa = [
            ["Автор",fiz.FIZ ? 
            `${fiz.NameFiz + ", " + fiz.EmailFiz + ", " +  fiz.TelefonFiz}`
            :
            `${author?.name + ", " + author?.nameOrg}`],
            ["Дата документа",dateFormat(dateDoc, "dd/mm/yyyy HH:MM:ss")],
            ["Комментарий к заказу", comment],
            [""],
            ["Артикул", "Наименование", "Цена", "Кол-во","Сумма"],
        ]
        result.map((item)=>{
            aoa.push([item.Code,item.Name,item.Price,item.Count,item.Count*item.Price])
        })
        aoa.push(["","","","Итог:",sumTotal])
        aoa.push(["","","","Всего наименований:",result.length])
		const ws = XLSX.utils.aoa_to_sheet(aoa);
        var wscols = [
            {wch:25},
            {wch:60},
            {wch:15},
            {wch:15},
            {wch:15},
        ];
        ws['!cols'] = wscols
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'test');

		XLSX.writeFile(wb, fileName);
    }

    if(error){
        return(
            <div>
              <Container
                      className="d-flex justify-content-center align-items-center"
                      style={{height: window.innerHeight - 54}}
                      >
                  <Card style={{width: 600}} className="p-5 ">
                      <h5>Заяка не существует, или удалена.</h5>
                  </Card> 
              </Container>
            </div>
        )
      }

    return (
        <div class="container-priceask">
        <div class="container-priceask-center"  id="productTable"> 
            <Form.Group className="mx-auto my-2">
                <Form.Label><span className="boldtext">Автор:</span> 
                <span className="mx-2">
                    {fiz.FIZ ? 
                    `${fiz.NameFiz + ", " + fiz.EmailFiz + ", " +  fiz.TelefonFiz}`
                    :
                    <span>
                        {author?.name + ", " + author?.nameOrg}
                        <button className="myButtonMessage mx-1"
                            onClick={()=>setModalActiveMessage(true)}>
                            Написать сообщение
                            <i className="col-2 fa fa-solid fa-paper-plane colorBlue"/>
                        </button>
                    </span>
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
            <div style={{"text-align":"right"}}>
                <a href="javascript:void(0)" onClick={()=>saveToFile()}>
                Скачать в формате excel
                </a>
                <FileEarmarkSpreadsheet color="green" style={{"width": "25px", "height": "25px"}}/>
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
        {!fiz.FIZ ? 
            <OrderStatus priceAskId={id}/> 
            :
            <div></div>
        }
        </div>
        <ModalCT 
                  header="Сообщение" 
                  active={modalActiveMessage}
                  component={<MessageBox author={author} setActive={setModalActiveMessage}/>}
                  setActive={setModalActiveMessage}   
        />
        </div>
    );
};

export default CardPriceAsk;